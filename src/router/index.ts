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
          redirect: '/home',
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
              path: 'animal/detail',
              meta: {
                module: 'animal'
              },
              component: () => import('@/views/user/animal/components/AnimalDetail.vue')
            },
            {
              path: 'post',
              meta: {
                module: 'post'
              },
              component: () => import('@/views/user/post/index.vue')
            },
            {
              path: 'post/addPost',
              meta: {
                module: 'post'
              },
              component: () => import('@/views/user/post/add.vue')
            },
            {
              path: 'post/editPost',
              meta: {
                module: 'post'
              },
              component: () => import('@/views/user/post/edit.vue')
            },
            {
              path: 'post/detail',
              meta: {
                module: 'post'
              },
              component: () => import('@/views/user/post/components/PostDetail.vue')
            },
            {
              path: 'notice',
              meta: {
                module: 'notice'
              },
              component: () => import('@/views/user/notice/index.vue')
            },
            {
              path: 'notice/detail',
              meta: {
                module: 'notice'
              },
              component: () => import('@/views/user/notice/components/NoticeDetail.vue')
            },
            {
              path: 'personal',
              name: 'personal',
              component: () => import('@/views/user/personal/index.vue'),
              children: [
                {
                  path: 'personalAnimal',
                  meta: {
                    module: 'personalAnimal'
                  },
                  component: () => import('@/views/user/personal/components/PersonalAnimal.vue')
                },
                {
                  path: 'personalPost',
                  meta: {
                    module: 'personalPost'
                  },
                  component: () => import('@/views/user/personal/components/PersonalPost.vue')
                },
                {
                  path: 'personalApply',
                  meta: {
                    module: 'personalApply'
                  },
                  component: () => import('@/views/user/personal/components/PersonalApply.vue')
                },
                {
                  path: 'adoptRecord',
                  meta: {
                    module: 'adoptRecord'
                  },
                  component: () => import('@/views/user/personal/components/AdoptRecord.vue')
                }
              ]
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
                  path: 'animalManage/detail',
                  meta: {
                    module: 'animalManage'
                  },
                  component: () => import('@/views/platform/animal/animal_manage/detail.vue')
                },
                {
                  path: 'animalManage/edit',
                  meta: {
                    module: 'animalManage'
                  },
                  component: () => import('@/views/platform/animal/animal_manage/edit.vue')
                },
                {
                  path: 'categoryManage',
                  meta: {
                    module: 'categoryManage'
                  },
                  component: () => import('@/views/platform/animal/category_manage/index.vue')
                },
                {
                  path: 'adoptManage',
                  meta: {
                    module: 'adoptManage'
                  },
                  component: () => import('@/views/platform/animal/adopt_manage/index.vue')
                },
                {
                  path: 'adoptManage/detail',
                  meta: {
                    module: 'adoptManage'
                  },
                  component: () =>
                    import('@/views/platform/animal/adopt_manage/components/AdoptDetail.vue')
                },
                {
                  path: 'contributionManage',
                  meta: {
                    module: 'contributionManage'
                  },
                  component: () => import('@/views/platform/animal/contribution_manage/index.vue')
                },
                {
                  path: 'contributionManage/detail',
                  meta: {
                    module: 'contributionManage'
                  },
                  component: () =>
                    import(
                      '@/views/platform/animal/contribution_manage/components/ContributionDetail.vue'
                    )
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
                  component: () =>
                    import('@/views/platform/community/post_manage/components/PostDetail.vue')
                },
                {
                  path: 'commentManage',
                  meta: {
                    module: 'commentManage'
                  },
                  component: () => import('@/views/platform/community/comment_manage/index.vue')
                }
              ]
            },
            {
              path: 'notice',
              meta: {
                module: 'notice'
              },
              children: [
                {
                  path: 'noticeTypeManage',
                  meta: {
                    module: 'noticeTypeManage'
                  },
                  component: () => import('@/views/platform/notice/notice_type_manage/index.vue')
                },
                {
                  path: 'noticeArticleManage',
                  meta: {
                    module: 'noticeArticleManage'
                  },
                  component: () => import('@/views/platform/notice/notice_article_manage/index.vue')
                },
                {
                  path: 'noticeArticleManage/add',
                  meta: {
                    module: 'noticeArticleManage'
                  },
                  component: () => import('@/views/platform/notice/notice_article_manage/add.vue')
                },
                {
                  path: 'noticeArticleManage/edit',
                  meta: {
                    module: 'noticeArticleManage'
                  },
                  component: () => import('@/views/platform/notice/notice_article_manage/edit.vue')
                }
              ]
            },
            {
              path: 'system',
              meta: {
                module: 'system'
              },
              children: [
                {
                  path: 'userManage',
                  meta: {
                    module: 'userManage'
                  },
                  component: () => import('@/views/platform/system/user_manage/index.vue')
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
      component: () => import('@/views/login/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/login/register.vue')
    }
  ]
})

const whiteList = ['/login', '/register']

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
