
export const state = () => ({
  clips: new Array(16),
  presets: (() => {
    const arr = []
    for (let i = 0; i < 16; i++) {
      arr.push({
        pitch: { value: 0, wet: 0, windowSize: 0.05, delay: 0 },
        reverb: { wet: 1, decay: 0.001, },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 }
      })
    }
    return arr
  })(),
  players: [],
  clipIndex: null,
  loadEmitter: null,
  loading: false,
  autoTrimAll: {
    threshold: 10,
    active: false,
  },
  trim: false,
  undo: null,
  durations: [],
})

export const mutations = {
  setClip(state, { index, file, trimmed }) {
    state.clips.splice(index, 1, { file, trimmed })
  },
  triggerLoadEmitter(state) {
    state.loadEmitter = Math.random()
  },
  triggerTrim(state, payload) {
    state.trim = payload
  },
  triggerUndo(state, payload) {
    state.undo = payload
  },
  setPreset(state, { index, preset }) {
    state.presets.splice(index, 1, preset)
  },
  setClipIndex(state, index) {
    state.clipIndex = index
  },
  setAutoTrim(state, payload) {
    state.autoTrimAll = payload
  },
  loading(state, value) {
    state.loading = value
  },
  clear(state, { index }) {
    state.clips[index] = empty
  },
  setDuration(state, { index, duration }) {
    state.durations.splice(index, 1, duration)
  } 
}