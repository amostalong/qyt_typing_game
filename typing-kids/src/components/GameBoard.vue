<script setup lang="ts">
import { computed } from 'vue'
import type { FallingWord, Particle } from '../types'

const props = defineProps<{
  words: FallingWord[]
  currentTargetId: number | null
  particles: Particle[]
  enemyY: number  // 危险线位置
}>()

/** 根据单词长度计算字体大小 */
function fontSize(word: FallingWord): string {
  const len = word.word.text.length
  if (len <= 1) return '3.5rem'
  if (len <= 3) return '2rem'
  if (len <= 6) return '1.5rem'
  if (len <= 15) return '1.2rem'
  return '1rem'
}

/** 单词样式 */
function wordStyle(word: FallingWord) {
  return {
    left: word.x + '%',
    top: word.y + '%',
    fontSize: fontSize(word),
  }
}

/** 单词 CSS class */
function wordClass(word: FallingWord) {
  return {
    'falling-word': true,
    'active': word.active,
    'danger': word.y > 75,
    'critical': word.y > 88,
  }
}

/** 显示文本: 已输入部分高亮 */
function displayWord(word: FallingWord) {
  const full = word.word.display
  const typed = word.typed
  if (typed.length === 0) return full
  // 已输入部分用不同颜色
  return full
}

/** 当前正在打的单词的下一个字符 */
const nextChar = computed(() => {
  if (props.currentTargetId === null) return null
  const target = props.words.find(w => w.id === props.currentTargetId)
  if (!target) return null
  const remaining = target.word.text.slice(target.typed.length)
  return remaining[0] || null
})

defineExpose({ nextChar })
</script>

<template>
  <div class="game-board">
    <!-- 危险线 -->
    <div class="danger-line" :style="{ top: '90%' }">
      <span class="danger-label">⚠ 危险线</span>
    </div>

    <!-- 下落单词 -->
    <div
      v-for="word in words"
      :key="word.id"
      :class="wordClass(word)"
      :style="wordStyle(word)"
    >
      <div class="word-text">
        <span class="typed-part">{{ word.typed }}</span
        ><span class="remaining-part">{{ word.word.text.slice(word.typed.length) }}</span>
      </div>
      <!-- 显示中文释义 -->
      <div v-if="word.word.display !== word.word.text" class="word-hint">
        {{ word.word.display }}
      </div>
      <!-- 进度条, 只在激活时显示 -->
      <div v-if="word.active && word.typed.length > 0" class="word-progress">
        <div
          class="progress-fill"
          :style="{ width: (word.typed.length / word.word.text.length * 100) + '%' }"
        ></div>
      </div>
      <!-- 指示箭头 -->
      <div v-if="word.active" class="word-indicator">▼</div>
    </div>

    <!-- 粒子特效 -->
    <div
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        left: p.x + '%',
        top: p.y + '%',
        backgroundColor: p.color,
        width: p.size + 'px',
        height: p.size + 'px',
        opacity: p.life,
      }"
    ></div>
  </div>
</template>

<style scoped>
.game-board {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 200px;
  padding: 12px 10px;
  background: linear-gradient(180deg, #0a1628 0%, #1a2a4a 40%, #2a1a3a 100%);
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.1);
}

/* 星空背景 */
.game-board::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.4), transparent),
    radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.3), transparent),
    radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.3), transparent),
    radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.4), transparent),
    radial-gradient(1.5px 1.5px at 20% 85%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1.5px 1.5px at 60% 30%, rgba(255,255,255,0.4), transparent),
    radial-gradient(1.5px 1.5px at 80% 50%, rgba(255,255,255,0.3), transparent);
  pointer-events: none;
}

.danger-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    #ff4757 0px,
    #ff4757 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 5;
}

.danger-label {
  position: absolute;
  right: 10px;
  top: -20px;
  font-size: 12px;
  color: #ff4757;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(255, 71, 87, 0.5);
}

/* 下落单词 */
.falling-word {
  position: absolute;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  transition: left 0.1s ease;
  cursor: default;
}

.word-text {
  font-weight: 800;
  text-shadow:
    0 2px 4px rgba(0,0,0,0.5),
    0 0 20px rgba(255,255,255,0.3);
  white-space: nowrap;
  letter-spacing: 2px;
}

.typed-part {
  color: #00ff88;
  text-shadow:
    0 2px 4px rgba(0,0,0,0.5),
    0 0 20px rgba(255,255,255,0.3),
    0 0 10px rgba(0, 255, 136, 0.6);
}

.remaining-part {
  color: white;
  text-shadow:
    0 2px 4px rgba(0,0,0,0.5),
    0 0 20px rgba(255,255,255,0.3);
}

.active .remaining-part {
  color: #ffd93d;
  text-shadow:
    0 2px 4px rgba(0,0,0,0.5),
    0 0 20px rgba(255,255,255,0.3),
    0 0 10px rgba(255, 217, 61, 0.6);
}

.danger .remaining-part {
  color: #ff6b6b;
}

.critical .word-text {
  animation: shake 0.3s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.word-hint {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.word-progress {
  height: 3px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  margin-top: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00d2ff);
  border-radius: 2px;
  transition: width 0.1s ease;
}

.word-indicator {
  color: #ffd93d;
  font-size: 16px;
  animation: bounce 0.5s ease-in-out infinite;
  margin-top: 2px;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 粒子 */
.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 20;
}
</style>
