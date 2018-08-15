import Vue from 'vue'
import Router from 'vue-router'
import minerTbale from '@/components/minerTbale'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'minerTbale',
      component: minerTbale
    }
  ]
})
