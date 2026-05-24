<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useGameStore } from './stores/gameStore'
import { useKeyboard } from './composables/useKeyboard'
import { useAudio } from './composables/useAudio'
import { getLevelById } from './data/words'
import LevelSelect from './components/LevelSelect.vue'
import GameBoard from './components/GameBoard.vue'
import Keyboard from './components/Keyboard.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import Achievement from './components/Achievement.vue'
import ProfileCenter from './components/ProfileCenter.vue'

const store = useGameStore()
const audio = useAudio()

// 用于获取 GameBoard 暴露的 nextChar
const gameBoardRef = ref<InstanceType<typeof GameBoard> | null>(null)

// 键盘事件处理
const { pressedKeys, capsLock } = useKeyboard((key: string) => {
  store.handleKeyPress(key)

  // 音效
  if (store.status === 'playing') {
    audio.playKeyPress()

    const targetWord = store.activeWords.find(w => w.id === store.currentTargetId)
    if (targetWord && key.length === 1) {
      const nextIdx = targetWord.typed.length
      if (key === targetWord.word.text[nextIdx]) {
        audio.playScore()
        if (store.combo >= 3) {
          audio.playCombo(store.combo)
        }
      } else {
        audio.playError()
      }
    }
  }
})

// 当前应该按的键 (高亮虚拟键盘)
const activeKey = computed(() => {
  if (store.currentTargetId === null) return null
  const target = store.activeWords.find(w => w.id === store.currentTargetId)
  if (!target) return null
  const remaining = target.word.text.slice(target.typed.length)
  return remaining[0] || null
})

// 玩家名称
const playerName = ref('')
const showSaveDialog = ref(false)
const showProfile = ref(false)

// 监听过关
watch(() => store.status, (newStatus) => {
  if (newStatus === 'levelcomplete') {
    audio.playLevelComplete()
    showSaveDialog.value = true
  }
})

function onStartLevel(levelId: number) {
  store.startGame(levelId)
}

function onPause() {
  store.togglePause()
}

function onQuit() {
  store.reset()
  showSaveDialog.value = false
}

async function onSaveScore() {
  let name = playerName.value.trim()
  if (!name) {
    name = '小勇士' + Math.floor(Math.random() * 1000)
  }
  await store.saveScore(name)
  showSaveDialog.value = false
}

/** 下一关名称 */
const nextLevelName = computed(() => {
  const nextId = store.getNextLevelId()
  if (nextId === null) return null
  const next = getLevelById(nextId)
  return next ? `${next.icon} ${next.name}` : null
})

/** 进入下一关 */
function goToNextLevel() {
  const nextId = store.getNextLevelId()
  if (nextId === null) return
  showSaveDialog.value = false
  store.startGame(nextId)
}
</script>

<template>
  <div class="app">
    <!-- 主题背景 -->
    <div class="bg-layer"></div>

    <!-- 主界面切换 -->
    <template v-if="store.status === 'idle'">
      <LevelSelect @start="onStartLevel" @profile="showProfile = true" />
    </template>

    <template v-else>
      <div class="game-container">
        <!-- 顶部信息栏 -->
        <div class="game-header">
          <div class="level-info">
            <span class="level-icon">{{ store.currentLevel?.icon }}</span>
            <span class="level-name">{{ store.currentLevel?.name }}</span>
          </div>
          <div class="header-actions">
            <button class="icon-btn" @click="audio.toggleMute" :title="audio.muted.value ? '开启声音' : '静音'">
              {{ audio.muted.value ? '🔇' : '🔊' }}
            </button>
            <button class="icon-btn" @click="onPause">
              {{ store.status === 'paused' ? '▶️' : '⏸' }}
            </button>
            <button class="icon-btn quit-btn" @click="onQuit">✕</button>
          </div>
        </div>

        <!-- 计分板 -->
        <ScoreBoard
          :score="store.score"
          :combo="store.combo"
          :accuracy="store.accuracy"
          :wpm="store.wpm"
          :lives="store.lives"
          :elapsed-time="store.elapsedTime"
          :target-score="store.currentLevel?.targetScore ?? 0"
          :remaining-time="store.remainingTime"
        />

        <!-- 游戏区域 -->
        <GameBoard
          ref="gameBoardRef"
          :words="store.activeWords"
          :current-target-id="store.currentTargetId"
          :particles="store.particles"
          :enemy-y="90"
        />

        <!-- 虚拟键盘 -->
        <Keyboard
          :pressed-keys="pressedKeys"
          :active-key="activeKey"
          :caps-lock="capsLock"
        />
      </div>
    </template>

    <!-- 暂停遮罩 -->
    <div v-if="store.status === 'paused'" class="overlay" @click="onPause">
      <div class="overlay-content">
        <div class="pause-icon">⏸</div>
        <h2>游戏暂停</h2>
        <p>点击任意位置继续</p>
      </div>
    </div>

    <!-- 游戏结束遮罩 -->
    <div v-if="store.status === 'over'" class="overlay">
      <div class="overlay-content gameover-content">
        <div class="gameover-icon">💪</div>
        <h2>继续加油!</h2>
        <div class="final-stats">
          <div class="final-stat">
            <span class="fs-label">得分</span>
            <span class="fs-value">{{ store.score }}</span>
          </div>
          <div class="final-stat">
            <span class="fs-label">准确率</span>
            <span class="fs-value">{{ store.accuracy }}%</span>
          </div>
          <div class="final-stat">
            <span class="fs-label">最高连击</span>
            <span class="fs-value">{{ store.maxCombo }}</span>
          </div>
        </div>
        <div class="overlay-buttons">
          <button class="btn-primary" @click="store.currentLevel && onStartLevel(store.currentLevel.id)">
            🔄 再来一次
          </button>
          <button class="btn-secondary" @click="onQuit">
            🏠 返回首页
          </button>
        </div>
      </div>
    </div>

    <!-- 存档对话框 -->
    <div v-if="showSaveDialog" class="overlay">
      <div class="overlay-content save-content">
        <div class="save-icon">🏆</div>
        <h2>太厉害了!</h2>
        <p class="save-subtitle">你获得了 {{ store.score }} 分!</p>
        <div class="final-stats">
          <div class="final-stat">
            <span class="fs-label">准确率</span>
            <span class="fs-value">{{ store.accuracy }}%</span>
          </div>
          <div class="final-stat">
            <span class="fs-label">速度</span>
            <span class="fs-value">{{ store.wpm }} wpm</span>
          </div>
          <div class="final-stat">
            <span class="fs-label">最高连击</span>
            <span class="fs-value">{{ store.maxCombo }}</span>
          </div>
        </div>

        <!-- 下一关提示 -->
        <div v-if="nextLevelName" class="next-level-hint">
          <span class="nl-label">下一关:</span>
          <span class="nl-name">{{ nextLevelName }}</span>
          <div class="nl-sub">速度 + 一点点, 准备好了吗?</div>
        </div>

        <div class="name-input">
          <input
            v-model="playerName"
            placeholder="输入你的名字"
            maxlength="20"
            @keyup.enter="onSaveScore"
          />
        </div>
        <div class="overlay-buttons">
          <button class="btn-primary" @click="onSaveScore">💾 保存成绩</button>
          <button v-if="nextLevelName" class="btn-next" @click="goToNextLevel">
            ▶ 下一关
          </button>
          <button class="btn-secondary" @click="onQuit">🏠 返回首页</button>
        </div>
      </div>
    </div>

    <!-- 个人中心 -->
    <ProfileCenter
      v-if="showProfile"
      :profile="store.profile"
      @close="showProfile = false"
      @reset="store.resetProfile(); showProfile = false"
      @rename="(n) => store.setPlayerName(n)"
    />

    <!-- 成就弹窗 -->
    <Achievement
      v-if="store.showAchievement"
      :achievement="store.showAchievement"
      @close="store.showAchievement = null"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
}

