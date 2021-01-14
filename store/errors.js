export const state = () => ({
  message: null
})

export const mutations = {
  set(state, error) {
    state.message = error
  },
  clear(state) {
    state.message = null
  }
}