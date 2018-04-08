import Vue from 'vue'
import Router from 'vue-router'
import StartScene from '@/components/startscenecomponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StartScene',
      component: StartScene
    }
  ]
})
