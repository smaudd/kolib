import ObjectUrl from '~/assets/js/objectUrl.worker.js'

export  default (context, inject) => {
  inject('worker', {
   createWorker () {
   return  new  ObjectUrl()
  }
 })
}