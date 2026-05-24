<script setup lang="ts">
defineProps<{
  score: number
  combo: number
  accuracy: number
  wpm: number
  lives: number
  elapsedTime: number
  targetScore: number
  remainingTime: number
}>()

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** 生命图标 */
function hearts(count: number): string {
  const full = '❤️'.repeat(count)
  const empty = '🖤'.repeat(Math.max(0, 5 - count))
  return full + empty
}
</script>

<template>
  <div class="score-board">
    <div class="stat-row top-row">
      <div class="stat-item score-stat">
        <div class="stat-label">🌟 得分</div>
        <div class="stat-value score-value">{{ score }}</div>
        <div class="stat-sub">目标 {{ targetScore }}</div>
      </div>
      <div class="stat-item combo-stat">
        <div class="stat-label">🔥 连击</div>
        <div class="stat-value combo-value">x{{ combo }}</div>
      </div>
      <div class="stat-item time-stat">
        <div class="stat-label">⏱ 时间</div>
        <div class="stat-value">{{ formatTime(elapsedTime) }}</div>
        <div v-if="remainingTime < Infinity" class="stat-sub time-limit">
          {{ remainingTime > 0 ? `剩余 ${formatTime(remainingTime)}` : '⏰' }}
        </div>
      </div>
    </div>

    <div class="stat-row bottom-row">
      <div class="stat-item">
        <div class="stat-label">🎯 准确率</div>
        <div class="stat-value">{{ accuracy }}%</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">⚡ 速度</div>
        <div class="stat-value">{{ wpm }} <span class="unit">wpm</span></div>
      </div>
      <div class="stat-item lives-stat">
        <div class="stat-label">💖 生命</div>
        <div class="stat-value hearts-display">{{ hearts(lives) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  background: linear-gradient(135deg, rgba(45, 52, 54, 0.9), rgba(99, 110, 114, 0.9));
  border-radius: 14px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

.stat-row {
  display: flex;
  justify-content: space-around;
  gap: 12px;
}

.stat-item {
  text-align: center;
  min-width: 80px;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  margin-bottom: 2px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
}

.score-value {
  color: #ffd93d;
  font-size: 1.5rem;
  text-shadow: 0 0 15px rgba(255, 217, 61, 0.5);
}

.combo-value {
  color: #ff6b6b;
}

.unit {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
}

.stat-sub {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.4);
}

.time-limit {
  color: #ff6b6b;
}

.hearts-display {
  font-size: 1rem;
  letter-spacing: 2px;
}

.bottom-row .stat-value {
  font-size: 1.1rem;
}
</style>
