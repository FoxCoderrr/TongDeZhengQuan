import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import Buy from '@/pages/buy'
import Sell from '@/pages/sell'
import Notice from '@/pages/notice'
import Pwd from '@/pages/pwd'
import Entrust from '@/pages/entrust'
import Card from '@/pages/card'
import Withdraw from '@/pages/withdraw'
import Topup from '@/pages/topup'
import Login from '@/pages/login'
import Deal from '@/pages/deal'
import Close from '@/pages/close'
import In from '@/pages/in'
import Out from '@/pages/out'
import Identify from '@/pages/identify'
import Register from '@/pages/register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      components: {
        main: Login,
      }
    },
    {
      path: '/register',
      name: 'register',
      components: {
        main: Register,
      }
    },
    {
      path: '/index',
      name: 'index',
      components: {
        main: Index,
      },
      children:[{
        path: '/index/buy',
        name: 'buy',
        components: {
          child: Buy,
        }
      },{
        path: '/index/sell',
        name: 'sell',
        components: {
          child: Sell,
        }
      },{
        path: '/index/entrust',
        name: 'entrust',
        components: {
          child: Entrust,
        }
      },{
        path: '/index/deal',
        name: 'deal',
        components: {
          child: Deal,
        }
      },{
        path: '/index/close',
        name: 'close',
        components: {
          child: Close,
        }
      },{
        path: '/index/notice',
        name: 'notice',
        components: {
          child: Notice,
        }
      },{
        path: '/index/pwd',
        name: 'pwd',
        components: {
          child: Pwd,
        }
      },{
        path: '/index/card',
        name: 'card',
        components: {
          child: Card,
        }
      },{
        path: '/index/withdraw',
        name: 'withdraw',
        components: {
          child: Withdraw,
        }
      },{
        path: '/index/topup',
        name: 'topup',
        components: {
          child: Topup,
        }
      },{
        path: '/index/in',
        name: 'in',
        components: {
          child: In,
        }
      },{
        path: '/index/out',
        name: 'out',
        components: {
          child: Out,
        }
      },{
        path: '/index/identify',
        name: 'identify',
        components: {
          child: Identify,
        }
      }]
    }
  ]
})