/* 动态背景 */
.bg-layer {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0f0c29, #1a1a3e, #24243e);
  z-index: -1;
}

.bg-layer::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(77, 150, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(107, 203, 119, 0.1) 0%, transparent 50%);
}

.game-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
}

/* 顶部栏 */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.level-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-icon {
  font-size: 1.5rem;
}

.level-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: rgba(255,255,255,0.1);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.icon-btn:hover {
  background: rgba(255,255,255,0.2);
}

.quit-btn {
  color: #ff6b6b;
  font-weight: 800;
  font-size: 1rem;
}

/* 遮罩 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.overlay-content {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  min-width: 300px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.overlay-content h2 {
  font-size: 1.8rem;
  font-weight: 900;
  color: white;
  margin-bottom: 8px;
}

.overlay-content p {
  color: rgba(255,255,255,0.6);
  margin-bottom: 20px;
}

.pause-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.gameover-icon, .save-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.save-subtitle {
  font-size: 1.2rem;
  color: #ffd93d !important;
  font-weight: 700;
}

.final-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 20px;
}

.final-stat {
  text-align: center;
}

.fs-label {
  display: block;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 4px;
}

.fs-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
}

.overlay-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 12px 28px;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #4d96ff, #6bcb77);
  color: white;
  box-shadow: 0 4px 15px rgba(77, 150, 255, 0.4);
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(77, 150, 255, 0.6);
}

.btn-secondary {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.2);
}

.name-input {
  margin-bottom: 16px;
}

.name-input input {
  width: 200px;
  padding: 10px 16px;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 1rem;
  text-align: center;
  outline: none;
  transition: border-color 0.2s ease;
}

.name-input input:focus {
  border-color: #4d96ff;
}

.name-input input::placeholder {
  color: rgba(255,255,255,0.3);
}

/* 下一关提示 */
.next-level-hint {
  margin: 16px 0 8px;
  padding: 12px 16px;
  background: rgba(255, 217, 61, 0.1);
  border: 1px solid rgba(255, 217, 61, 0.3);
  border-radius: 12px;
  text-align: center;
}

.nl-label {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
  margin-right: 6px;
}

.nl-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffd93d;
}

.nl-sub {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  margin-top: 4px;
}

/* 下一关按钮 */
.btn-next {
  padding: 12px 28px;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #ffd93d, #ff6b6b);
  color: #2d3436;
  box-shadow: 0 4px 15px rgba(255, 217, 61, 0.4);
  animation: pulse-next 1.5s ease-in-out infinite;
}

.btn-next:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 217, 61, 0.6);
}

@keyframes pulse-next {
  0%, 100% { box-shadow: 0 4px 15px rgba(255, 217, 61, 0.4); }
  50% { box-shadow: 0 4px 25px rgba(255, 217, 61, 0.7); }
}
</style>
