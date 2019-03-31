import Vue from 'vue'
import Router from 'vue-router'
import Welcome from './views/Welcome.vue'
import Die from './views/Die.vue'
import Win from './views/Win.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    }, {
      path: '/game/:id',
      name: 'game',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Competitive.vue')
<<<<<<< HEAD
    },
    {
      path: '/chat/',
      name: 'chat',
      component: () => import('./components/ChatRoom.vue')
=======
    }, {
      path: '/die',
      name: 'die',
      component: Die
    }, {
      path: '/win',
      name: 'die',
      component: Win
>>>>>>> master
    }
  ]
})
