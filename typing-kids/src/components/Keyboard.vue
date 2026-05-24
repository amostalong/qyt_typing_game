<script setup lang="ts">
const props = defineProps<{
  pressedKeys: Set<string>
  activeKey: string | null
  capsLock: boolean
}>()

interface KeyDef {
  id: string
  label: string
  width: number   // 单位 (1u = 标准字母键宽)
}

/** ANSI 标准键盘布局，只含打字练习需要的按键 */
const rows: KeyDef[][] = [
  // ── 第 1 行：数字行 + Backspace ──
  [
    { id: '`',  label: '`',  width: 1 },
    { id: '1',  label: '1',  width: 1 },
    { id: '2',  label: '2',  width: 1 },
    { id: '3',  label: '3',  width: 1 },
    { id: '4',  label: '4',  width: 1 },
    { id: '5',  label: '5',  width: 1 },
    { id: '6',  label: '6',  width: 1 },
    { id: '7',  label: '7',  width: 1 },
    { id: '8',  label: '8',  width: 1 },
    { id: '9',  label: '9',  width: 1 },
    { id: '0',  label: '0',  width: 1 },
    { id: '-',  label: '-',  width: 1 },
    { id: '=',  label: '=',  width: 1 },
    { id: 'Backspace', label: '⌫', width: 2 },
  ],

  // ── 第 2 行：QWERTY 行 ──
  [
    { id: 'Tab', label: 'Tab', width: 1.5 },
    { id: 'q', label: 'Q', width: 1 },
    { id: 'w', label: 'W', width: 1 },
    { id: 'e', label: 'E', width: 1 },
    { id: 'r', label: 'R', width: 1 },
    { id: 't', label: 'T', width: 1 },
    { id: 'y', label: 'Y', width: 1 },
    { id: 'u', label: 'U', width: 1 },
    { id: 'i', label: 'I', width: 1 },
    { id: 'o', label: 'O', width: 1 },
    { id: 'p', label: 'P', width: 1 },
    { id: '[', label: '[', width: 1 },
    { id: ']', label: ']', width: 1 },
    { id: '\\', label: '\\', width: 1.5 },
  ],

  // ── 第 3 行：Home 行 ──
  [
    { id: 'CapsLock', label: 'Caps', width: 1.75 },
    { id: 'a', label: 'A', width: 1 },
    { id: 's', label: 'S', width: 1 },
    { id: 'd', label: 'D', width: 1 },
    { id: 'f', label: 'F', width: 1 },
    { id: 'g', label: 'G', width: 1 },
    { id: 'h', label: 'H', width: 1 },
    { id: 'j', label: 'J', width: 1 },
    { id: 'k', label: 'K', width: 1 },
    { id: 'l', label: 'L', width: 1 },
    { id: ';', label: ';', width: 1 },
    { id: "'", label: "'", width: 1 },
    { id: 'Enter', label: 'Enter', width: 2.25 },
  ],

  // ── 第 4 行：下排字母 ──
  [
    { id: 'ShiftLeft',  label: 'Shift', width: 2.25 },
    { id: 'z', label: 'Z', width: 1 },
    { id: 'x', label: 'X', width: 1 },
    { id: 'c', label: 'C', width: 1 },
    { id: 'v', label: 'V', width: 1 },
    { id: 'b', label: 'B', width: 1 },
    { id: 'n', label: 'N', width: 1 },
    { id: 'm', label: 'M', width: 1 },
    { id: ',', label: ',', width: 1 },
    { id: '.', label: '.', width: 1 },
    { id: '/', label: '/', width: 1 },
    { id: 'ShiftRight', label: 'Shift', width: 2.75 },
  ],

  // ── 第 5 行：空格键 ──
  [
    { id: ' ', label: '␣ 空格键', width: 6.25 },
  ],
]

/** 按键高度基准 */
const KEY_H = 44

function keyStyle(key: KeyDef) {
  return { minWidth: (key.width * KEY_H) + 'px' }
}

