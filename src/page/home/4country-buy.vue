<template>
  <div class="wrapper">
    <div class="detail-part">
      <div class="index-name">
        <p>
          {{ detail.name }}
          <span class="index-name_code">{{ detail.code }}</span>
        </p>
      </div>
      <div class="clearfix">
        <div class="pull-left hangqin-left col-xs-4">
          <p
            :class="
              detail.hcrate < 0
                ? 'price red'
                : detail.hcrate >= 0
                ? 'green price'
                : 'price'
            "
          >
            {{ Number(detail.nowPrice).toFixed(2) }}
          </p>
          <p
            :class="
              detail.hcrate < 0
                ? 'gain red'
                : detail.hcrate > 0
                ? 'green gain'
                : 'gain'
            "
          >
            <span>{{
                Number(detail.hcrate * detail.nowPrice).toFixed(2)
              }}</span>
            <span style="margin-left: 0.1rem"
            >{{ Number(detail.hcrate).toFixed(2) }}%</span
            >
          </p>
        </div>
        <div class="pull-right hangqin-right col-xs-8">
          <ul class="price-detail text-center">
            <li>
              <p :class="detail.hcrate > 0 ? 'number green' : 'number red'">
                <span class="title">涨跌</span>
                {{ Number(detail.hcrate * detail.nowPrice).toFixed(2) }}
              </p>
            </li>
            <li style="visibility: hidden">
              <p class="number red"><span class="title red">涨停限制</span>0</p>
            </li>
            <li>
              <p :class="detail.hcrate > 0 ? 'number green' : 'number red'">
                <span class="title">涨幅</span>
                {{ Number(detail.hcrate).toFixed(2) }}%
              </p>
            </li>
            <li style="visibility: hidden">
              <p class="green"><span class="title green">跌停限制</span>0</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="box-tab">
      <div class="tab-title"><span class="circle"></span>选择手数</div>
      <div class="tab-con">
        <ul class="radio-group clearfix">
          <li
            v-for="item in numberList"
            :key="item.key"
            @click="selectNumberFun(item.value)"
          >
            <div :class="selectNumber == item.value ? 'on' : ''">
              {{ item.label }}
            </div>
          </li>
          <li class="auto" v-show="!selectNumber">
            <input
              @keyup="changeAutoNumber"
              v-model="autoNumber"
              type="text"
            />手
          </li>
        </ul>
        <p class="clearfix">
          <span class="pull-left"
          >最小购买股数{{ Number(settingInfo.buyMinNum) / 100 }}手</span
          >
          <span class="protem pull-right"
          >最大可购买数量{{ Number(settingInfo.buyMaxNum) / 100 }}手</span
          >
        </p>
      </div>
    </div>
    <div class="box-tab" style="padding-top: 0.5rem;border-bottom: none">
      <p style="margin-bottom: 0.5rem">
        实际购买价：{{Number(detail.nowPrice).toFixed(2)}}*(1-{{detail.discount}})=${{
          Number(Number(detail.nowPrice).toFixed(2) * (1 - detail.discount)).toFixed(2)
        }}
      </p>
      <p>
        需支付：{{ Number(detail.nowPrice).toFixed(2) }}*(1-{{ detail.discount }})*{{
          (selectNumber || autoNumber) * 100
        }}/{{ rate }}=${{ total }}
      </p>
    </div>
    <div class="box-tab" style="padding-top: 0.5rem;border-bottom: none">
      <p style="margin-bottom: 0.5rem">
        折扣率：等待接口返回%
      </p>
      <p>
        封锁期：等待接口返回天
      </p>
    </div>
    <div class="footer-btn">
      <div class="total">
        <p class="pay">
          需要支付：<span class="protem">{{ total ? total : 0 }}</span>
        </p>
        <p class="account">
          (账户余额：${{ $store.state.userInfo.enableAmt }})
        </p>
      </div>
      <mt-button
        :disabled="buying"
        class="btn-red"
        size="small"
        type="danger"
        @click="toInquiry"
      >下单
      </mt-button
      >
    </div>

    <mt-popup
      v-model="focePromptPopup"
      popup-transition="popup-fade"
      class="mint-popup-white"
    >
      <div class="clearfix">
        <a @click="focePromptPopup = false" class="pull-right"
        ><i class="iconfont icon-weitongguo"></i
        ></a>
      </div>
      <p class="font-title">总手续费计算规则：</p>
      <p class="font-bold">
        总手续费 = 买入手续费（{{ settingInfo.buyFee * 100 }}%）+ 印花税（{{
          settingInfo.dutyFee * 100
        }}%）+ 点差费（{{ settingSpreadRate.spreadRate * 100 }}%）
      </p>
    </mt-popup>
    <foot></foot>
  </div>
</template>

