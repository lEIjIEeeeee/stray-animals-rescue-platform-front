import { getToken, getUserType } from '@/utils/auth'
import { ElMessage } from 'element-plus'
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
          component: () => import('@/views/user/home/index.vue'),
          children: [
            {
              path: 'home',
              meta: {
                module: 'home'
              },
              component: () => import('@/views/user/home/components/HomePage.vue')
            },
            {
              path: 'animal',
              meta: {
                module: 'animal'
              },
              component: () => import('@/views/user/animal/index.vue')
            },
            {
              path: 'post',
              meta: {
                module: 'post'
              },
              component: () => import('@/views/user/post/index.vue')
            },
            {
              path: 'detail',
              meta: {
                module: 'post'
              },
              component: () => import('@/views/user/post/components/PostDetail.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/platform',
      name: 'platform',
      children: [
        {
          path: '',
          component: () => import('@/views/platform/home/index.vue'),
          redirect: '/platform/home',
          children: [
            {
              path: 'home',
              meta: {
                module: 'home'
              },
              redirect: '/platform/home/workbench',
              children: [
                {
                  path: 'workbench',
                  meta: {
                    module: 'workbench'
                  },
                  component: () => import('@/views/platform/home/components/HomePage.vue')
                }
              ]
            },
            {
              path: 'animal',
              meta: {
                module: 'animal'
              },
              children: [
                {
                  path: 'animalManage',
                  meta: {
                    module: 'animalManage'
                  },
                  component: () => import('@/views/platform/animal/animal_manage/index.vue')
                },
                {
                  path: 'categoryManage',
                  meta: {
                    module: 'categoryManage'
                  },
                  component: () => import('@/views/platform/animal/category_manage/index.vue')
                }
              ]
            },
            {
              path: 'community',
              meta: {
                module: 'community'
              },
              children: [
                {
                  path: 'postManage',
                  meta: {
                    module: 'postManage'
                  },
                  component: () => import('@/views/platform/community/post_manage/index.vue')
                },
                {
                  path: 'postManage/detail',
                  meta: {
                    module: 'postManage'
                  },
                  component: () => import('@/views/platform/community/post_manage/detail.vue')
                },
                {
                  path: 'commentManage',
                  meta: {
                    module: 'commentManage'
                  },
                  component: () => import('@/views/platform/community/comment_manage/index.vue')
                }
              ]
            }
          ]
        }
      ]
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
          component: () => import('@/views/user/post/components/PostAdd.vue')
        }
      ]
    }
  ]
})

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  if (whiteList.includes(to.path)) {
    next()
  } else {
    const token = getToken()
    if (token) {
      const userType = getUserType()
      if (userType === 'PLATFORM_ADMIN') {
        if (to.path === '' || to.path === '/') {
          next({
            path: '/platform'
          })
        } else {
          next()
        }
      } else {
        if (to.path === '' || to.path === '/') {
          next({
            path: '/home'
          })
        } else if (to.path.includes('/platform')) {
          ElMessage.error('当前用户没有管理员权限')
          next({
            path: '/'
          })
        } else {
          next()
        }
      }
    } else {
      ElMessage.error('请先登录')
      next({
        path: '/login'
      })
    }
  }
})

export default router
