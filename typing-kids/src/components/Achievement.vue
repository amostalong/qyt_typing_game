<script setup lang="ts">
import type { Achievement } from '../types'

defineProps<{
  achievement: Achievement
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="achievement-overlay" @click="emit('close')">
      <div class="achievement-popup" @click.stop>
        <div class="achievement-glow"></div>
        <div class="achievement-content">
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <h2 class="achievement-title">{{ achievement.title }}</h2>
          <p class="achievement-desc">{{ achievement.description }}</p>
          <div class="achievement-stars">
            <span class="star" v-for="i in 5" :key="i">⭐</span>
          </div>
          <button class="close-btn" @click="emit('close')">太棒了!</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.achievement-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.achievement-popup {
  position: relative;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 24px;
  padding: 3px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.achievement-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #ffd93d, #ff6b6b, #4d96ff, #6bcb77);
  border-radius: 26px;
  filter: blur(10px);
  opacity: 0.5;
  animation: glow-rotate 3s linear infinite;
  z-index: -1;
}

@keyframes glow-rotate {
  from { filter: blur(10px) hue-rotate(0deg); }
  to { filter: blur(10px) hue-rotate(360deg); }
}

.achievement-content {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 22px;
  padding: 40px;
  text-align: center;
  min-width: 280px;
  position: relative;
  z-index: 1;
}

.achievement-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: bounce-icon 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes bounce-icon {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.achievement-title {
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffd93d, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.achievement-desc {
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  margin-bottom: 16px;
}

.achievement-stars {
  margin-bottom: 20px;
}

.star {
  font-size: 1.5rem;
  margin: 0 2px;
  animation: star-pop 0.3s ease backwards;
}

.star:nth-child(1) { animation-delay: 0.1s; }
.star:nth-child(2) { animation-delay: 0.2s; }
.star:nth-child(3) { animation-delay: 0.3s; }
.star:nth-child(4) { animation-delay: 0.4s; }
.star:nth-child(5) { animation-delay: 0.5s; }

@keyframes star-pop {
  from { transform: scale(0) rotate(180deg); opacity: 0; }
  to { transform: scale(1) rotate(0deg); opacity: 1; }
}

.close-btn {
  padding: 12px 40px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(135deg, #6bcb77, #4d96ff);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(107, 203, 119, 0.4);
}

.close-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(107, 203, 119, 0.6);
}
</style>