function keyClasses(key: KeyDef): string[] {
  const cls = ['key']

  // 修饰键（宽键）样式
  if (['Backspace', 'Tab', 'CapsLock', 'Enter', 'ShiftLeft', 'ShiftRight'].includes(key.id)) {
    cls.push('key-mod')
  }
  if (key.id === ' ') cls.push('key-space')

  // 按下高亮
  // 注意：e.key 对 Shift 返回 'Shift'（不分左右），所以要兼容
  const isShift = key.id.startsWith('Shift')
  const pressed = props.pressedKeys.has(key.id) ||
    (isShift && props.pressedKeys.has('Shift'))
  const pressedUpper = props.pressedKeys.has(key.id.toUpperCase())
  if (pressed || pressedUpper) cls.push('pressed')

  // 当前目标高亮
  if (props.activeKey) {
    const activeLower = props.activeKey.toLowerCase()
    if (key.id === activeLower || key.id === props.activeKey) {
      cls.push('target')
    }
  }

  // CapsLock 指示灯
  if (key.id === 'CapsLock' && props.capsLock) {
    cls.push('caps-on')
  }

  return cls
}
</script>

<template>
  <div class="keyboard">
    <div
      v-for="(row, ri) in rows"
      :key="ri"
      class="row"
      :class="`row-${ri + 1}`"
    >
      <div
        v-for="key in row"
        :key="key.id"
        :class="keyClasses(key)"
        :style="keyStyle(key)"
      >
        {{ key.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 键盘容器 ===== */
.keyboard {
  background: linear-gradient(180deg, #2d3436 0%, #1e272e 100%);
  border-radius: 14px;
  padding: 12px 10px 14px;
  box-shadow:
    0 4px 20px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.08);
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== 行 ===== */
.row {
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
}
.row:last-child { margin-bottom: 0; }

/*
 * 错位（stagger）：模拟真实键盘每行偏左一丁点
 * 每行比上一行多偏移 ≈ 半键宽
 */
.row-1 { padding-left: 0; }
.row-2 { padding-left: 20px; }
.row-3 { padding-left: 34px; }
.row-4 { padding-left: 56px; }

/* ===== 按键 ===== */
.key {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  min-width: 44px;
  padding: 0 3px;
  background: linear-gradient(180deg, #f5f6fa 0%, #dcdde1 100%);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #1e272e;
  box-shadow:
    0 2px 0 #b2bec3,
    0 3px 5px rgba(0,0,0,0.25);
  transition: all 0.05s ease;
  cursor: default;
  font-family: 'Segoe UI', system-ui, sans-serif;
  position: relative;
}

/* 修饰键（Tab / Caps / Shift / Enter / ⌫） */
.key-mod {
  font-size: 11px;
  font-weight: 600;
  background: linear-gradient(180deg, #dfe6e9 0%, #b2bec3 100%);
  text-transform: none;
  color: #2d3436;
}

/* 空格键 */
.key-space {
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 600;
}

/* ===== 状态：按下 ===== */
.key.pressed {
  background: linear-gradient(180deg, #a0d2ff 0%, #74b9ff 100%);
  box-shadow: 0 1px 0 #0984e3;
  transform: translateY(1px);
  color: #1e272e;
}

.key-mod.pressed {
  background: linear-gradient(180deg, #81ecec 0%, #00cec9 100%);
  box-shadow: 0 1px 0 #00b894;
}

/* ===== 状态：目标高亮 ===== */
.key.target {
  background: linear-gradient(180deg, #ffeaa7 0%, #fdcb6e 100%) !important;
  box-shadow:
    0 2px 0 #e17055,
    0 0 18px rgba(253, 203, 110, 0.7);
  animation: pulse-target 0.8s ease-in-out infinite;
}

.key.target.pressed {
  background: linear-gradient(180deg, #ff7675 0%, #e17055 100%) !important;
  box-shadow:
    0 1px 0 #d63031,
    0 0 24px rgba(255, 118, 117, 0.9);
  color: white;
}

@keyframes pulse-target {
  0%, 100% { box-shadow: 0 2px 0 #e17055, 0 0 10px rgba(253, 203, 110, 0.4); }
  50% { box-shadow: 0 2px 0 #e17055, 0 0 28px rgba(253, 203, 110, 0.8); }
}

/* ===== CapsLock 指示灯 ===== */
.key-mod.caps-on {
  background: linear-gradient(180deg, #ffd93d 0%, #fdcb6e 100%);
  box-shadow: 0 2px 0 #e17055, 0 0 10px rgba(253, 203, 110, 0.5);
}
.key-mod.caps-on::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #00b894;
  box-shadow: 0 0 6px rgba(0, 184, 148, 0.8);
}
</style>
