import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import type { GameState, GameStatus, FallingWord, Particle, Achievement, Level, ScoreRecord, PlayerProfile, AchievementDef } from '../types'
import { ALL_ACHIEVEMENTS } from '../types'
import { getLevelById, getLevelsByCategory, levels } from '../data/words'

/** localStorage key */
const PROFILE_KEY = 'typing-kids-profile'

function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {
    playerName: '',
    totalGames: 0,
    totalScore: 0,
    totalWords: 0,
    bestCombo: 0,
    unlockedAchievements: [],
    completedLevels: [],
    lastPlayed: '',
  }
}

function saveProfile(p: PlayerProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
}

export const useGameStore = defineStore('game', () => {
  // ====== 核心游戏状态 ======
  const status = ref<GameStatus>('idle')
  const currentLevel = ref<Level | null>(null)
  const score = ref(0)
  const combo = ref(0)
  const maxCombo = ref(0)
  const correct = ref(0)
  const total = ref(0)
  const lives = ref(5)
  const startTime = ref(0)
  const elapsedTime = ref(0)
  const activeWords = ref<FallingWord[]>([])
  const currentInput = ref('')
  const currentTargetId = ref<number | null>(null)
  const particles = ref<Particle[]>([])
  const showAchievement = ref<Achievement | null>(null)

  // 排行榜和成绩记录
  const records = ref<ScoreRecord[]>([])
  const leaderboard = ref<ScoreRecord[]>([])

  // ====== 玩家档案（持久化） ======
  const profile = ref<PlayerProfile>(loadProfile())

  /** 持久化档案 */
  function persistProfile() {
    saveProfile(profile.value)
  }

  let wordIdCounter = 0
  let gameTimer: ReturnType<typeof setInterval> | null = null
  let spawnTimer: ReturnType<typeof setInterval> | null = null
  let particleTimer: ReturnType<typeof setInterval> | null = null

  // ====== 计算属性 ======
  const accuracy = computed(() => {
    if (total.value === 0) return 100
    return Math.round((correct.value / total.value) * 100)
  })

  const wpm = computed(() => {
    const minutes = elapsedTime.value / 60
    if (minutes === 0) return 0
    const charsPerWord = 5
    return Math.round(correct.value / charsPerWord / minutes)
  })

  const isPassed = computed(() => {
    if (!currentLevel.value) return false
    return score.value >= currentLevel.value.targetScore
  })

  const remainingTime = computed(() => {
    if (!currentLevel.value || currentLevel.value.timeLimit === 0) return Infinity
    return currentLevel.value.timeLimit - elapsedTime.value
  })

  /** 所有成就定义（附带解锁状态） */
  const achievementList = computed(() => {
    return ALL_ACHIEVEMENTS.map(def => ({
      ...def,
      unlocked: profile.value.unlockedAchievements.includes(def.id),
    }))
  })

  /** 已解锁成就数量 */
  const unlockedCount = computed(() => profile.value.unlockedAchievements.length)

  /** 总关卡数 */
  const totalLevels = computed(() => levels.length)

  /** 已通关数量 */
  const completedCount = computed(() => profile.value.completedLevels.length)

  // ====== 游戏方法 ======

  /** 开始游戏 */
  function startGame(levelId: number) {
    const level = getLevelById(levelId)
    if (!level) return

    // 重置状态
    currentLevel.value = level
    score.value = 0
    combo.value = 0
    maxCombo.value = 0
    correct.value = 0
    total.value = 0
    lives.value = level.livesCount
    startTime.value = Date.now()
    elapsedTime.value = 0
    activeWords.value = []
    currentInput.value = ''
    currentTargetId.value = null
    particles.value = []
    showAchievement.value = null
    status.value = 'playing'
    wordIdCounter = 0

    // 开始计时
    gameTimer = setInterval(() => {
      elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)

      if (level.timeLimit > 0 && elapsedTime.value >= level.timeLimit) {
        if (score.value >= level.targetScore) {
          completeLevel()
        } else {
          endGame()
        }
      }
    }, 200)

    // 开始生成单词
    spawnWord()
    spawnTimer = setInterval(() => {
      if (status.value === 'playing') {
        spawnWord()
      }
    }, level.spawnInterval)

    // 粒子动画循环
    particleTimer = setInterval(() => {
      updateParticles()
      moveWords()
    }, 50)
  }

  function calcXRange(len: number): [number, number] {
    if (len > 30) return [42, 58]
    if (len > 15) return [32, 68]
    if (len > 8)  return [22, 78]
    if (len > 4)  return [14, 86]
    return [10, 90]
  }

  function spawnWord() {
    const level = currentLevel.value
    if (!level || level.words.length === 0) return

    const word = level.words[Math.floor(Math.random() * level.words.length)]

    const [minX, maxX] = calcXRange(word.text.length)
    const newWord: FallingWord = {
      id: ++wordIdCounter,
      word,
      x: minX + Math.random() * (maxX - minX),
      y: 2,
      typed: '',
      speed: level.speed * (0.7 + Math.random() * 0.6),
      active: currentTargetId.value === null,
    }

    activeWords.value.push(newWord)

    if (currentTargetId.value === null) {
      currentTargetId.value = newWord.id
      newWord.active = true
    }
  }

  function moveWords() {
    const level = currentLevel.value
    if (!level) return

    for (const word of activeWords.value) {
      word.y += word.speed
    }

    const bottomWords = activeWords.value.filter(w => w.y >= 95)
    for (const w of bottomWords) {
      if (w.active) {
        loseLife()
      }
      removeWord(w.id)
    }
  }

  function handleKeyPress(key: string) {
    if (status.value !== 'playing') return

    if (key === 'Backspace' || key === 'Delete') {
      if (currentInput.value.length > 0) {
        currentInput.value = currentInput.value.slice(0, -1)
        if (currentTargetId.value !== null) {
          const word = activeWords.value.find(w => w.id === currentTargetId.value)
          if (word) {
            word.typed = currentInput.value
          }
        }
      }
      return
    }

    if (key.length !== 1) return

    currentInput.value += key

    const matchedWord = findMatchingWord(currentInput.value)

    if (matchedWord) {
      matchedWord.typed = currentInput.value

      if (currentInput.value === matchedWord.word.text) {
        onWordComplete(matchedWord)
      } else if (!matchedWord.active) {
        if (currentTargetId.value !== null) {
          const prev = activeWords.value.find(w => w.id === currentTargetId.value!)
          if (prev) prev.active = false
        }
        currentTargetId.value = matchedWord.id
        matchedWord.active = true
      }
    } else {
      const targetWord = currentTargetId.value !== null
        ? activeWords.value.find(w => w.id === currentTargetId.value)
        : null

      if (targetWord && targetWord.word.text.startsWith(currentInput.value)) {
        targetWord.typed = currentInput.value
      } else {
        total.value++
        combo.value = 0
        currentInput.value = ''
        if (targetWord) {
          targetWord.typed = ''
        }
      }
    }
  }

  function findMatchingWord(input: string): FallingWord | undefined {
    if (currentTargetId.value !== null) {
      const current = activeWords.value.find(w => w.id === currentTargetId.value)
      if (current && current.word.text.startsWith(input)) {
        return current
      }
    }
    return activeWords.value.find(w => w.word.text.startsWith(input))
  }

  function onWordComplete(word: FallingWord) {
    combo.value++
    total.value++
    correct.value++

    if (combo.value > maxCombo.value) {
      maxCombo.value = combo.value
    }

    const basePoints = word.word.text.length * 10
    const comboBonus = Math.min(combo.value - 1, 10) * 5
    const earnedPoints = basePoints + comboBonus
    score.value += earnedPoints

    spawnParticles(word.x, word.y, word.word.text.length)

    // 移除单词
    removeWord(word.id)
    currentInput.value = ''
    currentTargetId.value = null

    // 检查实时成就（连击类）
    checkAchievements()

    // 自动选择下一个目标
    if (activeWords.value.length > 0) {
      const next = activeWords.value[0]
      currentTargetId.value = next.id
      next.active = true
    }

    // 检查是否过关
    if (currentLevel.value && score.value >= currentLevel.value.targetScore) {
      completeLevel()
    }
  }

  function loseLife() {
    lives.value--
    combo.value = 0

    if (lives.value <= 0) {
      endGame()
    }
  }

  function removeWord(id: number) {
    activeWords.value = activeWords.value.filter(w => w.id !== id)
    if (currentTargetId.value === id) {
      currentTargetId.value = null
      currentInput.value = ''
    }
  }

  function spawnParticles(x: number, y: number, count: number) {
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8FE8', '#FFB347']
    for (let i = 0; i < count * 3; i++) {
      const angle = (Math.PI * 2 * i) / (count * 3)
      const speed = 1 + Math.random() * 3
      particles.value.push({
        id: Date.now() + i,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        size: 3 + Math.random() * 5,
      })
    }
  }

  function updateParticles() {
    particles.value = particles.value
      .map(p => ({
        ...p,
        x: p.x + p.vx * 0.3,
        y: p.y + p.vy * 0.3,
        life: p.life - 0.02,
      }))
      .filter(p => p.life > 0)
  }

  // ====== 成就系统 ======

  /** 检查并弹出新成就 */
  function checkAchievements() {
    const stats = {
      combo: combo.value,
      correct: correct.value,
      total: total.value,
      maxCombo: maxCombo.value,
      totalWords: profile.value.totalWords,
      totalScore: profile.value.totalScore,
      totalGames: profile.value.totalGames,
      completedLevels: profile.value.completedLevels.length,
    }

    for (const def of ALL_ACHIEVEMENTS) {
      // 已解锁 → 跳过
      if (profile.value.unlockedAchievements.includes(def.id)) continue
      // 条件不满足 → 跳过
      if (!def.condition(stats)) continue

      // 新成就解锁！
      profile.value.unlockedAchievements.push(def.id)
      persistProfile()

      // 弹出成就通知
      showAchievement.value = {
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
      }

      // 3 秒后自动消失
      setTimeout(() => {
        if (showAchievement.value?.id === def.id) {
          showAchievement.value = null
        }
      }, 3000)
    }
  }

  // ====== 过关 / 结束 ======

  function completeLevel() {
    status.value = 'levelcomplete'
    clearAllTimers()

    // 更新玩家档案
    if (currentLevel.value) {
      if (!profile.value.completedLevels.includes(currentLevel.value.id)) {
        profile.value.completedLevels.push(currentLevel.value.id)
      }
      profile.value.totalScore += score.value
      profile.value.totalWords += correct.value
      if (maxCombo.value > profile.value.bestCombo) {
        profile.value.bestCombo = maxCombo.value
      }
      profile.value.totalGames++
      profile.value.lastPlayed = new Date().toISOString()
      persistProfile()
    }

    // 检查累计成就
    checkAchievements()
  }

  function endGame() {
    status.value = 'over'
    clearAllTimers()

    // 更新玩家档案（即使没通过也记录）
    if (currentLevel.value) {
      profile.value.totalScore += score.value
      profile.value.totalWords += correct.value
      if (maxCombo.value > profile.value.bestCombo) {
        profile.value.bestCombo = maxCombo.value
      }
      profile.value.totalGames++
      profile.value.lastPlayed = new Date().toISOString()
      persistProfile()
    }

    // 检查累计成就
    checkAchievements()
  }

  function togglePause() {
    if (status.value === 'playing') {
      status.value = 'paused'
      clearAllTimers()
    } else if (status.value === 'paused') {
      status.value = 'playing'
      gameTimer = setInterval(() => {
        elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
      }, 200)
      spawnTimer = setInterval(() => {
        if (status.value === 'playing') spawnWord()
      }, currentLevel.value!.spawnInterval)
      particleTimer = setInterval(() => {
        updateParticles()
        moveWords()
      }, 50)
    }
  }

  function clearAllTimers() {
    if (gameTimer) { clearInterval(gameTimer); gameTimer = null }
    if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null }
    if (particleTimer) { clearInterval(particleTimer); particleTimer = null }
  }

  function reset() {
    clearAllTimers()
    status.value = 'idle'
    currentLevel.value = null
    score.value = 0
    combo.value = 0
    maxCombo.value = 0
    correct.value = 0
    total.value = 0
    lives.value = 5
    elapsedTime.value = 0
    activeWords.value = []
    currentInput.value = ''
    currentTargetId.value = null
    particles.value = []
    showAchievement.value = null
  }

  /** 重置玩家档案 */
  function resetProfile() {
    profile.value = {
      playerName: '',
      totalGames: 0,
      totalScore: 0,
      totalWords: 0,
      bestCombo: 0,
      unlockedAchievements: [],
      completedLevels: [],
      lastPlayed: '',
    }
    persistProfile()
  }

  /** 更新玩家名 */
  function setPlayerName(name: string) {
    profile.value.playerName = name
    persistProfile()
  }

  // ====== 排行榜 ======

  async function saveScore(playerName: string): Promise<void> {
    if (!currentLevel.value) return
    try {
      const saved = await invoke<ScoreRecord>('submit_score', {
        data: {
          playerName,
          levelId: currentLevel.value.id,
          category: currentLevel.value.category,
          score: score.value,
          accuracy: accuracy.value,
          wpm: wpm.value,
          maxCombo: maxCombo.value,
          timeSeconds: elapsedTime.value,
        },
      })
      records.value.push(saved)
    } catch {
      records.value.push({
        playerName,
        levelId: currentLevel.value.id,
        category: currentLevel.value.category,
        score: score.value,
        accuracy: accuracy.value,
        wpm: wpm.value,
        maxCombo: maxCombo.value,
        timeSeconds: elapsedTime.value,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      })
    }
  }

  async function fetchLeaderboard(levelId?: number): Promise<void> {
    try {
      const entries = await invoke<ScoreRecord[]>('get_top_scores', {
        levelId: levelId ?? null,
        limit: 20,
      })
      leaderboard.value = entries
    } catch {
      leaderboard.value = []
    }
  }

  function getNextLevelId(): number | null {
    if (!currentLevel.value) return null
    const categoryLevels = getLevelsByCategory(currentLevel.value.category)
    const idx = categoryLevels.findIndex(l => l.id === currentLevel.value!.id)
    if (idx < 0 || idx >= categoryLevels.length - 1) return null
    return categoryLevels[idx + 1].id
  }

  return {
    // state
    status, currentLevel, score, combo, maxCombo, correct, total,
    lives, startTime, elapsedTime, activeWords, currentInput,
    currentTargetId, particles, showAchievement, records, leaderboard,
    profile,
    // computed
    accuracy, wpm, isPassed, remainingTime,
    achievementList, unlockedCount, totalLevels, completedCount,
    // methods
    startGame, handleKeyPress, togglePause, reset,
    saveScore, fetchLeaderboard, completeLevel, endGame,
    getNextLevelId, checkAchievements,
    resetProfile, setPlayerName,
  }
})
