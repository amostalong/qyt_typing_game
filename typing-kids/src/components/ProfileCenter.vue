<script setup lang="ts">
import { ref } from 'vue'
import { ALL_ACHIEVEMENTS } from '../types'
import type { PlayerProfile } from '../types'

const props = defineProps<{
  profile: PlayerProfile
}>()

const emit = defineEmits<{
  close: []
  reset: []
  rename: [name: string]
}>()

const editingName = ref(false)
const nameInput = ref(props.profile.playerName || '')

function saveName() {
  const name = nameInput.value.trim()
  if (name) {
    emit('rename', name)
  }
  editingName.value = false
}

function formatDate(iso: string): string {
  if (!iso) return '从未'
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <div class="profile-overlay" @click="emit('close')">
    <div class="profile-panel" @click.stop>
      <!-- 标题 -->
      <div class="panel-header">
        <div class="header-icon">🏅</div>
        <h2>个人中心</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <!-- 玩家信息 -->
      <div class="section player-section">
        <div class="player-avatar">
          {{ profile.playerName ? profile.playerName[0].toUpperCase() : '?' }}
        </div>
        <div class="player-info">
          <div v-if="!editingName" class="player-name-row">
            <span class="player-name">{{ profile.playerName || '未命名' }}</span>
            <button class="edit-btn" @click="editingName = true">✏️</button>
          </div>
          <div v-else class="name-edit-row">
            <input
              v-model="nameInput"
              class="name-input"
              maxlength="16"
              placeholder="输入名字"
              @keyup.enter="saveName"
              @blur="saveName"
              ref="nameInputEl"
            />
          </div>
          <div class="player-stats-row">
            <span>{{ profile.totalGames }} 局</span>
            <span class="stat-dot">·</span>
            <span>最近 {{ profile.lastPlayed ? formatDate(profile.lastPlayed) : '从未' }}</span>
          </div>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="section stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ profile.totalScore }}</div>
          <div class="stat-label">累计得分</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ profile.totalWords }}</div>
          <div class="stat-label">打字总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ profile.bestCombo }}</div>
          <div class="stat-label">最佳连击</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ profile.completedLevels.length }}/22</div>
          <div class="stat-label">通关数</div>
        </div>
      </div>

      <!-- 成就展示 -->
      <div class="section">
        <div class="section-title">
          <span>🏆 成就</span>
          <span class="badge">{{ profile.unlockedAchievements.length }}/{{ ALL_ACHIEVEMENTS.length }}</span>
        </div>
        <div class="achievements-grid">
          <div
            v-for="def in ALL_ACHIEVEMENTS"
            :key="def.id"
            class="achievement-badge"
            :class="{ unlocked: profile.unlockedAchievements.includes(def.id) }"
            :title="def.description"
          >
            <div class="badge-icon">{{ def.icon }}</div>
            <div class="badge-title">{{ def.title }}</div>
            <div v-if="!profile.unlockedAchievements.includes(def.id)" class="badge-lock">🔒</div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="panel-footer">
        <button class="btn-reset" @click="emit('reset')">🗑️ 重置数据</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.profile-panel {
  width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 滚动条 */
.profile-panel::-webkit-scrollbar { width: 4px; }
.profile-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 24px 0;
}

.header-icon { font-size: 1.6rem; }

.panel-header h2 {
  flex: 1;
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover {
  background: rgba(255,255,255,0.2);
  color: white;
}

.section {
  padding: 16px 24px;
}

/* 玩家信息 */
.player-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
}

.player-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4d96ff, #6bcb77);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.player-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 2px;
  opacity: 0.5;
  transition: opacity 0.2s;
}
.edit-btn:hover { opacity: 1; }

.name-edit-row input {
  width: 100%;
  padding: 6px 10px;
  border: 2px solid rgba(77, 150, 255, 0.5);
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 1rem;
  outline: none;
}

.player-stats-row {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  margin-top: 2px;
}

.stat-dot { margin: 0 6px; }

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
}

.stat-card {
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffd93d;
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  margin-top: 2px;
}

/* 成就 */
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255,255,255,0.8);
  margin-bottom: 12px;
}

.badge {
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: 20px;
  background: rgba(255, 217, 61, 0.15);
  color: #ffd93d;
  font-weight: 600;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.achievement-badge {
  position: relative;
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 12px 6px 8px;
  text-align: center;
  transition: all 0.2s;
  opacity: 0.5;
  filter: grayscale(0.8);
}

.achievement-badge.unlocked {
  opacity: 1;
  filter: none;
  background: rgba(255, 217, 61, 0.1);
  border: 1px solid rgba(255, 217, 61, 0.2);
}

.badge-icon {
  font-size: 1.6rem;
  margin-bottom: 4px;
}

.badge-title {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  line-height: 1.2;
}

.achievement-badge.unlocked .badge-title {
  color: #ffd93d;
}

.badge-lock {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(0,0,0,0.3);
  border-radius: 12px;
}

/* 底部 */
.panel-footer {
  padding: 8px 24px 20px;
  display: flex;
  justify-content: center;
}

.btn-reset {
  padding: 8px 20px;
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 10px;
  background: transparent;
  color: rgba(255, 107, 107, 0.6);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}
</style>
