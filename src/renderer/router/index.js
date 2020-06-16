import Vue from 'vue'
import Router from 'vue-router'
import CheckAuth from './auth-check'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: require('@/views/Auth/Login').default,
      meta: {
        auth: true
      }
    },
    {
      path: '/',
      name: 'Home',
      redirect: '/logins',
      component: require('@/views/Home/index').default,
      children: [
        {
          path: '/logins',
          name: 'Logins',
          component: require('@/views/Logins/index').default,
          children: [
            {
              path: 'create',
              name: 'LoginCreate',
              component: require('@/views/Logins/Create').default
            },
            {
              path: ':id',
              name: 'LoginDetail',
              component: require('@/views/Logins/Detail').default
            }
          ]
        },
        {
          path: '/credit-cards',
          name: 'CreditCards',
          component: require('@/views/CreditCards/index').default,
          children: [
            {
              path: 'create',
              name: 'CreditCardCreate',
              component: require('@/views/CreditCards/Create').default
            },
            {
              path: ':id',
              name: 'CreditCardDetail',
              component: require('@/views/CreditCards/Detail').default
            }
          ]
        },
        {
          path: '/bank-accounts',
          name: 'BankAccounts',
          component: require('@/views/BankAccounts/index').default,
          children: [
            {
              path: 'create',
              name: 'BankAccountCreate',
              component: require('@/views/BankAccounts/Create').default
            },
            {
              path: ':id',
              name: 'BankAccountDetail',
              component: require('@/views/BankAccounts/Detail').default
            }
          ]
        },
        {
          path: '/private-notes',
          name: 'PrivateNotes',
          component: require('@/views/PrivateNotes/index').default
        },
        {
          path: '/identities',
          name: 'Identities',
          component: require('@/views/Identities/index').default
        },
        {
          path: '/trash',
          name: 'Trash',
          component: require('@/views/Trash/index').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach(CheckAuth)

export default router
