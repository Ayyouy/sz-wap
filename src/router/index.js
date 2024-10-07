import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/home/home'
import Buy from '@/page/home/buy'
import fourCountryBuy from '@/page/home/4country-buy'
import Alertdetail from '@/page/home/components/alert' // 公告详情
import Register from '@/page/register'
import Forget from '@/page/forget-next'
import Login from '@/page/login-next'
import List from '@/page/list/list'
import Searchlist from '@/page/list/list-search'
import IndexSearchlist from '@/page/list/indexlist-search' // 指数查询
import SearchMylist from '@/page/list/my-list-search'
import ListDetail from '@/page/list/detail'
import ListDetail2 from '@/page/list/detail2'
import List4countryDetail from '@/page/list/list4countryDetail'
import MyList from '@/page/list/my-list'
import Inquiry from '@/page/home/inquiry'
import User from '@/page/user/user'
import OrderList from '@/page/user/order-list'
import holdOrderList from '@/page/user/search-order/hold-stockCode'
import holdOrderList2 from '@/page/user/search-order/hold-stockSpell'
import sellOrderList from '@/page/user/search-order/sell-stockCode'
import sellOrderList2 from '@/page/user/search-order/sell-stockSpell'
import Detail from '@/page/user/detail'
import Card from '@/page/user/card'
import Authentication from '@/page/user/authentication'
import Aggre from '@/page/user/agreement'
import Recharge from '@/page/user/recharge'
import RechargeSure from '@/page/user/recharge-sure'
import RechargeList from '@/page/user/rechargelist'
import Cash from '@/page/user/cash'
import Cashlist from '@/page/user/cashlist'
import AddCard from '@/page/user/addCard'
import Setting from '@/page/user/my'
import Transfer from '@/page/user/transfer'
import IndexList from '@/page/list/index-list'
import indexBuy from '@/page/home/index-buy'
import TwoBuy from '@/page/home/two-buy'
import SubWarehouseBuy from '@/page/home/sub-warehouse-buy'
import futuresBuy from '@/page/home/futures-buy'
import Agree from '@/page/registerAgree'
import Trage from '@/page/tradeAgree'
import OpenAccount from '@/page/openaccount'
import FundsList from '@/page/funds/funds-list'
import Deposit from '@/page/user/deposit'
import DepositDetail from '@/page/user/depositDetail'
import Withdraw from '@/page/user/withdraw'
import TransferMoney from '@/page/user/transferMoney'
import MarketApply from '@/page/user/marketApply'
import MoneyList from '@/page/user/moneyList'
import FundsNewList from '@/page/funds-new/index'
import FundsNewDetail from '@/page/funds-new/funds-detail'

Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch((error) => error)
}

