// ====== 核心类型定义 ======

/** 词条 */
export interface WordItem {
  text: string       // 用户需要打的文本
  display: string    // 屏幕上显示的文本（拼音可附带中文释义）
}

/** 下落中的单词 */
export interface FallingWord {
  id: number
  word: WordItem
  x: number          // 水平位置百分比 (0-100)
  y: number          // 垂直位置百分比 (0-100)
  typed: string      // 用户已输入的字符
  speed: number      // 下落速度
  active: boolean    // 当前正在被输入
}

/** 难度等级 */
export interface Level {
  id: number
  name: string
  description: string
  category: 'english' | 'pinyin'
  ageRange: string       // 比如 "6-7岁"
  icon: string           // emoji 图标
  speed: number          // 基础下落速度
  spawnInterval: number  // 生成间隔(ms)
  livesCount: number     // 生命数
  targetScore: number    // 通过分数
  timeLimit: number      // 时间限制(秒), 0表示不限时
  words: WordItem[]
}

/** 游戏状态 */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'over' | 'levelcomplete'

/** 游戏整体状态 */
export interface GameState {
  currentLevel: Level | null
  score: number
  combo: number
  maxCombo: number
  correct: number
  total: number
  lives: number
  startTime: number
  elapsedTime: number
  status: GameStatus
  activeWords: FallingWord[]
  currentInput: string
  currentTarget: number | null // 当前正在打的 word id
  particles: Particle[]
  showAchievement: Achievement | null
}

/** 粒子特效 */
export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
  size: number
}

/** 成就 */
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
}

/** 得分记录 */
export interface ScoreRecord {
  id?: number
  playerName: string
  levelId: number
  category: string
  score: number
  accuracy: number
  wpm: number
  maxCombo: number
  timeSeconds: number
  createdAt?: string
}

/** 排行榜条目 */
export interface LeaderboardEntry {
  rank: number
  playerName: string
  score: number
  accuracy: number
  wpm: number
  levelName: string
}

/** 玩家档案（持久化） */
export interface PlayerProfile {
  playerName: string
  totalGames: number
  totalScore: number
  totalWords: number
  bestCombo: number
  unlockedAchievements: string[]
  completedLevels: number[]
  lastPlayed: string
}

/** 所有成就定义 */
export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
  condition: (stats: {
    combo: number
    correct: number
    total: number
    maxCombo: number
    totalWords: number
    totalScore: number
    totalGames: number
    completedLevels: number
  }) => boolean
}

export const ALL_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first',   title: '初次登场',   description: '完成第一个打字！',        icon: '🎉',
    condition: s => s.combo >= 1 },
  { id: 'combo5',  title: '连击小能手',  description: '连续打对 5 个！',        icon: '🔥',
    condition: s => s.combo >= 5 },
  { id: 'combo10', title: '连击大魔王',  description: '连续打对 10 个！',       icon: '⚡',
    condition: s => s.combo >= 10 },
  { id: 'combo20', title: '键盘超人',   description: '连续打对 20 个！！',      icon: '🦸',
    condition: s => s.combo >= 20 },
  { id: 'perfect10', title: '完美开局', description: '前 10 个全对！',          icon: '💫',
    condition: s => s.correct >= 10 && s.correct === s.total },
  { id: 'perfect50', title: '完美 50 连', description: '前 50 个全对！',       icon: '💎',
    condition: s => s.correct >= 50 && s.correct === s.total },
  { id: 'words100', title: '小试牛刀',  description: '累计打了 100 个单词',     icon: '📖',
    condition: s => s.totalWords >= 100 },
  { id: 'words500', title: '词汇达人',  description: '累计打了 500 个单词',     icon: '📚',
    condition: s => s.totalWords >= 500 },
  { id: 'score1000', title: '千分勇士', description: '累计获得 1000 分',        icon: '⭐',
    condition: s => s.totalScore >= 1000 },
  { id: 'score5000', title: '万分挑战', description: '累计获得 5000 分',        icon: '🌟',
    condition: s => s.totalScore >= 5000 },
  { id: 'games10', title: '老司机',     description: '玩过 10 局游戏',          icon: '🎮',
    condition: s => s.totalGames >= 10 },
  { id: 'allClear', title: '全通关',    description: '所有关卡全部通关！',       icon: '👑',
    condition: s => s.completedLevels >= 22 },
]
