
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
})

export const mutations = {
  setClip(state, { index, file }) {
    if (state.clips[index]) {
      state.clips.splice(index, 1, { file })
      return
    }
    state.clips.splice(index, 0, { file })
  },
  triggerLoadEmitter(state) {
    state.loadEmitter = Math.random()
  },
  setPreset(state, { index, preset }) {
    if (state.presets[index]) {
      state.presets.splice(index, 1, preset)
      return
    }
    state.presets.splice(index, 0, preset)
  },
  setClipIndex(state, index) {
    state.clipIndex = index
  },
  loadingMany(state, value) {
    state.loadingMany = value
  },
  clear(state, { index }) {
    state.clips[index] = empty
  },
}