<script>
import foot from '../../components/foot/foot'
import {Toast} from 'mint-ui'
import {isNull} from '@/utils/utils'
import * as api from '@/axios/api'
import {getRate} from '../../axios/api'

export default {
  components: {
    foot,
  },
  props: {},
  data () {
    return {
      detail: {
        name: '',
        code: '',
        gid: '',
        stockType: '',
      }, //
      cycle: [
        // 杠杆倍数
        {label: '10', value: '10'},
        {label: '20', value: '20'},
        {label: '30', value: '30'},
      ],
      selectCycle: '1',
      numberList: [
        {label: '50手', value: '50'},
        {label: '100手', value: '100'},
        {label: '150手', value: '150'},
        {label: '200手', value: '200'},
        {label: '250手', value: '250'},
        {label: '300手', value: '300'},
        {label: '自定义', value: ''},
      ],
      siteLeverList: [],
      selectNumber: '',
      autoNumber: '',
      type: [
        {label: '买涨', value: '0'},
        {label: '买跌', value: '1'},
      ],
      selectType: '0',
      // number:0,// 股
      // price:0,// 股价格
      // total:0, // 总价
      agree: true,
      settingInfo: {
        buyMaxNum: 1000, // 最大买入股数
        buyMinNum: 100, // 最小买入股数
      }, // 设置规则信息
      dialogShow: false,
      timer: null,
      buying: false,
      focePromptPopup: false, // 总手续费提示框
      settingSpreadRate: {spreadRate: 0},
      rate: 1, //汇率
    }
  },
  watch: {},
  computed: {
    poundage () {
      // 手续费= 买入手续费+印花税+点差费
      if (this.autoNumber) {
        let payfee = (this.detail.nowPrice * this.autoNumber * 100).toFixed(2) // / this.selectCycle
        return (
          payfee * this.settingInfo.buyFee +
          payfee * this.settingInfo.dutyFee +
          payfee * this.settingSpreadRate.spreadRate
        ).toFixed(2)
      } else if (this.selectNumber) {
        let payfee = (this.detail.nowPrice * this.selectNumber * 100).toFixed(
          2
        )
        return (
          payfee * this.settingInfo.buyFee +
          payfee * this.settingInfo.dutyFee +
          payfee * this.settingSpreadRate.spreadRate
        ).toFixed(2)
      } else {
        return 0
      }
    },
    total () {
      if (
        this.settingSpreadRate == undefined ||
        this.settingSpreadRate.spreadRate == undefined
      ) {
        this.settingSpreadRate.spreadRate = 0
      }
      if (this.autoNumber) {
        // let payfee =
        //   (this.detail.nowPrice * this.autoNumber * 100) / this.selectCycle;
        const autalPrive = (Number(this.detail.nowPrice).toFixed(2) * (1 - this.detail.discount)).toFixed(2)
        return (
          (
            (autalPrive *
              this.autoNumber * 100) /
            this.rate
          ).toFixed(2)
        )
      } else if (this.selectNumber) {
        // let payfee =
        //   (this.detail.nowPrice * this.selectNumber * 100) / this.selectCycle;
        const autalPrive = (Number(this.detail.nowPrice).toFixed(2) * (1 - this.detail.discount)).toFixed(2)

        return (
          // payfee +
          // payfee * this.settingInfo.buyFee +
          // payfee * this.settingInfo.dutyFee +
          // payfee * this.settingSpreadRate.spreadRate

          (
            (autalPrive *
              this.selectNumber * 100) /
            this.rate
          ).toFixed(2)
        )
      } else {
        return 0
      }
      // 需支付总价 = 现价 * 股（1手 = 100股）/ 杠杆倍数
    },
    price () {
      if (this.autoNumber) {
        return (this.detail.nowPrice * this.autoNumber * 100).toFixed(2)
      } else if (this.selectNumber) {
        return (this.detail.nowPrice * this.selectNumber * 100).toFixed(2)
      } else {
        return 0
      }
      // 市值价 = 现价 * 股（1手 = 100股）
    },
  },
  created () {
    this.timer = setInterval(this.getDetail, 5000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    console.log('areaId:', this.$route.params.areaId)
    //   this.getDetail()
    this.detail.gid = this.$route.params.gid
    this.detail.name = this.$route.params.name
    this.detail.code = this.$route.params.code
    this.detail.stockType = this.$route.params.stockType
    this.detail.hcrate = this.$route.params.hcrate
    this.detail.nowPrice = this.$route.params.nowPrice
    this.detail.discount = this.$route.params.discount
    this.selectNumber = 0
    //   this.selectCycle = 10
    this.getSettingInfo()
    if (!this.$store.state.userInfo.enableAmt) {
      this.getUserInfo()
    }
    this.getRate()

  },
  methods: {
    changeAutoNumber () {
      // 自定义手数
      this.selectNumber = ''
    },
    async getSettingInfo () {
      // 网站设置信息
      let data = await api.getSetting()
      if (data.status === 0) {
        // 成功
        this.settingInfo = data.data
        // 杠杆倍数
        // this.selectCycle = data.data.siteLever;
        if (
          this.$store.state.userInfo !== undefined &&
          this.$store.state.userInfo !== null &&
          this.$store.state.userInfo.phone !== '' &&
          this.$store.state.userInfo.siteLever !== null
        ) {
          // this.selectCycle = this.$store.state.userInfo.siteLever.split("/")[0];
          this.siteLeverList = []
          for (
            let i = 0;
            i < this.$store.state.userInfo.siteLever.split("/").length;
            i++
          ) {
            let val = this.$store.state.userInfo.siteLever.split('/')[i]
            let item = {label: val + '倍', value: val}
            this.siteLeverList.push(item)
          }
        } else {
          // this.selectCycle = data.data.siteLever.split("/")[0];
          this.siteLeverList = []
          for (let i = 0; i < data.data.siteLever.split("/").length; i++) {
            let val = data.data.siteLever.split('/')[i]
            let item = {label: val + '倍', value: val}
            this.siteLeverList.push(item)
          }
        }
      } else {
        Toast(data.msg)
      }
    },
    async findSpreadRateOne () {
      // 查询点差费率
      let opts = {
        applies: this.detail.hcrate, // 涨跌幅
        turnover: this.total, // 成交额
        unitprice: this.detail.nowPrice, // 股票单价
        code: this.$route.params.code,
      }
      let data = await api.findSpreadRateOne(opts)
      if (data.status === 0) {
        // 成功
        if (data.data != undefined) {
          this.settingSpreadRate = data.data
        }
        console.log(this.settingSpreadRate)
      } else {
        this.$message.error(data.msg)
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
        code: this.$route.params.code,
      }
      let data = await api.getSingleStock(opts)
      if (data.status === 0) {
        this.detail = data.data
        this.findSpreadRateOne()
      } else {
        Toast(data.msg)
      }
    },
    async getRate () {
      let opts = {
        id: this.$route.params.areaId,
      }
      let data = await api.getRate(opts)
      if (data.status === 0) {
        this.rate = data.data.rate
      } else {
        Toast(data.msg)
      }
    },
    selectNumberFun (value) {
      this.selectNumber = value
      if (+value !== 0) {
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
      if (+day === 6 || +day === 7) {
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
        Toast('您还未实名认证,请先实名认证了再下单')
        this.$router.push('/authentication')
        return
      }
      if (!this.agree) {
        Toast('需同意合作协议才能交易!')
      } else if (isNull(this.selectNumber) && isNull(this.autoNumber)) {
        Toast('请选择购买手数')
      } else {
        this.buying = true
        let opts = {
          stockId: this.$route.params.gid,
          buyNum: this.selectNumber
            ? this.selectNumber * 100
            : this.autoNumber * 100,
          buyType: this.selectType,
          lever: this.selectCycle,
        }
        let data = await api.buy(opts)
        this.buying = false
        if (+data.status === 0) {
          Toast(data.data)
          this.getUserInfo()
          this.$router.push('/orderlist?index=' + this.$route.params.areaId)
        } else {
          Toast(data.msg)
        }
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
      if (+data.status === 0) {
        // Toast(data.msg)
        this.$store.state.userInfo = data.data
      } else {
        Toast(data.msg)
      }
    },
  },
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
  height: 0.89rem;
  line-height: 0.89rem;
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
    font-size: 0.32rem;
    padding: 0.3rem;

    span.index-name_code {
      font-size: 0.22rem;
      color: #fff;
      margin-left: 0.2rem;
      background-image: url(../../assets/ico/zhishu.png);
      background-size: 100% 100%;
      padding: 0.02rem 0.05rem 0.02rem 0.15rem;
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
    font-size: 0.24rem;

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
      margin-bottom: 0.15rem;
      margin-top: 0.15rem;
      text-align: right;

      div {
        background-color: #2d2e3b;
      }

      &:nth-child(odd) {
        width: 40%;
        text-align: left;
      }
    }
  }

  .detail-list {
    padding-left: 0.3rem;
  }

  .hangqin-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 0.1rem 0 0.3rem;
    position: relative;

    .price {
      padding-bottom: 0.35rem;
    }

    &:after {
      display: block;
      position: absolute;
      content: "";
      width: 2px;
      height: 0.77rem;
      background-color: #2e2f34;
      top: 0.2rem;
      right: 0;
    }
  }

  .hangqin-right {
    padding: 0 0.3rem 0 0.1rem;
  }
}
</style>
