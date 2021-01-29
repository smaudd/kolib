const guardedRoutes = [
  '/profile',
]

const sessionRoutes = [
  '/login',
  '/signup'
]

export const actions = {
  async nuxtServerInit({ dispatch, commit }, { res, redirect, route }) {
    console.log(redirect)
    if (res && res.locals && res.locals.user) {
      const { allClaims: claims, idToken: token, ...authUser } = res.locals.user
      commit('ON_AUTH_STATE_CHANGED_MUTATION', { authUser, claims, token })
      if (sessionRoutes.includes(route.path)) {
        return redirect('/profile')
      }
      return
    }
    if (guardedRoutes.includes(route.path)) {
      return redirect('/login')
    }
  }
}

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    // Do this:
    if (authUser) {
      const { uid, email, emailVerified, displayName } = authUser
      state.user = { uid, email, emailVerified, displayName }
      return
    }
    state.user = null
  },
  ON_SET_USER: (state, user) => {
    if (!user) {
      state.user = null
      return
    }
    const { uuid, email, emailVerified, displayName } = user
    state.user = { uuid, email, emailVerified, displayName }
  }
}