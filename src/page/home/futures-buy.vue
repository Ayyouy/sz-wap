<template>
  <div class="wrapper">
    <div class="detail-part">
      <div class="index-name">
        <p>{{ detail.futuresName }} <span>{{ detail.futuresCode }}</span></p>
      </div>
      <div class="clearfix">
        <div class="pull-left col-xs-4">
          <p
            :class="(statusDetail.nowPrice - statusDetail.lastClose)>0?'price red':(statusDetail.nowPrice - statusDetail.lastClose)<0?'green price':'price'">
            {{ Number(statusDetail.nowPrice).toFixed(2) }}</p>
          <p
            :class="(statusDetail.nowPrice - statusDetail.lastClose)>0?'gain red':(statusDetail.nowPrice - statusDetail.lastClose)<0?'green gain':'gain'">
            <span>{{ Number(statusDetail.nowPrice - statusDetail.lastClose).toFixed(2) }}</span>
            <span>{{
                Number((statusDetail.nowPrice - statusDetail.lastClose) / statusDetail.lastClose * 100).toFixed(2)
              }}%</span>
          </p>
        </div>
        <div class="pull-right col-xs-8">
          <ul class="price-detail text-center">
            <li>
              <p :class="(statusDetail.nowPrice - statusDetail.lastClose)<0?'number green':'number red'">
                <span class="title">{{ $t('line.open') }}</span>
                {{ Number(statusDetail.todayOpen).toFixed(2) }}
              </p>
            </li>
            <li>
              <p :class="(statusDetail.nowPrice - statusDetail.lastClose)<0?'number green':'number red'">
                <span class="title">{{ $t('line.prev') }}</span>
                {{ Number(statusDetail.lastClose).toFixed(2) }}
              </p>
            </li>
            <li>
              <p :class="(statusDetail.nowPrice - statusDetail.lastClose)<0?'number green':'number red'">
                <span class="title">{{ $t('line.high') }}</span>
                {{ Number(statusDetail.maxPrice).toFixed(2) }}
              </p>
            </li>
            <li>
              <p :class="(statusDetail.nowPrice - statusDetail.lastClose)<0?'number green':'number red'">
                <span class="title">{{ $t('line.low') }}</span>
                {{ Number(statusDetail.minPrice).toFixed(2) }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="false" class="box-tab">
      <div class="tab-title">
        <span class="circle"></span>{{ $t('market.detail') }}
      </div>
      <div class="tab-con">
        <ul class="first clearfix">
          <li class="pull-left">
            {{ detail.indexName }}
          </li>
          <li :class="detail.floatPoint < 0?'pull-left green':detail.floatPoint == 0?'pull-left':'pull-left red'">
            {{ $t('market.current') }}
            <span>{{ Number(detail.currentPoint).toFixed(2) }}</span>
          </li>
        </ul>
        <ul class="first clearfix">
          <li class="pull-left">
            {{ detail.indexCode }}
          </li>
          <li :class="detail.floatRate < 0?'pull-left green':detail.floatRate == 0?'pull-left':'pull-left red'">
            <span>{{ detail.floatRate }}%</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="box-tab">
      <div class="tab-title">
        <span class="circle"></span>{{ $t('order.select') }}
      </div>
      <div class="tab-con">
        <ul class="radio-group clearfix">
          <li v-for="item in numberList" :key="item.key" @click="selectNumberFun(item.value)">
            <div :class="selectNumber == item.value?'on':''">
              {{ item.label }}
            </div>
          </li>
          <li class="auto" v-show="!selectNumber">
            <input @keyup="changeAutoNumber" v-model="autoNumber" type="text">{{ $t('order.ext') }}
          </li>
        </ul>
        <p class="clearfix">
          <span class="pull-left">{{ $t('order.min') }}{{ Number(detail.minNum) }}{{ $t('order.ext') }}</span>
          <span class="protem pull-right">{{ $t('order.max') }}{{ Number(detail.maxNum) }}{{ $t('order.ext') }}</span>
        </p>
      </div>
    </div>
    <div class="box-tab">
      <div class="tab-title">
        <span class="circle"></span>{{ $t('market.buyType') }}
      </div>
      <div class="tab-con">
        <ul class="radio-group clearfix">
          <li v-for="item in type" :key="item.key" @click="selectTypeFun(item.value)">
            <div :class="selectType == item.value?'on':''">
              {{ item.label }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="box-tab">
      <div class="tab-title">
        <span class="circle"></span>{{ $t('market.choice') }}
      </div>
      <div class="tab-con">
        <ul class="radio-group clearfix">
          <li v-for="item in siteLeverList" :key="item.key" @click="selectCycleFun(item.value)">
            <div :class="selectCycle == item.value?'on':''">
              {{ item.label }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="box-tab">
      <div class="tab-con">
        <p class="text-left page-part">
          <span
            class="">{{
              selectNumber ? selectNumber * detail.futuresStandard : autoNumber * detail.futuresStandard
            }}{{ detail.futuresUnit }}</span>
          <span
            class="pull-right">{{
              $t('market.buyMax')
            }}:{{ (settingInfo.buyMaxPercent * $store.state.userInfo.enableFuturesAmt).toFixed(2) }}</span>
        </p>
        <p class="clearfix">
          <span
            class="pull-left protem">{{ $t('order.amount') }}{{ total ? total : 0 }} {{
              detail.coinCode
            }} ≈ {{ cnyTotal ? cnyTotal : 0 }} CNY</span>
        </p>

      </div>
    </div>
    <div class="agree text-center">
    </div>
    <div class="footer-btn">
      <div class="total">
        <p class="pay">{{ $t('market.pay') }}<span class="protem">${{ cnyTotal ? cnyTotal : 0 }}</span></p>
        <p class="account">({{ $t('money5') }}{{ $store.state.userInfo.enableFuturesAmt }}{{ $t('market.yuan') }})</p>
      </div>
      <mt-button :disabled='buying' class="btn-red" size="small" type="danger" @click="toInquiry">
        {{ $t('order.place') }}
      </mt-button>
    </div>
    <foot></foot>
  </div>
</template>
<script>
import foot from '../../components/foot/foot'
import {Toast} from 'mint-ui'
import {isNull} from '@/utils/utils'
import * as api from '@/axios/api'

export default {
  components: {
    foot
  },
  props: {},
  data () {
    return {
      detail: {}, //
      cycle: [ // 杠杆倍数
        {label: '10', value: '10'},
        {label: '20', value: '20'},
        {label: '30', value: '30'}
      ],
      selectCycle: '20',
      numberList: [
        {label: '1' + this.$t('order.lot'), value: '1'},
        {label: '20' + this.$t('order.ext'), value: '20'},
        {label: '30' + this.$t('order.ext'), value: '30'},
        {label: '50' + this.$t('order.ext'), value: '50'},
        {label: '80' + this.$t('order.ext'), value: '80'},
        {label: '100' + this.$t('order.ext'), value: '100'},
        {label: this.$t('order.custom'), value: ''}
      ],
      selectNumber: '',
      autoNumber: '',
      type: [
        {label: this.$t('order.buyUp'), value: '0'},
        {label: this.$t('order.buyDown'), value: '1'}
      ],
      selectType: '',
      agree: true,
      settingInfo: {
        buyMaxNum: 1000, // 最大买入手数
        buyMinNum: 100 // 最小买入手数
      }, // 设置规则信息
      dialogShow: false,
      timer: null,
      statusDetail: {},
      exchangeNumber: '', // 汇率
      buying: false, // 下单状态
      siteLeverList: []
    }
  },
  watch: {},
  computed: {
    total () {
      if (this.autoNumber) {
        //   每手保证金 * 手数  = 价钱
        return (this.detail.depositAmt * this.autoNumber / this.selectCycle).toFixed(2)
      } else if (this.selectNumber) {
        return (this.detail.depositAmt * this.selectNumber / this.selectCycle).toFixed(2)
      } else {
        return 0
      }
      // 需支付总价 = 每手保证金 * 股（1手 = 100股）
    },
    cnyTotal () {
      // 价钱 * 汇率 转为 人民币
      return (this.total * this.exchangeNumber).toFixed(2)
    },
    price () {
      if (this.autoNumber) {
        return (this.detail.eachPoint * this.autoNumber * 100).toFixed(2)
      } else if (this.selectNumber) {
        return (this.detail.eachPoint * this.selectNumber * 100).toFixed(2)
      } else {
        return 0
      }
      // 买入金额 = 每股价格 * 股（1手 = 100股）
    }
  },
  created () {
    // this.timer = setInterval(this.getDetail, 5000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    this.getDetail()
    this.selectNumber = 0
    this.getSettingFuturesInfo()
    this.getSettingInfo()
    this.queryExchange()
    if (!this.$store.state.userInfo.enableAmt) {
      this.getUserInfo()
    }
    this.detail = this.$route.query.info
  },
  methods: {
    async queryExchange () {
      // 基币汇率
      let data = await api.queryExchange({coinCode: this.detail.coinCode})
      if (data.status === 0) {
        // 成功
        this.exchangeNumber = data.data
      } else {
        Toast(data.msg)
      }
    },
    changeAutoNumber () {
      // 自定义手数
      this.selectNumber = ''
    },
    async getSettingFuturesInfo () {
      // 网站设置信息 期货
      let data = await api.getFuturesSetting()
      if (data.status === 0) {
        // 成功
        this.settingInfo = data.data
        // 杠杆倍数
        // this.selectCycle = data.data.siteLever
      } else {
        Toast(data.msg)
      }
    },
    async getSettingInfo () {
      // 网站设置信息
      let data = await api.getSetting()
      if (data.status === 0) {
        // 成功
        // 杠杆倍数
        this.selectCycle = data.data.siteLever
        if (this.$store.state.userInfo !== undefined && this.$store.state.userInfo !== null && this.$store.state.userInfo.phone !== '' && this.$store.state.userInfo.siteLever !== null) {
          this.selectCycle = this.$store.state.userInfo.siteLever.split('/')[0]
          this.siteLeverList = []
          for (let i = 0; i < this.$store.state.userInfo.siteLever.split('/').length; i++) {
            let val = this.$store.state.userInfo.siteLever.split('/')[i]
            let item = {label: val + this.$t('market.bei'), value: val}
            this.siteLeverList.push(item)
          }
        } else {
          this.selectCycle = data.data.siteLever.split('/')[0]
          this.siteLeverList = []
          for (let i = 0; i < data.data.siteLever.split('/').length; i++) {
            let val = data.data.siteLever.split('/')[i]
            let item = {label: val + this.$t('market.bei'), value: val}
            this.siteLeverList.push(item)
          }
        }
      } else {
        Toast(data.msg)
      }
    },
    isAgree () {
      let i = false
      let j = true
      this.agree = this.agree ? i : j
    },
    totrageUrl () {
      this.$router.push('/trade')
    },
    async getDetail () {
      let opts = {
        futuresGid: this.$route.query.info ? this.$route.query.info.futuresGid : ''
      }
      let data = await api.querySingleMarket(opts)
      if (data.status === 0) {
        this.statusDetail = data.data
        if (this.statusDetail.lastClose === null || this.statusDetail.lastClose === '') {
          this.statusDetail.lastClose = this.statusDetail.extra1
        }
      } else {
        Toast(data.msg)
      }
    },
    selectCycleFun (value) {
      this.selectCycle = value
    },
    selectNumberFun (value) {
      this.selectNumber = value
      if (value !== 0) {
        this.autoNumber = ''
      }
    },
    selectTypeFun (value) {
      this.selectType = value
    },
    canBuyStatus () {
      let dataTime = new Date()
      let day = dataTime.getDay() // 星期几
      let hour = dataTime.getHours() // 小时
      let minute = dataTime.getMinutes() // 分钟
      if (day === 6 || day === 7) {
        return false
      }
      if (hour < 9 || (hour >= 12 && hour < 13) || hour >= 15) {
        return false
      }
      if (hour === 9 && minute < 32) {
        return false
      }
      if (hour === 11 && minute >= 30) {
        return false
      }
      if (hour === 14 && minute > 57) {
        return false
      }
      return true
    },
    async toInquiry () {
      // 判断在不在开盘时间内
      // if(!this.canBuyStatus()){
      //     Toast('不在交易时段内！')
      //     return
      // }
      // 下单
      if (!this.$store.state.userInfo.idCard) {
        Toast(this.$t('market.order'))
        this.$router.push('/authentication')
        return
      }
      if (!this.agree) {
        Toast(this.$t('market.agree'))
        return
      }
      if (isNull(this.selectNumber) && isNull(this.autoNumber)) {
        Toast(this.$t('market.choiceLot'))
        return
      }
      if (isNull(this.selectType)) {
        Toast(this.$t('market.choiceType'))
        return
      }
      this.buying = true
      let opts = {
        FuturesId: this.detail.id,
        buyNum: this.selectNumber ? this.selectNumber : this.autoNumber, // 单位为手
        buyType: this.selectType,
        lever: this.selectCycle ? this.selectCycle : 0
      }
      let data = await api.buyFutures(opts)
      this.buying = false
      if (data.status === 0) {
        Toast(data.data)
        this.getUserInfo()
        this.$router.push('/orderlist?index=4')
      } else {
        Toast(data.msg)
      }
    },
    toDetail () {
      this.$router.push('/listdetail')
    },
    goBack () {
      this.$router.go(-1)
    },
    async getUserInfo () {
      // 获取用户信息
      let data = await api.getUserInfo()
      if (data.status === 0) {
        // Toast(data.msg)
        this.$store.state.userInfo = data.data
      } else {
        Toast(data.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
body {
  background: #fff;
}

.protem {
  color: #ff8000;
}

.agree {
  margin-top: 0.2rem;
  padding-bottom: 1rem;

  a {
    color: #428bca;
  }
}

.footer-btn {
  position: fixed;
  z-index: 1;
  width: 100%;
  padding-right: 0;
  bottom: 0.97rem;
  height: .89rem;
  line-height: .89rem;
  display: flex;

  .total {
    font-size: 0.26rem;
    padding-left: 0.3rem;
    flex: 3;

    .pay {
      line-height: 0.45rem;
    }

    .account {
      line-height: 0.3rem;
      font-size: 0.24rem;
      color: #999;
    }
  }

  .btn-red {
    flex: 2;
    background: #b60c0d;
    border-radius: 0;
    padding: 0;
  }
}

.auto {
  input {
    display: inline-block;
    width: 75%;
    border-bottom: 0.01rem solid #ddd;
  }
}

// bottom 7rem -> 0.97rem
.buy-price {
  // border-top: 0.01rem solid #000000;
  padding-top: 0.15rem;

  p {
    height: 0.32rem;
    line-height: 0.32rem;
  }
}

.mint-popup-white {
  height: 6.5rem;
  padding: 0.25rem;

  .check-box {
    height: 5.3rem;
    line-height: 0.35rem;
    overflow: auto;

    h3 {
      margin-bottom: 0.2rem;
    }
  }

  .box-btn {
    width: 100%;
    padding-top: 0.2rem;

    .btn-red {
      width: 100%;
      height: 0.6rem;
    }
  }
}

.detail-part {
  .index-name {
    font-size: 0.3rem;
    padding: 0.2rem 0.3rem;

    span {
      font-size: 0.22rem;
      color: #999;
      margin-left: 0.2rem;
    }
  }

  .price {
    font-size: 0.5rem;
    padding-bottom: 0.1rem;
  }

  .gain {
    font-size: 0.24rem;
  }

  .title {
    color: #999;
    line-height: 0.36rem;
    padding-right: 0.1rem;

    &.red {
      color: #b60c0d;
    }

    &.green {
      color: #31b97e;
    }
  }

  .number {
    line-height: 0.36rem;
  }

  .price-detail {
    li {
      width: 60%;
      float: left;
      margin-bottom: 0.16rem;
      text-align: right;

      &:nth-child(odd) {
        width: 40%;
        text-align: left;
      }
    }
  }

  .detail-list {
    padding-left: 0.3rem;
  }
}
</style>
