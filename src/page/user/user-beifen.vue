<template>
  <div class="page wrapper">
    <div class="account-info">
      <div class="account-info_avatar">
        <img src="../../assets/ico/wogerenziliao.png"/>
      </div>
      <div class="account-info_detail">
        <div class="account-phone">
          {{ $t('my.account') }}{{ $store.state.userInfo.phone }}
        </div>
        <div class="account-name">
          {{ $t('my.nick') }}{{ $store.state.userInfo.nickName }}
        </div>
      </div>
      <div class="account-info_ctl" @click="hideNumber">
        {{ $t('my.asset') }}
        <i v-show="$store.state.hide" class="iconfont icon-yanjing"></i>
        <i v-show="!$store.state.hide" class="iconfont icon-yanjing1"></i>
      </div>
    </div>
    <div class="account-container">
      <div class="account-header">
        <h2 class="title" style="font-size: 20px;">
          {{ $t('my.total') }}
        </h2>
        <div>
          <p
            v-if="
              this.$store.state.settingForm.indexDisplay &&
              !this.$store.state.settingForm.futuresDisplay
            "
            class="account"
          >
            ¥{{
              $store.state.hide
                ? '****'
                : Number(
                  $store.state.userInfo.userAmt +
                  $store.state.userInfo.userIndexAmt
                ).toFixed(2)
            }}
          </p>
          <p
            v-else-if="
              !this.$store.state.settingForm.indexDisplay &&
              this.$store.state.settingForm.futuresDisplay
            "
            class="account"
          >
            ¥{{
              $store.state.hide
                ? '****'
                : Number(
                  $store.state.userInfo.userAmt +
                  $store.state.userInfo.userFuturesAmt
                ).toFixed(2)
            }}
          </p>
          <p
            v-else-if="
              !this.$store.state.settingForm.indexDisplay &&
              !this.$store.state.settingForm.futuresDisplay
            "
            class="account"
          >
            ¥{{
              $store.state.hide
                ? '****'
                : Number($store.state.userInfo.userAmt).toFixed(2)
            }}
          </p>
          <p
            v-else-if="
              this.$store.state.settingForm.indexDisplay &&
              this.$store.state.settingForm.futuresDisplay
            "
            class="account"
          >
            ¥{{
              $store.state.hide
                ? '****'
                : Number(
                  $store.state.userInfo.userAmt +
                  $store.state.userInfo.userIndexAmt +
                  $store.state.userInfo.userFuturesAmt
                ).toFixed(2)
            }}
          </p>
        </div>
        <div class="iconfont">
          <mt-button
            class="btn-red pull-right"
            size="small"
            type="danger"
            @click="toTransferMoney"
          >{{ $t('my.transfer') }}
          </mt-button>
          <mt-button
            class="btn-red pull-right"
            size="small"
            type="danger"
            @click="toWithdraw"
          >{{ $t('my.withdrawal') }}
          </mt-button>
          <mt-button
            class="btn-red pull-right"
            size="small"
            type="danger"
            @click="toDeposit"
          >{{ $t('my.deposit') }}
          </mt-button>
        </div>
        <mt-progress
          :value="
            ($store.state.userInfo.userAmt /
              ($store.state.userInfo.userAmt +
                $store.state.userInfo.userIndexAmt)) *
            100
          "
          :bar-height="5"
        ></mt-progress>
      </div>
      <div class="account-center">
        <span>{{ $t('my.cash') }}（${{ Number($store.state.userInfo.userAmt).toFixed(2) }}）</span>
      </div>
      <div v-for="item in account" :key="item.key">
        <div class="account-box" v-if="item.isDisplay">
          <div v-show="item.isShow" class="content">
            <ul class="clearfix">
              <li>
                <i class="iconfont icon-zijin1"></i>
                <div class="name">{{ $t('my.market') }}</div>
                <p v-if="item.name == '指数'" class="number yellow">
                  {{
                    $store.state.hide
                      ? '****'
                      : Number($store.state.userInfo.userIndexAmt).toFixed(2)
                  }}
                </p>
                <p v-if="item.name == '沪深'" class="number yellow">
                  {{
                    $store.state.hide ? '****' : Number($store.state.userInfo.userAmt).toFixed(2)
                  }}
                </p>
                <p v-if="item.name == '期货'" class="number yellow">
                  {{
                    $store.state.hide
                      ? '****'
                      : Number($store.state.userInfo.userFuturesAmt).toFixed(2)
                  }}
                </p>
              </li>
              <li>
                <i class="iconfont icon-keyongzijin"></i>
                <div class="name">{{ $t('my.available') }}</div>
                <p v-if="item.name == '指数'" class="number yellow">
                  {{
                    $store.state.hide
                      ? '****'
                      : Number($store.state.userInfo.enableIndexAmt).toFixed(2)
                  }}
                </p>
                <p v-if="item.name == '沪深'" class="number yellow">
                  {{
                    $store.state.hide ? '****' : Number($store.state.userInfo.enableAmt).toFixed(2)
                  }}
                </p>
                <p v-if="item.name == '期货'" class="number yellow">
                  {{
                    $store.state.hide
                      ? '****'
                      : Number($store.state.userInfo.enableFuturesAmt).toFixed(2)
                  }}
                </p>
              </li>
              <li>
                <i class="iconfont icon-yingkuixuanzhong"></i>
                <div class="name">{{ $t('my.pl1') }}</div>
                <p
                  v-if="item.name == '指数'"
                  :class="
                    $store.state.userInfo.allIndexProfitAndLose > 0
                      ? 'number red'
                      : $store.state.userInfo.allIndexProfitAndLose < 0
                      ? 'number green'
                      : 'number'
                  "
                >
                  {{
                    $store.state.hide
                      ? '****'
                      : Number($store.state.userInfo.allIndexProfitAndLose).toFixed(2)
                  }}
                </p>
                <p
                  v-if="item.name == '沪深'"
                  :class="
                    $store.state.userInfo.allProfitAndLose > 0
                      ? 'number red'
                      : $store.state.userInfo.allProfitAndLose < 0
                      ? 'number green'
                      : 'number'
                  "
                >
                  {{
                    $store.state.hide
                      ? '****'
                      : Number($store.state.userInfo.allProfitAndLose).toFixed(2)
                  }}
                </p>
                <p
                  v-if="item.name == '期货'"
                  :class="
                    $store.state.userInfo.allFuturesProfitAndLose > 0
                      ? 'number red'
                      : $store.state.userInfo.allFuturesProfitAndLose < 0
                      ? 'number green'
                      : 'number'
                  "
                >
                  {{
                    $store.state.hide
                      ? '****'
                      : Number(
                        $store.state.userInfo.allFuturesProfitAndLose
                      ).toFixed(2)
                  }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="account-container">
      <div class="account-center">
        <span>{{ $t('my.fund') }}</span>
      </div>
      <div class="account-box">
        <div class="content">
          <ul class="clearfix">
            <li>
              <i class="iconfont icon-zijin1"></i>
              <div class="name">{{ $t('my.used') }}</div>
              <p class="number red"> ${{ Number(fundInfo.buyMoney).toFixed(2) }}</p>
            </li>
            <li>
              <i class="iconfont icon-keyongzijin"></i>
              <div class="name">{{ $t('my.available') }}</div>
              <p class="number yellow">${{ Number(fundInfo.balance).toFixed(2) }}</p>
            </li>
            <li>
              <i class="iconfont icon-yingkuixuanzhong"></i>
              <div class="name">{{ $t('my.pl2') }}</div>
              <p class="number green">${{ Number(fundInfo.amount).toFixed(2) }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="other">
      <ul class="after">
        <li @click="toAuthentication">
          <span>
            <img src="../../assets/ico/shimin.png" style="width: 0.28rem; height: 0.24rem; margin-right: 0.15rem"/>
            {{ $t('my.auth1') }}
            <span class="renzhen done" v-if="$store.state.userInfo.isActive == 0">
              <i class="iconfont el-icon-circle-close"></i>
              {{ $t('my.auth2') }}
            </span>
            <span class="renzhen done" v-else-if="$store.state.userInfo.isActive == 1">
              <i class="iconfont el-icon-circle-check"></i>
              {{ $t('my.auth3') }}
            </span>
             <span class="renzhen done" v-else-if="$store.state.userInfo.isActive == 2">
              <i class="iconfont el-icon-circle-check"></i>
             {{ $t('my.auth4') }}
            </span>
             <span class="renzhen done" v-else-if="$store.state.userInfo.isActive == 3">
              <i class="iconfont el-icon-circle-close"></i>
             {{ $t('my.auth5') }}
            </span>
            <icon name="right66" class="right" slot="icon"></icon>
          </span>
        </li>
        <li @click="goCard">
          <span>
            <img
              src="../../assets/ico/yinhangka.png"
              style="width: 0.28rem; height: 0.24rem; margin-right: 0.15rem"
            />
            {{ $t('my.card') }}
            <icon name="right66" class="right" slot="icon"></icon>
          </span>
        </li>
        <li @click="goChangePwd">
          <span>
            <img
              src="../../assets/ico/gaimima.png"
              style="width: 0.24rem; height: 0.24rem; margin-right: 0.15rem"
            />
            {{ $t('my.pwd') }}
            <icon name="right66" class="right" slot="icon"></icon>
          </span>
        </li>
      </ul>
      <ul class="after">
        <li @click="goOrderList">
          <span>
            <img
              src="../../assets/ico/chongzhi.png"
              style="width: 0.27rem; height: 0.27rem; margin-right: 0.15rem"
            />
            {{ $t('my.position') }}
            <icon name="right66" class="right" slot="icon"></icon>
          </span>
        </li>
        <li @click="goMoneyList">
          <span>
            <img
              src="../../assets/ico/zijin.png"
              style="width: 0.27rem; height: 0.24rem; margin-right: 0.15rem"
            />
            {{ $t('my.report') }}
            <icon name="right66" class="right" slot="icon"></icon>
          </span>
        </li>
      </ul>
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
        <p class="font-title">什么是强制平仓线？</p>
        <!--  账户可用资金 +  -->
        <p v-if="$store.state.settingForm.stockDisplay" class="font-bold">
          (沪深)强制平仓线 = (账户可用资金+冻结保证金) *
          {{ settingInfo.forceStopPercent ? settingInfo.forceStopPercent : 0 }}
        </p>
        <p v-if="$store.state.settingForm.indexDisplay" class="font-bold">
          (指数)强制平仓线 = (账户可用资金+冻结保证金) *
          {{
            indexSettingInfo.forceSellPercent
              ? indexSettingInfo.forceSellPercent
              : 0
          }}
        </p>
        <p v-if="$store.state.settingForm.futuresDisplay" class="font-bold">
          (期货)强制平仓线 = (账户可用资金+冻结保证金) *
          {{
            futuresSettingInfo.forceSellPercent
              ? futuresSettingInfo.forceSellPercent
              : 0
          }}
        </p>
        <p v-if="$store.state.settingForm.stockDisplay">
          当您的沪深账户持仓总盈亏为<span class="green number"
        >-{{
            Number(
              ($store.state.userInfo.enableAmt +
                $store.state.userInfo.allFreezAmt) *
              settingInfo.forceStopPercent
            ).toFixed(2)
          }}</span
        >时系统会强制平仓
        </p>
        <p v-if="$store.state.settingForm.indexDisplay">
          当您的指数账户持仓总盈亏为<span class="green number"
        >-{{
            Number(
              ($store.state.userInfo.allIndexFreezAmt +
                $store.state.userInfo.enableIndexAmt) *
              indexSettingInfo.forceSellPercent
            ).toFixed(2)
          }}</span
        >时系统会强制平仓
        </p>
        <p v-if="$store.state.settingForm.futuresDisplay">
          当您的期货账户持仓总盈亏为<span class="green number"
        >-{{
            Number(
              ($store.state.userInfo.allFuturesFreezAmt +
                $store.state.userInfo.enableFuturesAmt) *
              futuresSettingInfo.forceSellPercent
            ).toFixed(2)
          }}</span
        >时系统会强制平仓
        </p>
      </mt-popup>
      <div class="btnbox">
        <span class="text-center btnok loginout" @click="toRegister">{{ $t('my.logout') }}</span>
      </div>
    </div>
    <el-dialog
      top="30vh"
      width="80%"
      :title="dialogObj.title"
      class="submitDialog"
      :visible.sync="dialogObj.flag"
      :close-on-click-modal="false"
    >
      <p>
        {{ dialogObj.content }}
      </p>
      <span slot="footer">
        <el-button type="danger" size="mini" @click="dialogObj.cancel">{{ $t('recharge.cancel') }}</el-button>
        <el-button type="primary" size="mini" @click="dialogObj.success">{{ $t('recharge.confirm') }}</el-button>
      </span>
    </el-dialog>
    <foot></foot>
  </div>
</template>
<script type="text/ecmascript-6">
import {Toast} from 'mint-ui'
import foot from '../../components/foot/foot'
import * as api from '@/axios/api'

export default {
  components: {
    foot
  },
  data () {
    return {
      fundInfo: {
        amount: 0,
        balance: 0,
        buyMoney: 0
      },
      user: {
        img: ''
      },
      defaultUser: {
        img: require('../../assets/img/default-head.png')
      },
      changeHideStatus: false,
      userAmt: '',
      settingInfo: {}, // 设置信息
      indexSettingInfo: {}, // 设置信息 指数
      futuresSettingInfo: {}, // 设置信息 期货
      focePromptPopup: false, // 强制平仓提示框
      buttonBottom: 0,
      account: [
        {name: '沪深', link: 'stock', isShow: true, isDisplay: false}
      ],
      showChangeBtn: false, // 是否显示资金互转按钮
      styleName: 'black',
      dialogObj: {
        flag: false,
        title: '',
        content: '',
        success: Function,
        cancel: Function
      }
    }
  },
  created () {
    this.getUserInfo()
    this.styleName = window.localStorage.getItem('styleName') ? window.localStorage.getItem('styleName') : 'red'
  },
  mounted () {
    this.getBalance()
    this.getSettingInfo()
    this.getIndexSettingInfo()
    this.getFuturesSetting()
    this.getCardDetail()
    this.changeHideStatus = this.$store.state.hide
    if (this.$store.state.settingForm.indexDisplay || this.$store.state.settingForm.futuresDisplay) {
      this.showChangeBtn = true
    }
  },
  methods: {
    async getBalance () {
      let data = await api.getBalanceFunds({})
      if (data.status === 0) {
        this.fundInfo = data.data
      } else {
        Toast(data.msg)
      }
    },
    async getProductSetting () {
      let data = await api.getProductSetting()
      if (data.status === 0) {
        this.$store.state.settingForm = data.data
        this.account[0].isDisplay = data.data.stockDisplay
        this.account[1].isDisplay = data.data.indexDisplay
        this.account[2].isDisplay = data.data.futuresDisplay
      } else {
        this.$message.error(data.msg)
      }
    },
    hideNumber () {
      this.changeHideStatus = this.$store.state.hide
      let i = false
      let j = true
      this.$store.state.hide = this.$store.state.hide ? i : j
    },
    goOrderList: function (val) {
      this.$router.push('/orderlist?index=1')
    },
    goCard: function () {
      if (this.$store.state.userInfo.isActive !== 2) {
        this.dialogObj.flag = true
        this.dialogObj.title = this.$t('my.card')
        this.dialogObj.content = this.$t('bank.unable')
        this.dialogObj.cancel = this.dialogCancel
        this.dialogObj.success = () => {
          this.dialogObj.flag = false
          this.$router.push('/authentication')
        }
      } else {
        this.$router.push('/card')
      }
    },
    goChangePwd: function () {
      this.$router.push('/setting')
    },
    toAuthentication: function () {
      if (this.$store.state.userInfo.isActive === 2) {
        this.dialogObj.flag = true
        this.dialogObj.title = this.$t('my.auth1')
        this.dialogObj.content = this.$t('auth.auth4')
        this.dialogObj.cancel = this.dialogCancel
        this.dialogObj.success = this.dialogCancel
      } else {
        this.$router.push('/authentication')
      }
    },
    async toRegister () {
      // 注销登陆
      // this.clearCookie()
      let data = await api.logout()
      if (data.status === 0) {
        await this.$router.push('/login')
      } else {
        Toast(data.msg)
      }
    },
    toDeposit () { // 充值
      if (this.$store.state.userInfo.isActive !== 2) {
        this.dialogObj.flag = true
        this.dialogObj.title = this.$t('recharge.prompt')
        this.dialogObj.content = this.$t('recharge.unable')
        this.dialogObj.cancel = this.dialogCancel
        this.dialogObj.success = () => {
          this.dialogObj.flag = false
          this.$router.push('/authentication')
        }
      } else {
        this.$router.push('/deposit')
      }
    },
    dialogCancel () {
      this.dialogObj.flag = false
      this.dialogObj.title = ''
      this.dialogObj.content = ''
      this.dialogObj.success = () => {
      }
    },
    toWithdraw () { // 提现
      if (this.$store.state.userInfo.isActive !== 2) {
        this.dialogObj.flag = true
        this.dialogObj.title = this.$t('withdraw.prompt')
        this.dialogObj.content = this.$t('withdraw.unable')
        this.dialogObj.cancel = this.dialogCancel
        this.dialogObj.success = () => {
          this.dialogObj.flag = false
          this.$router.push('/authentication')
        }
      } else {
        this.$router.push('/withdraw')
      }
    },
    toTransferMoney () { // 转账
      if (this.$store.state.userInfo.isActive !== 2) {
        this.dialogObj.flag = true
        this.dialogObj.title = this.$t('transfer.prompt2')
        this.dialogObj.content = this.$t('transfer.unable2')
        this.dialogObj.cancel = this.dialogCancel
        this.dialogObj.success = () => {
          this.dialogObj.flag = false
          this.$router.push('/authentication')
        }
      } else {
        this.$router.push('/transferMoney')
      }
    },
    goMoneyList () {
      this.$router.push('/moneyList')
    },
    async getCardDetail () {
      // 获取银行卡信息
      let data = await api.getBankCard()
      if (data.status === 0) {
        this.$store.state.bankInfo = data.data
      } else {
      }
    },
    async getSettingInfo () {
      let data = await api.getSetting()
      if (data.status === 0) {
        // 成功
        this.settingInfo = data.data
      } else {
        Toast(data.msg)
      }
    },
    async getIndexSettingInfo () {
      // 网站设置信息 指数
      let data = await api.getIndexSetting()
      if (data.status === 0) {
        // 成功
        this.indexSettingInfo = data.data
      } else {
        Toast(data.msg)
      }
    },
    async getFuturesSetting () {
      // 网站设置信息 期货
      let data = await api.getFuturesSetting()
      if (data.status === 0) {
        // 成功
        this.futuresSettingInfo = data.data
      } else {
        Toast(data.msg)
      }
    },
    async getUserInfo () {
      // 获取用户信息
      let data = await api.getUserInfo()
      console.log('get user info data:', data)
      if (data.status === 0) {
        this.$store.state.userInfo = data.data
        console.log('get user info:', this.$store.state.userInfo)
        await this.getProductSetting()
      } else {
        Toast(data.msg)
      }
      this.$store.state.user = this.user
    }
  }
}
</script>

<style lang="less" scoped>
// @bgColor: #fff;
@bgColor: #16171d;
@fontColor: #fff;
@borderColor: #676b6f;
body {
  background: #000;
}

.page .head {
  width: 100%;
  // height: 0;
  // padding-top: 44%;
  height: 2.8rem;
  background-image: url("../../assets/img/header.png");
  background-size: 100% 100%;
}

.wrapper {
  background-color: @bgColor;
}

.after {
  .iconfont {
    vertical-align: middle;
    margin-right: 0.15rem;
  }
}

.setting {
  margin-right: 0.2rem;
}

.status {
  font-size: 0.24rem;
  // margin-left: 0.2rem;
  .iconfont {
    margin-left: 0.2rem;
    font-size: 0.24rem;
  }
}

.user {
  .user-top {
    padding: 0 0.4rem;
    // width: 96%;
    // height: 1.96rem;
    margin: 0 auto;
    background: #2e3237;
    // border-radius: 0.11rem;
    box-shadow: 0.014rem 0.014rem 0.014rem rgba(103, 107, 111, 0.38);
    // margin-top: -0.945rem;
    position: relative;
    margin-bottom: 0.16rem;
    padding-bottom: 0.2rem;
    margin-top: 0.1rem;

    .user-header {
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 100%;
      background: #000;
      position: absolute;
      left: 50%;
      top: -0.68rem;
      margin-left: -0.68rem;

      .green {
        color: green;
      }
    }

    .user-img {
      width: 1.3rem;
      height: 1.3rem;
      background-color: @bgColor;
      border-radius: 100%;
      margin: 0 auto;
      margin-top: 0.014rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .user-box {
      // padding-top: 1.08rem;
      font-size: 0.33rem;
      color: @fontColor;
      font-weight: 700;
      height: 0.68rem;
      line-height: 0.695rem;

      .btn-red {
        // width: 1.418rem;
        width: 2.418rem;
        height: 0.68rem;
        font-size: 0.29rem;
        line-height: 0.68rem;
        padding: 0;
        border-radius: 0.028rem;
        background: #b60c0d;
      }
    }
  }
}

.other {
  margin: 0.12rem 0.28rem;

  ul {
    position: relative;
    background-color: #1f2636;
    border-radius: 4px;
    overflow: hidden;
    padding: 0 0.2rem;

    li {
      position: relative;
      height: 0.92rem;
      line-height: 0.92rem;
      // padding: 0 0.4rem;
      font-size: 0.26rem;
      background-color: #1f2636;
      position: relative;
      border-bottom: 1px solid #3f444a;
    }

    li:last-child {
      border-bottom: none;
    }
  }

  .after {
    margin-bottom: 0.125rem;
  }
}

.renzhen {
  position: relative;
  padding: 0 0.1rem;
  font-size: 0.18rem;
  height: 0.35rem;
  line-height: 0.35rem;
  display: inline-block;
  vertical-align: middle;
  padding-left: 0.3rem;

  .iconfont {
    font-size: 0.18rem;
    vertical-align: middle;
    position: absolute;
    left: 0.05rem;
    top: 0.05rem;
  }

  &.ing {
    background-color: #e6003e;
  }

  &.done {
    background-color: #04823e;
  }
}

.other ul li svg {
  width: 16px;
  height: 15px;
  line-height: 25px;
  margin-top: 0.28rem;
  color: #ccc;
}

.other ul li svg:first {
  float: left;
  margin-right: 0.39rem;
}

.my-Assets {
  .img-box {
    width: 1.3rem;
    height: 1.3rem;
  }

  .assets-box {
    line-height: 0.5rem;
    margin-top: 0.2rem;

    .iconfont {
      margin-right: 0.2rem;
    }
  }

  font-size: 0.25rem;
  padding: 0.2rem 0 0.3rem;
}

.user-header {
  padding: 0rem 0.3rem 0;
  background: #2e3237;
  margin-bottom: 0.15rem;

  .box:nth-child(1) {
    margin-right: 6%;
  }

  .box {
    padding: 0.26rem 0.25rem 0.3rem;
    padding: 0.26rem 0.25rem 0.2rem;
    background-color: #c6c8d4;
    width: 47%;
    float: left;
    color: #2f2f2f;
    border-radius: 0.2rem 0.2rem 0.1rem 0.1rem;

    .name {
      font-size: 0.26rem;
      font-weight: bold;
      margin-bottom: 0.2rem;
    }

    .account {
      font-size: 0.3rem;
      font-weight: bold;
    }

    .name2 {
      font-size: 0.23rem;
      margin-top: 0.2rem;

      span {
        padding-left: 0.1rem;
      }
    }
  }
}

.loginout {
  color: #999;
  font-size: 0.3rem;
  background: none;
}

.btnbox .btnok {
  background: none;
  font-size: 0.28rem;
  height: 0.6rem;
  line-height: 0.6rem;
  color: #606060;
}

.btnbox {
  width: 100%;
  padding: 0 0.3rem;
}

.mint-popup-1 {
  color: #333;
  width: 200px;
  border-radius: 8px;
  padding: 10px;
  transform: translate(-50%, 0);

  h1 {
    font-size: 20px;
    color: #26a2ff;
  }

  p {
    margin-bottom: 10px;
  }

  top: 3.2rem;
}

.mint-popup-1::before {
  triangle: 10px top #fff;
  content: "";
  position: absolute;
  top: -20px;
  right: 50px;
}

.mint-popup-white {
  padding: 0.3rem 0.28rem;

  .font-title {
    font-size: 0.26rem;
    margin-bottom: 0.12rem;
  }

  .font-bold {
    font-weight: bold;
  }

  .number {
    margin: 0 0.1rem;
    font-weight: bold;
    font-size: 0.26rem;
  }

  p {
    line-height: 0.4rem;
  }
}

// 总资产
.account-header {
  padding: 0.2rem 0.2rem 0;
  position: relative;
  background-color: #1f2636;

  .iconfont {
    position: absolute;
    right: 0.2rem;
    // top: 50%;
    top: 1.1rem;
    font-size: 0.8rem;
    color: #ff5722;
    margin-top: -0.4rem;

    .btn-red {
      margin-left: 0.2rem;
      padding: 0.08rem 0.2rem;
      background: #ff5722;
    }
  }

  .title {
    font-size: 0.28rem;
    margin-bottom: 0.26rem;
  }

  .sub-title {
    color: #7e8c8d;
    font-size: 0.2rem;

    i {
      font-style: normal;
    }
  }

  .account {
    color: #b60c0d;
    font-size: 0.4rem;
    font-weight: 600;
    font-family: lightnumber;
  }
}

.account-box {
  // margin-bottom: 0.12rem;
  padding: 0 0.2rem;
  // padding: 0 0.35rem;
  background-color: #1f2636;

  .header {
    font-size: 0.22rem;
    line-height: 0.7rem;
    height: 0.7rem;
    display: flex;
    justify-content: space-between;

    .header-left {
      display: flex;
      align-items: center;
    }

    img.iconfont {
      color: #f5ca07;
      width: 0.3rem;
      height: 0.3rem;
      display: inline-block;
      margin-right: 0.2rem;

      &.jian {
        background-image: url(../../assets/ico/jian.png);
      }
    }

    .iconfont {
      font-size: 0.24rem;
      vertical-align: middle;
      margin: 0 0.05rem;
    }
  }

  .content {
    padding: 0 0.2rem 0.18rem;

    li {
      width: 50%;
      float: left;
      padding: 0.2rem 0.2rem 0.04rem 0.56rem;
      line-height: 0.36rem;
      position: relative;

      &:nth-child(2) {
        .iconfont {
          color: #2f97fc;
        }
      }

      &:nth-child(3) {
        .iconfont {
          color: #17b780;
        }
      }

      &:nth-child(3) {
        .iconfont {
          color: #ff7602;
        }
      }

      .iconfont {
        position: absolute;
        top: 0.38rem;
        left: 0;
        font-size: 0.42rem;
        color: #fd4256;
      }

      .name {
        color: #888;
        font-size: 0.22rem;
      }

      .number {
        font-size: 0.27rem;
      }
    }
  }
}

.mt-progress {
  height: 5px;
  line-height: 5px;
  margin-top: 0.3rem;
  border-radius: 0.2rem;
  // padding: 0 0.2rem;
  /deep/ .mt-progress-runway {
    border-radius: 0.2rem;
    background-color: #ff7602;
  }

  /deep/ .mt-progress-progress {
    border-radius: 0.2rem;
    background-color: #bb3d4c;
  }
}

.panel {
  margin: 0.2rem 0.28rem;
  padding: 0 0.2rem;
  background-color: #1f2636;

  .panel-head {
    height: 0.88rem;
    line-height: 0.88rem;
    padding-top: 0.1rem;
    text-align: center;
    font-weight: bold;

    .font-w {
      font-size: 0.28rem;
      // font-weight: 600;
      // color: #000;
    }
  }

  .panel-body {
    padding: 0 0.2rem;
    text-align: center;

    .iconfont {
      display: block;
      font-size: 20px;
      margin-bottom: 0.1rem;
      color: #138db2;
    }

    .font {
      font-size: 0.3rem;
      color: #000;
      font-weight: 600;
      line-height: 0.5rem;
    }

    .col-xs-3 {
      padding: 0.2rem 0;
    }
  }
}

.account-info {
  padding: 0.28rem;
  display: flex;
  justify-content: space-between;

  &_avatar {
    width: 1.13rem;
    height: 1.13rem;
    line-height: 1.13rem;
    border-radius: 50%;
    background-color: #444656;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 0.55rem;
      height: 0.58rem;
    }
  }

  &_detail {
    padding-left: 0.22rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;

    .account-phone {
      font-size: 0.3rem;
      color: #fff;
    }

    .account-name {
      color: #636a93;
    }
  }

  &_ctl {
    margin-top: 0.1rem;
  }
}

.account-container {
  // margin: .28rem;
  width: 6.9rem;
  margin: 0.28rem auto;
  border-radius: 5px;
  overflow: hidden;
  background-color: #1f2636;

  .pcx {
    margin: 0.2rem;
    // background-color: #1F2636;
    background: #1a1e29;
  }

  .account-center {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;

    span {
      font-size: 20px;
    }
  }

  .account-preview {
    display: flex;
    padding: 0.3rem 0.2rem 0.28rem;

    .acc-pre-left {
      width: 1.92rem;
      height: 1.92rem;
      background-image: url(../../assets/ico/round.png);
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      align-items: center;
      position: relative;

      img {
        width: 0.36rem;
        height: 0.36rem;
        margin-bottom: 0.1rem;
      }

      span.ti {
        font-size: 0.24rem;
        color: #ccc;
        margin-bottom: 0.1rem;
      }

      span.de {
        font-size: 0.24rem;
        color: #009c46;
        font-family: lightnumber;

        .account {
          font-family: lightnumber;
        }
      }

      &::after {
        display: block;
        content: "";
        width: 0.67rem;
        height: 2.21rem;
        position: absolute;
        top: -0.16rem;
        right: -0.44rem;
        background-image: url(../../assets/ico/round-r.png);
        background-size: cover;
      }
    }

    .acc-pre-center {
      margin-left: 0.45rem;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-family: lightnumber;
      color: #ccc;

      span {
        color: #fff;
        font-family: lightnumber;
        font-weight: 300;
      }
    }

    .acc-pre-right {
      flex: 1;
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .btn {
        color: #fff;
        padding: 0 10px;
        border-radius: 0.2rem;
      }

      .redbtn {
        background-color: #e6003e;
      }

      .bluebtn {
        background-color: #024da1;
      }
    }
  }
}

.red-theme {
  .wrapper {
    background-color: #e9e9e9;
  }

  .account-info_avatar {
    background-color: #b5b5b5;
  }

  .account-phone {
    color: #000;
  }

  .account-name {
    color: #999999;
  }

  .account-info_ctl {
    color: #858585;
  }

  .account-container {
    background-color: #fff;

    span.ti {
      color: #000 !important;
    }
  }

  .acc-pre-center {
    color: #333 !important;

    span {
      color: #333 !important;
    }
  }

  .acc-pre-right {
    .bluebtn {
      background-color: #222 !important;
    }
  }

  .account-box {
    background-color: #fff;
  }

  .name {
    color: #12354e !important;
  }

  .number {
    color: #e6003e !important;
  }

  .pcx {
    background-color: #e7e7e8;

    div {
      background-color: transparent !important;
      color: #000;
    }
  }

  .panel {
    background-color: #fff;
    color: #000;

    .panel-head {
      border-bottom-color: #cbcbcb;
    }

    .iconfont {
      color: #e6003e;
    }

    .font-w {
      color: #000;
    }
  }

  .other {
    .after {
      background-color: #fff;

      li {
        background-color: #fff;
        color: #000;
        border-bottom-color: #cbcbcb;

        .renzhen {
          color: #fff;
        }

        svg {
          color: #222;
        }
      }
    }
  }
}

.btns {
  display: flex;
  justify-content: space-around;

  > .mint-button {
    width: 25%;
  }
}

.accounts {
  width: 6.9rem;
  margin: 0.28rem auto;
  border-radius: 5px;
  overflow: hidden;

  .account {
    padding: 0.6rem 0.3rem;
    margin: 0.28rem auto;
    display: flex;
    flex-direction: column;
    background-color: #1f2636;
    line-height: 0.5rem;

    .bigFont {
      font-size: 0.3rem;
    }

    .num {
      color: #fff;
      font-family: lightnumber;
      font-weight: 300;
    }

    .top,
    .bottom {
      display: flex;
      justify-content: space-between;
    }

    .bottom {
      line-height: 0.3rem;
      margin-top: 0.1rem;
    }
  }
}

.submitDialog {
  /deep/ .el-dialog {
    background-color: #21252a;

    p {
      color: #eee;
      text-align: left;
      font-size: 0.3rem;
      line-height: 0.4rem;
    }

    .el-dialog__header {
      .el-dialog__title {
        color: #eee;
      }
    }
  }
}
</style>
