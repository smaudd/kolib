
export const state = () => ({
  clips: new Array(16),
  presets: (() => {
    const arr = []
    for (let i = 0; i < 16; i++) {
      arr.push({
        pitch: { value: 0, wet: 1, windowSize: 0.05, delay: 0 },
        reverb: { wet: 1, decay: 0.001, },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 }
      })
    }
    return arr
  })(),
  players: [],
  clipIndex: null,
  loadEmitter: null,
  loadingMany: false,
  autoTrimAll: true,
})

export const mutations = {
  setClip(state, { index, file }) {
    state.clips.splice(index, 1, { file })
  },
  triggerLoadEmitter(state) {
    const a = window.localStorage.getItem('clips')
    state.loadEmitter = Math.random()
  },
  setPreset(state, { index, preset }) {
    state.presets.splice(index, 1, preset)
  },
  setClipIndex(state, index) {
    state.clipIndex = index
  },
  setAutoTrim(state, value) {
    state.autoTrimAll = value
  },
  loadingMany(state, value) {
    state.loadingMany = value
  },
  clear(state, { index }) {
    state.clips[index] = empty
  },
}