export default new Router({
  routes: [
    {
      path: '/',
      // redirect: "/home",
      redirect: '/list'
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '首页',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'none'
      },
      component: Home
    },
    {
      path: '/buy',
      name: 'buy',
      meta: {
        title: '购买',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Buy
    },
    {
      path: '/fourCountryBuy',
      name: 'fourCountryBuy',
      meta: {
        title: '购买',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: fourCountryBuy
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册',
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Register
    },
    {
      path: '/forget',
      name: 'forget',
      meta: {
        title: '忘记密码',
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Forget
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录',
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Login
    },
    {
      path: '/openaccount',
      name: 'openaccount',
      meta: {
        title: '开户',
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'none'
      },
      component: OpenAccount
    },
    {
      path: '/list',
      name: 'list',
      meta: {
        title: '行情',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'none'
      },
      component: List
    },
    {
      path: '/indexsearchlist',
      name: '指数查询',
      meta: {
        title: '指数查询',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: IndexSearchlist
    },
    {
      path: '/indexlist',
      name: 'indexlist',
      meta: {
        title: '指数列表',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: IndexList,
    },
    {
      path: '/searchlist',
      name: '个股查询',
      meta: {
        title: '个股查询',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Searchlist
    },
    {
      path: '/searchmylist',
      name: 'searchmylist',
      meta: {
        title: '自选查询',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: SearchMylist
    },
    {
      path: '/mylist',
      name: 'mylist',
      meta: {
        title: '自选列表',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'none'
      },
      component: MyList
    },
    {
      path: '/listdetail',
      name: 'listdetail',
      meta: {
        title: '详情',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: ListDetail
    },
    {
      path: '/listdetail2',
      name: 'listdetail2',
      meta: {
        title: '详情',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: ListDetail2
    },
    {
      path: '/list4countryDetail',
      name: 'list4countryDetail',
      meta: {
        title: '详情',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: List4countryDetail
    },
    {
      path: '/indexBuy',
      name: 'indexBuy',
      meta: {
        title: '指数购买',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'search',
        iconLeft: 'default'
      },
      component: indexBuy
    },
    {
      path: '/twoBuy',
      name: 'TwoBuy',
      meta: {
        title: '两融交易',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'search',
        iconLeft: 'default'
      },
      component: TwoBuy
    },
    {
      path: '/subWarehouseBuy',
      name: 'SubWarehouseBuy',
      meta: {
        title: '分仓交易',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'search',
        iconLeft: 'default'
      },
      component: SubWarehouseBuy
    },
    {
      path: '/futuresBuy',
      name: 'futuresBuy',
      meta: {
        title: '期货购买',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: futuresBuy
    },
    {
      path: '/inquiry',
      name: 'inquiry',
      meta: {
        title: '询价',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Inquiry
    },
    {
      path: '/user',
      name: 'user',
      meta: {
        title: '我的',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'none'
      },
      component: User
    },
    {
      path: '/transfer',
      name: 'transfer',
      meta: {
        title: '资金互转',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Transfer
    },
    {
      path: '/orderlist',
      name: 'orderlist',
      meta: {
        title: '持仓',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'none'
      },
      component: OrderList
    },
    {
      path: '/holdorderlist',
      name: 'holdorderlist',
      meta: {
        title: '查询持仓',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: holdOrderList
    },
    {
      path: '/holdorderlist2',
      name: 'holdorderlist2',
      meta: {
        title: '查询持仓',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: holdOrderList2
    },
    {
      path: '/sellorderlist',
      name: 'sellorderlist',
      meta: {
        title: '查询平仓',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: sellOrderList
    },
    {
      path: '/sellorderlist2',
      name: 'sellorderlist2',
      meta: {
        title: '查询平仓',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: sellOrderList2
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        title: '资金明细',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Detail
    },
    {
      path: '/card',
      name: 'card',
      meta: {
        title: '银行卡',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Card
    },
    {
      path: '/authentication',
      name: 'authentication',
      meta: {
        title: '认证',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Authentication
    },
    {
      path: '/aggre',
      name: 'aggre',
      meta: {
        title: '合作协议',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Aggre
    },
    {
      path: '/recharge',
      name: 'recharge',
      meta: {
        title: '银证转入',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Recharge
    },
    {
      path: '/rechargeSure',
      name: 'rechargeSure',
      meta: {
        title: '确认充值',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: RechargeSure
    },
    {
      path: '/rechargelist',
      name: 'rechargelist',
      meta: {
        title: '充值记录',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: RechargeList
    },
    {
      path: '/cash',
      name: 'cash',
      meta: {
        title: '提现',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Cash
    },
    {
      path: '/addCard',
      name: 'addCard',
      meta: {
        title: '添加银行卡',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: AddCard
    },
    {
      path: '/cashlist',
      name: 'cashlist',
      meta: {
        title: '转出记录',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Cashlist
    },
    {
      path: '/setting',
      name: 'setting',
      meta: {
        title: '设置',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Setting
    },
    {
      path: '/agree',
      name: 'agree',
      meta: {
        title: '注册协议',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Agree
    },
    {
      path: '/trade',
      name: 'trade',
      meta: {
        title: '交易⻛险揭示书',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Trage
    },
    {
      path: '/alertdetail',
      name: 'alertdetail',
      meta: {
        title: '公告详情',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Alertdetail
    },
    {
      path: '/funds',
      name: 'funds',
      meta: {
        title: '配资主页',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'setting',
        iconLeft: 'default'
      },
      component: () => import('../page/funds/index')
    },
    {
      path: '/days',
      name: 'days',
      meta: {
        title: '按天配资',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'setting',
        iconLeft: 'default'
      },
      component: () => import('../page/funds/days')
    },
    {
      path: '/xingu',
      name: 'xingu',
      meta: {
        title: '新股申购',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'setting',
        iconLeft: 'default'
      },
      component: () => import('../page/funds/xingu')
    },
    {
      path: '/searchStock',
      name: 'searchStock',
      meta: {
        title: '查询股票',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: () => import('../page/list/search')
    },
    {
      path: '/notify',
      name: 'notify',
      meta: {
        title: '消息记录',
        requireAuth: true,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: () => import('../page/user/notify')
    },
    {
      path: '/fundslist',
      name: 'fundslist',
      meta: {
        title: '分仓配资',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: FundsList
    },
    {
      path: '/deposit',
      name: 'deposit',
      meta: {
        title: '入金',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Deposit
    },
    {
      path: '/depositDetail',
      name: 'depositDetail',
      meta: {
        title: '入金',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: DepositDetail
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      meta: {
        title: '出金',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: Withdraw
    },
    {
      path: '/transferMoney',
      name: 'transferMoney',
      meta: {
        title: '转账',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: TransferMoney
    },
    {
      path: '/moneyList',
      name: 'moneyList',
      meta: {
        title: '资金明细',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: MoneyList
    },
    {
      path: '/marketApply',
      name: 'marketApply',
      meta: {
        title: '申请市场',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: MarketApply
    },
    {
      path: '/fundsnew',
      name: 'fundsnew',
      meta: {
        title: '基金',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'none'
      },
      component: FundsNewList
    },
    {
      path: '/fundsdetail',
      name: 'fundsdetail',
      meta: {
        title: '基金',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: FundsNewDetail
    },
    {
      path: '/positions',
      name: 'positions',
      meta: {
        title: '基金',
        requireAuth: false,
        hasHeader: true,
        iconRight: 'none',
        iconLeft: 'default'
      },
      component: FundsNewDetail
    },
    {
      // 会匹配所有路径
      path: '*',
      // redirect: "/home",
      redirect: '/list'
    }
  ]
})
