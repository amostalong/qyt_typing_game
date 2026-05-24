import { ref } from 'vue'

/**
 * 使用 Web Audio API 生成简单音效（无需外部音频文件）
 */
export function useAudio() {
  const muted = ref(false)
  let audioCtx: AudioContext | null = null

  function getCtx(): AudioContext {
    if (!audioCtx) {
      audioCtx = new AudioContext()
    }
    return audioCtx
  }

  /** 播放按键音 */
  function playKeyPress() {
    if (muted.value) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.value = 800
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.08)
    } catch { /* 静默忽略 */ }
  }

  /** 播放得分音效 */
  function playScore() {
    if (muted.value) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(523, ctx.currentTime)        // C5
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.08)  // E5
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.16)  // G5
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch { /* 静默忽略 */ }
  }

  /** 播放错误音效 */
  function playError() {
    if (muted.value) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'square'
      osc.frequency.setValueAtTime(200, ctx.currentTime)
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    } catch { /* 静默忽略 */ }
  }

  /** 播放过关音效 */
  function playLevelComplete() {
    if (muted.value) return
    try {
      const ctx = getCtx()
      const notes = [523, 587, 659, 698, 784, 880, 988, 1047] // C5-C6 音阶
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        const t = ctx.currentTime + i * 0.1
        gain.gain.setValueAtTime(0.1, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
        osc.start(t)
        osc.stop(t + 0.15)
      })
    } catch { /* 静默忽略 */ }
  }

  /** 播放连击音效 */
  function playCombo(comboCount: number) {
    if (muted.value) return
    try {
      const ctx = getCtx()
      const baseFreq = 400 + Math.min(comboCount, 20) * 30
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'triangle'
      osc.frequency.value = baseFreq
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.15)
    } catch { /* 静默忽略 */ }
  }

  function toggleMute() {
    muted.value = !muted.value
  }

  return {
    muted,
    playKeyPress,
    playScore,
    playError,
    playLevelComplete,
    playCombo,
    toggleMute,
  }
}
