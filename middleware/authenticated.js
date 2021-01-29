import firebase from "firebase/app";
import "firebase/auth";
const authorizedRoutes  = [
  '/profile'
]
const sessionRoutes = [
  '/signup',
  '/login'
]

export default function ({ store, app, redirect }) {
  if (process.client) {
    const auth = firebase.auth()
    const currentUser = auth.currentUser
    const pathname = app.context.route.path
    if (authorizedRoutes.includes(pathname) && !currentUser) {
      return redirect('/login')
    }
    if (currentUser && sessionRoutes.includes(pathname)) {
      return redirect('/profile')
    }
  }
}