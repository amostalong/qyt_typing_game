import { ref, onMounted, onUnmounted } from 'vue'

/** 键盘布局定义 */
export const KEYBOARD_ROWS = [
  // 数字行
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  // 上排字母
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  // 中排字母
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  // 下排字母
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
]

/** 特殊按键宽度 */
export const SPECIAL_KEYS: Record<string, { label: string; width: number }> = {
  Backspace: { label: '⌫', width: 1.8 },
  Tab: { label: 'Tab', width: 1.5 },
  CapsLock: { label: 'Caps', width: 1.8 },
  Enter: { label: 'Enter', width: 2.2 },
  ShiftLeft: { label: 'Shift', width: 2.2 },
  ShiftRight: { label: 'Shift', width: 2.5 },
  Space: { label: '', width: 6 },
}

export function useKeyboard(onKeyPress: (key: string) => void) {
  const pressedKeys = ref<Set<string>>(new Set())
  const capsLock = ref(false)

  function handleKeyDown(e: KeyboardEvent) {
    // 输入框 / 文本区里不拦截（否则无法删除文字、移动光标）
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return

    e.preventDefault()
    const key = e.key
    pressedKeys.value = new Set([...pressedKeys.value, key])

    if (key === 'CapsLock') {
      capsLock.value = !capsLock.value
      return
    }

    onKeyPress(key)
  }

  function handleKeyUp(e: KeyboardEvent) {
    const newSet = new Set(pressedKeys.value)
    newSet.delete(e.key)
    pressedKeys.value = newSet
  }

  function isKeyPressed(key: string): boolean {
    return pressedKeys.value.has(key)
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  })

  return {
    pressedKeys,
    capsLock,
    isKeyPressed,
  }
}
