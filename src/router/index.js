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
      redirect: '/list'
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: 'Home',
        titleCn: '首页',
        titleTw: '首頁',
        iconLeft: false
      },
      component: Home
    },
    {
      path: '/buy',
      name: 'buy',
      meta: {
        title: 'Buy',
        titleCn: '购买',
        titleTw: '購買',
        iconLeft: true
      },
      component: Buy
    },
    {
      path: '/fourCountryBuy',
      name: 'fourCountryBuy',
      meta: {
        title: 'Buy',
        titleCn: '购买',
        titleTw: '購買',
        iconLeft: true
      },
      component: fourCountryBuy
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: 'Register',
        titleCn: '注册',
        titleTw: '註冊',
        iconLeft: true
      },
      component: Register
    },
    {
      path: '/forget',
      name: 'forget',
      meta: {
        title: 'Forgot Password',
        titleCn: '忘记密码',
        titleTw: '忘記密碼',
        iconLeft: true
      },
      component: Forget
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: 'Sign in',
        titleCn: '登录',
        titleTw: '登入',
        iconLeft: true
      },
      component: Login
    },
    {
      path: '/openaccount',
      name: 'openaccount',
      meta: {
        title: 'Account',
        titleCn: '开户',
        titleTw: '開戶',
        iconLeft: false
      },
      component: OpenAccount
    },
    {
      path: '/list',
      name: 'list',
      meta: {
        title: 'Quotation',
        titleCn: '行情',
        titleTw: '行情',
        iconLeft: false
      },
      component: List
    },
    {
      path: '/indexsearchlist',
      name: 'indexsearchlist',
      meta: {
        title: 'Query',
        titleCn: '指数查询',
        titleTw: '指數査詢',
        iconLeft: true
      },
      component: IndexSearchlist
    },
    {
      path: '/indexlist',
      name: 'indexlist',
      meta: {
        title: 'List',
        titleCn: '指数列表',
        titleTw: '指數清單',
        iconLeft: true
      },
      component: IndexList
    },
    {
      path: '/searchlist',
      name: 'searchlist',
      meta: {
        title: 'Query',
        titleCn: '个股查询',
        titleTw: '個股查詢',
        iconLeft: true
      },
      component: Searchlist
    },
    {
      path: '/searchmylist',
      name: 'searchmylist',
      meta: {
        title: 'Query',
        titleCn: '自选查询',
        titleTw: '自選査詢',
        iconLeft: true
      },
      component: SearchMylist
    },
    {
      path: '/mylist',
      name: 'mylist',
      meta: {
        title: 'List',
        titleCn: '自选列表',
        titleTw: '自選清單',
        iconLeft: false
      },
      component: MyList
    },
    {
      path: '/listdetail',
      name: 'listdetail',
      meta: {
        title: 'Detail',
        titleCn: '详情',
        titleTw: '詳情',
        iconLeft: true
      },
      component: ListDetail
    },
    {
      path: '/listdetail2',
      name: 'listdetail2',
      meta: {
        title: 'Detail',
        titleCn: '详情',
        titleTw: '詳情',
        iconLeft: true
      },
      component: ListDetail2
    },
    {
      path: '/list4countryDetail',
      name: 'list4countryDetail',
      meta: {
        title: 'Detail',
        titleCn: '详情',
        titleTw: '詳情',
        iconLeft: true
      },
      component: List4countryDetail
    },
    {
      path: '/indexBuy',
      name: 'indexBuy',
      meta: {
        title: 'Buy',
        titleCn: '指数购买',
        titleTw: '指數購買',
        iconLeft: true
      },
      component: indexBuy
    },
    {
      path: '/twoBuy',
      name: 'TwoBuy',
      meta: {
        title: 'Transaction',
        titleCn: '两融交易',
        titleTw: '兩融交易',
        iconLeft: true
      },
      component: TwoBuy
    },
    {
      path: '/subWarehouseBuy',
      name: 'SubWarehouseBuy',
      meta: {
        title: 'Transaction',
        titleCn: '分仓交易',
        titleTw: '分倉交易',
        iconLeft: true
      },
      component: SubWarehouseBuy
    },
    {
      path: '/futuresBuy',
      name: 'futuresBuy',
      meta: {
        title: 'Buy',
        titleCn: '期货购买',
        titleTw: '期貨購買',
        iconLeft: true
      },
      component: futuresBuy
    },
    {
      path: '/inquiry',
      name: 'inquiry',
      meta: {
        title: 'Inquiry',
        titleCn: '询价',
        titleTw: '詢價',
        iconLeft: true
      },
      component: Inquiry
    },
    {
      path: '/user',
      name: 'user',
      meta: {
        title: 'My',
        titleCn: '我的',
        titleTw: '我的',
        iconLeft: false
      },
      component: User
    },
    {
      path: '/transfer',
      name: 'transfer',
      meta: {
        title: 'Fund Transfer',
        titleCn: '资金互转',
        titleTw: '資金互轉',
        iconLeft: true
      },
      component: Transfer
    },
    {
      path: '/orderlist',
      name: 'orderlist',
      meta: {
        title: 'Position Holding',
        titleCn: '持仓',
        titleTw: '持倉',
        iconLeft: false
      },
      component: OrderList
    },
    {
      path: '/holdorderlist',
      name: 'holdorderlist',
      meta: {
        title: 'Query',
        titleCn: '查询持仓',
        titleTw: '査詢持倉',
        iconLeft: true
      },
      component: holdOrderList
    },
    {
      path: '/holdorderlist2',
      name: 'holdorderlist2',
      meta: {
        title: 'Query',
        titleCn: '查询持仓',
        titleTw: '査詢持倉',
        iconLeft: true
      },
      component: holdOrderList2
    },
    {
      path: '/sellorderlist',
      name: 'sellorderlist',
      meta: {
        title: 'Query',
        titleCn: '查询平仓',
        titleTw: '査詢平倉',
        iconLeft: true
      },
      component: sellOrderList
    },
    {
      path: '/sellorderlist2',
      name: 'sellorderlist2',
      meta: {
        title: 'Query',
        titleCn: '查询平仓',
        titleTw: '査詢平倉',
        iconLeft: true
      },
      component: sellOrderList2
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        title: 'Financial Details',
        titleCn: '资金明细',
        titleTw: '資金明細',
        iconLeft: true
      },
      component: Detail
    },
    {
      path: '/card',
      name: 'card',
      meta: {
        title: 'Bank Card',
        titleCn: '银行卡',
        titleTw: '銀行卡',
        iconLeft: true
      },
      component: Card
    },
    {
      path: '/authentication',
      name: 'authentication',
      meta: {
        title: 'Authentication',
        titleCn: '认证',
        titleTw: '認證',
        iconLeft: true
      },
      component: Authentication
    },
    {
      path: '/aggre',
      name: 'aggre',
      meta: {
        title: 'Cooperation Agreement',
        titleCn: '合作协议',
        titleTw: '合作協定',
        iconLeft: true
      },
      component: Aggre
    },
    {
      path: '/recharge',
      name: 'recharge',
      meta: {
        title: 'Transfer',
        titleCn: '银证转入',
        titleTw: '銀證轉入',
        iconLeft: true
      },
      component: Recharge
    },
    {
      path: '/rechargeSure',
      name: 'rechargeSure',
      meta: {
        title: 'Confirm Recharge',
        titleCn: '确认充值',
        titleTw: '確認充值',
        iconLeft: true
      },
      component: RechargeSure
    },
    {
      path: '/rechargelist',
      name: 'rechargelist',
      meta: {
        title: 'Recharge Record',
        titleCn: '充值记录',
        titleTw: '充值記錄',
        iconLeft: true
      },
      component: RechargeList
    },
    {
      path: '/cash',
      name: 'cash',
      meta: {
        title: 'Withdrawal',
        titleCn: '提现',
        titleTw: '提現',
        iconLeft: true
      },
      component: Cash
    },
    {
      path: '/addCard',
      name: 'addCard',
      meta: {
        title: 'Add Bank Card',
        titleCn: '添加银行卡',
        titleTw: '添加銀行卡',
        iconLeft: true
      },
      component: AddCard
    },
    {
      path: '/cashlist',
      name: 'cashlist',
      meta: {
        title: 'Transfer Out Record',
        titleCn: '转出记录',
        titleTw: '轉出記錄',
        iconLeft: true
      },
      component: Cashlist
    },
    {
      path: '/setting',
      name: 'setting',
      meta: {
        title: 'Set Up',
        titleCn: '设置',
        titleTw: '設定',
        iconLeft: true
      },
      component: Setting
    },
    {
      path: '/agree',
      name: 'agree',
      meta: {
        title: 'Registration Agreement',
        titleCn: '注册协议',
        titleTw: '註冊協定',
        iconLeft: true
      },
      component: Agree
    },
    {
      path: '/trade',
      name: 'trade',
      meta: {
        title: 'Statement',
        titleCn: '交易⻛险揭示书',
        titleTw: '交易⻛險揭示書',
        iconLeft: true
      },
      component: Trage
    },
    {
      path: '/alertdetail',
      name: 'alertdetail',
      meta: {
        title: 'Announcement',
        titleCn: '公告详情',
        titleTw: '公告詳情',
        iconLeft: true
      },
      component: Alertdetail
    },
    {
      path: '/funds',
      name: 'funds',
      meta: {
        title: 'Allocation',
        titleCn: '配资主页',
        titleTw: '配資主頁',
        iconLeft: true
      },
      component: () => import('../page/funds/index')
    },
    {
      path: '/days',
      name: 'days',
      meta: {
        title: 'Allocate',
        titleCn: '按天配资',
        titleTw: '按天配資',
        iconLeft: true
      },
      component: () => import('../page/funds/days')
    },
    {
      path: '/xingu',
      name: 'xingu',
      meta: {
        title: 'Subscription',
        titleCn: '新股申购',
        titleTw: '新股申購',
        iconLeft: true
      },
      component: () => import('../page/funds/xingu')
    },
    {
      path: '/searchStock',
      name: 'searchStock',
      meta: {
        title: 'Search For Stocks',
        titleCn: '查询股票',
        titleTw: '査詢股票',
        iconLeft: true
      },
      component: () => import('../page/list/search')
    },
    {
      path: '/notify',
      name: 'notify',
      meta: {
        title: 'Message Record',
        titleCn: '消息记录',
        titleTw: '消息記錄',
        iconLeft: true
      },
      component: () => import('../page/user/notify')
    },
    {
      path: '/fundslist',
      name: 'fundslist',
      meta: {
        title: 'Allocation',
        titleCn: '分仓配资',
        titleTw: '分倉配資',
        iconLeft: true
      },
      component: FundsList
    },
    {
      path: '/deposit',
      name: 'deposit',
      meta: {
        title: 'Deposit',
        titleCn: '入金',
        titleTw: '入金',
        iconLeft: true
      },
      component: Deposit
    },
    {
      path: '/depositDetail',
      name: 'depositDetail',
      meta: {
        title: 'Deposit',
        titleCn: '入金',
        titleTw: '入金',
        iconLeft: true
      },
      component: DepositDetail
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      meta: {
        title: 'Withdrawal',
        titleCn: '出金',
        titleTw: '出金',
        iconLeft: true
      },
      component: Withdraw
    },
    {
      path: '/transferMoney',
      name: 'transferMoney',
      meta: {
        title: 'Transfer Accounts',
        titleCn: '转账',
        titleTw: '轉帳',
        iconLeft: true
      },
      component: TransferMoney
    },
    {
      path: '/moneyList',
      name: 'moneyList',
      meta: {
        title: 'Financial Details',
        titleCn: '资金明细',
        titleTw: '資金明細',
        iconLeft: true
      },
      component: MoneyList
    },
    {
      path: '/marketApply',
      name: 'marketApply',
      meta: {
        title: 'Apply for Market',
        titleCn: '申请市场',
        titleTw: '申請市場',
        iconLeft: true
      },
      component: MarketApply
    },
    {
      path: '/fundsnew',
      name: 'fundsnew',
      meta: {
        title: 'Fund',
        titleCn: '基金',
        titleTw: '基金',
        iconLeft: false
      },
      component: FundsNewList
    },
    {
      path: '/fundsdetail',
      name: 'fundsdetail',
      meta: {
        title: 'Fund Details',
        titleCn: '基金详情',
        titleTw: '基金詳情',
        iconLeft: true
      },
      component: FundsNewDetail
    },
    {
      path: '/positions',
      name: 'positions',
      meta: {
        title: 'Fund',
        titleCn: '基金',
        titleTw: '基金',
        iconLeft: true
      },
      component: FundsNewDetail
    },
    {
      // 会匹配所有路径
      path: '*',
      redirect: '/list'
    }
  ]
})
