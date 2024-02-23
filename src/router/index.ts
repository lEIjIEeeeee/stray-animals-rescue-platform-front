import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      children: [
        {
          path: '',
          component: () => import('@/views/home/user_home/index.vue'),
          children: [
            {
              path: 'home',
              meta: {
                module: 'home'
              },
              component: () => import('@/views/home/user_home/components/HomePage.vue')
            },
            {
              path: 'animal',
              meta: {
                module: 'animal'
              },
              component: () => import('@/views/animal/index.vue')
            },
            {
              path: 'post',
              meta: {
                module: 'post'
              },
              component: () => import('@/views/post/index.vue')
            },
            {
              path: 'detail',
              meta: {
                module: 'post'
              },
              component: () => import('@/views/post/components/PostDetail.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/platform',
      name: 'platform',
      component: () => import('@/views/home/platform_home/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/post',
      name: 'post',
      children: [
        {
          path: 'addPost',
          component: () => import('@/views/post/components/PostAdd.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from) => {
  if (to.path === '/' || to.path === '') {
    return '/home'
  }
})

export default router
