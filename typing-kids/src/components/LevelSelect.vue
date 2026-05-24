<script setup lang="ts">
import { ref } from 'vue'
import { levels, getLevelsByCategory } from '../data/words'
import type { Level } from '../types'

const emit = defineEmits<{
  start: [levelId: number]
  profile: []
}>()

const activeCategory = ref<'all' | 'english' | 'pinyin'>('all')
const hoveredLevel = ref<number | null>(null)

const englishLevels = getLevelsByCategory('english')
const pinyinLevels = getLevelsByCategory('pinyin')

function displayLevels(): Level[] {
  if (activeCategory.value === 'english') return englishLevels
  if (activeCategory.value === 'pinyin') return pinyinLevels
  return levels
}

/** 等级卡片颜色 */
function levelCardGradient(level: Level, index: number): string {
  if (level.category === 'english') {
    const englishGradients = [
      'linear-gradient(135deg, #a8e6cf, #88d8b0)',
      'linear-gradient(135deg, #ffd3b6, #ffaaa5)',
      'linear-gradient(135deg, #dcedc1, #c5e8b7)',
      'linear-gradient(135deg, #a8d8ea, #aa96da)',
      'linear-gradient(135deg, #ff9a9e, #fecfef)',
      'linear-gradient(135deg, #84fab0, #8fd3f4)',
      'linear-gradient(135deg, #fccb90, #d57eeb)',
      'linear-gradient(135deg, #a18cd1, #fbc2eb)',
      'linear-gradient(135deg, #fad0c4, #ffd1ff)',
      'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #89f7fe, #66a6ff)',
    ]
    return englishGradients[index % englishGradients.length]
  } else {
    const pinyinGradients = [
      'linear-gradient(135deg, #ffecd2, #fcb69f)',
      'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #fa709a, #fee140)',
      'linear-gradient(135deg, #f6d365, #fda085)',
      'linear-gradient(135deg, #96fbc4, #f9f586)',
      'linear-gradient(135deg, #cfd9df, #e2ebf0)',
      'linear-gradient(135deg, #a8edea, #fed6e3)',
    ]
    return pinyinGradients[(index - englishLevels.length) % pinyinGradients.length]
  }
}
</script>

<template>
  <div class="level-select">
    <div class="header">
      <h1 class="title">🌟 键盘小勇士</h1>
      <p class="subtitle">选择关卡, 开始打字冒险吧!</p>
      <button class="profile-btn" @click="emit('profile')" title="个人中心">
        🏅
      </button>
    </div>

    <!-- 分类切换 -->
    <div class="category-tabs">
      <button
        :class="{ active: activeCategory === 'all' }"
        @click="activeCategory = 'all'"
      >🌈 全部</button>
      <button
        :class="{ active: activeCategory === 'english' }"
        @click="activeCategory = 'english'"
      >🔤 英文</button>
      <button
        :class="{ active: activeCategory === 'pinyin' }"
        @click="activeCategory = 'pinyin'"
      >🀄 拼音</button>
    </div>

    <!-- 等级卡片网格 -->
    <div class="level-grid">
      <button
        v-for="(level, idx) in displayLevels()"
        :key="level.id"
        class="level-card"
        :style="{ background: levelCardGradient(level, idx) }"
        @click="emit('start', level.id)"
        @mouseenter="hoveredLevel = level.id"
        @mouseleave="hoveredLevel = null"
      >
        <div class="card-icon">{{ level.icon }}</div>
        <div class="card-title">{{ level.name }}</div>
        <div class="card-desc">{{ level.description }}</div>
        <div class="card-age">{{ level.ageRange }}</div>
        <div class="card-badge">{{ level.category === 'english' ? 'EN' : '拼音' }}</div>

        <!-- hover 信息 -->
        <div v-if="hoveredLevel === level.id" class="card-hover">
          <div>🎯 目标 {{ level.targetScore }} 分</div>
          <div>💖 {{ level.livesCount }} 条命</div>
          <div v-if="level.timeLimit > 0">⏱ {{ level.timeLimit }}秒</div>
          <div class="start-hint">点击开始!</div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.level-select {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  position: relative;
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffd93d, #ff6b6b, #4d96ff, #6bcb77);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.subtitle {
  color: rgba(255,255,255,0.6);
  font-size: 1.1rem;
  margin-top: 8px;
}

.profile-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 14px;
  background: rgba(255,255,255,0.06);
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(6px);
}

.profile-btn:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.3);
  transform: scale(1.08);
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.category-tabs button {
  padding: 10px 28px;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 30px;
  background: transparent;
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-tabs button:hover {
  border-color: rgba(255,255,255,0.5);
  color: white;
}

.category-tabs button.active {
  background: linear-gradient(135deg, #4d96ff, #6bcb77);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 15px rgba(77, 150, 255, 0.4);
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.level-card {
  position: relative;
  border: none;
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.level-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 12px 30px rgba(0,0,0,0.3);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #2d3436;
  margin-bottom: 4px;
}

.card-desc {
  font-size: 0.8rem;
  color: rgba(0,0,0,0.5);
  margin-bottom: 8px;
}

.card-age {
  display: inline-block;
  padding: 3px 12px;
  background: rgba(255,255,255,0.4);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2d3436;
}

.card-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 800;
  background: rgba(255,255,255,0.5);
  color: #2d3436;
}

.card-hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 20px;
}

.start-hint {
  margin-top: 8px;
  padding: 6px 16px;
  background: linear-gradient(135deg, #ffd93d, #ff6b6b);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #2d3436;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
