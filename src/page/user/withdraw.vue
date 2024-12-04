<template>
  <div class="wrapper">
    <div>
      <div class="box">
        <div class="box-contain clearfix">
          <div class="account text-center">
            <p class="title">{{ $t('withdraw.amount1') }}</p>
            <p class="red number">{{ Number($store.state.userInfo.enableAmt).toFixed(2) || 0 }}</p>
          </div>
        </div>
      </div>
      <div class="form-block page-part">
        <mt-field
          :label="$t('withdraw.amount2')"
          :placeholder="$t('withdraw.amount3')"
          type="number"
          v-model="formData.amt">
          <span @click="changeAllNumber">{{ $t('withdraw.all') }}</span>
        </mt-field>
      </div>
      <div class="dynamic-calc">
        <span>{{ $t('withdraw.actual') }}</span>
        <span>{{ $t('withdraw.fee') }}</span>
      </div>
      <div class="attention">
        <p>{{ $t('withdraw.note') }}</p>
      </div>
      <el-radio-group class="payType" v-model="formData.payType" v-if="$store.state.bankInfo.countryId != 5">
        <el-radio-button label="0">{{ $t('withdraw.bank1') }}</el-radio-button>
      </el-radio-group>
      <el-radio-group class="payType" v-model="formData.payType" v-else>
        <el-radio-button label="0">{{ $t('withdraw.tether1') }}</el-radio-button>
      </el-radio-group>
      <div class="form-block page-part">
        <template v-if="$store.state.bankInfo.countryId != 5">
          <p class="rate">USD/{{ $store.state.bankInfo.code }}=1:{{ $store.state.bankInfo.rate }}</p>
          <mt-field readonly :label="outMoneyTitle+'出金'" v-model="formData.aa"/>
          <mt-field readonly :label="$t('withdraw.name')" v-model="$store.state.bankInfo.realName"/>
          <mt-field readonly :label="$t('withdraw.bank2')" v-model="$store.state.bankInfo.bankName"/>
          <mt-field readonly :label="$t('withdraw.bank3')" v-model="$store.state.bankInfo.bankNo"/>
        </template>
        <template v-else>
          <p class="rate">USD/{{ $store.state.bankInfo.code }}=1:{{ $store.state.bankInfo.rate }}</p>
          <mt-field readonly :label="outMoneyTitle+'出金'" v-model="formData.aa"/>
          <mt-field readonly :label="$t('withdraw.tether3')" v-model="$store.state.bankInfo.bankNo"/>
        </template>
      </div>
      <div class="attention">
        <p>{{ $t('withdraw.notice1') }}</p>
        <p>{{ $t('withdraw.notice2') }}</p>
        <p>
          {{ $t('withdraw.notice3') }} {{ settingInfo.withTimeBegin }} {{ $t('withdraw.notice4') }}
          {{ settingInfo.withTimeEnd }} {{ $t('withdraw.notice5') }}
        </p>
        <p>
          {{ $t('withdraw.notice6') }} {{ settingInfo.withFeeSingle }} {{ $t('withdraw.notice7') }}
          <span v-if="settingInfo.withFeePercent != 0">
            {{ $t('withdraw.notice8') }} {{ settingInfo.withFeePercent }}
          </span>
        </p>
        <p>{{ $t('withdraw.notice9') }} {{ settingInfo.withMinAmt }} {{ $t('withdraw.notice10') }}</p>
        <p>
          <span class="red">{{ $t('withdraw.notice11') }}</span>
        </p>
      </div>
      <div class="btnbox">
        <span class="text-center btnok" :style="doubleSubmit?'color:#eee;background:#676b6f':''"
              @click="toSure">{{ $t('withdraw.confirm') }}</span>
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
        <el-button type="danger" size="mini" @click="dialogObj.cancel">{{ $t('withdraw.cancel') }}</el-button>
        <el-button type="primary" size="mini" @click="dialogObj.success">{{ dialogObj.successTitle }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/axios/api'
import {Toast} from 'mint-ui'

export default {
  components: {},
  props: {},
  data () {
    return {
      card: '',
      phone: '',
      settingInfo: {
        withMinAmt: 0,
        withTimeBegin: 0, // 提现开始时间
        withTimeEnd: 0, // 提现结束时间
        withFeeSingle: 0, // 提现单笔手续费
        withFeePercent: 0 // 提现单笔手续费
      },
      formData: {
        amt: '',
        payType: '0',
        rate: 1
      },
      dialogObj: {
        flag: false,
        title: '',
        content: '',
        successTitle: '',
        success: Function,
        cancel: Function
      },
      doubleSubmit: false,
      doubleTitle: this.$t('recharge.double'), // 第一遍时提示此消息，第二遍时就提示返回重拾，这种是应对服务器异常，而导致doubleSubmit值没变过来的情况
      outMoneyTitle: (this.$store.state.bankInfo.currency == null || this.$store.state.bankInfo.currency === undefined) ? '' : this.$store.state.bankInfo.currency
    }
  },
  beforeDestroy () {
    if (this.$state.theme === 'red') {
      document.body.classList.remove('red-bg')
      document.body.classList.add('black-bg')
    }
  },
  mounted () {
    if (this.$state.theme === 'red') {
      document.body.classList.remove('black-bg')
      document.body.classList.add('red-bg')
    }
    this.getSettingInfo()
  },
  watch: {
    'formData.amt' (val) {
      this.formData.aa = Number(val * this.$store.state.bankInfo.rate).toFixed(2)
    }
  },
  methods: {
    dialogCancel () {
      this.dialogObj.flag = false
      this.dialogObj.title = ''
      this.dialogObj.content = ''
      this.dialogObj.success = () => {
      }
    },
    changeAllNumber () {
      this.formData.amt = this.$store.state.userInfo.enableAmt
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
    async toSure () {
      if (this.doubleSubmit) {
        Toast(this.doubleTitle)
        return
      }
      this.doubleSubmit = true
      if (!this.formData.amt || this.formData.amt <= 0) {
        this.doubleSubmit = false
        // Toast('请输入正确的提现金额')
        Toast(this.$t('withdraw.msgAmount'))
        return
      }
      if (this.formData.amt - this.settingInfo.withMinAmt < 0) {
        this.doubleSubmit = false
        // Toast('提现金额不得小于' + this.settingInfo.withMinAmt)
        Toast(this.$t('withdraw.msgLimit') + this.settingInfo.withMinAmt)
        return
      }
      let opts = {
        amt: this.formData.amt,
        currency: this.$store.state.bankInfo.code,
        countryId: this.$store.state.bankInfo.countryId
      }
      let data = await api.outMoney(opts)
      if (data.status === 0) {
        // 成功
        // Toast('申请成功，请等待审核!')
        Toast(this.$t('withdraw.success'))
        await this.$router.push('/moneyList?index=2')
      } else {
        Toast(data.msg)
      }
      this.doubleSubmit = false
    }
  }
}
</script>
<style lang="less" scoped>
.account {
  padding-bottom: 0.2rem;

  .title {
    height: 1.4rem;
    line-height: 1.4rem;
    font-size: 0.29rem;
    // color: rgb(51, 51, 51);
    text-align: center;
    // font-weight: 700;
  }

  .number {
    font-size: 0.566rem;
    font-weight: 600;
  }
}

.addcard {
  height: 0.834rem;
  line-height: 0.834rem;
  font-size: 0.29rem;
  color: rgb(187, 187, 187);

  a {
    color: #177be1;
  }
}

.attention {
  line-height: 0.417rem;
  padding: 0.347rem;
}

/deep/ .payType {
  //margin: 0 0.4rem;
  display: flex;

  .el-radio-button {
    flex: 1;

    .el-radio-button__inner {
      width: 100%;
      background-color: #21252a;
      color: #cfd0d1;
      border: none;
    }
  }
}

/deep/ .mint-field .mint-cell-title {
  text-align: right;
}

.rate {
  text-align: right;
  font-size: 0.4rem;
  margin: 0.3rem;
}

.dynamic-calc {
  display: flex;
  flex-direction: row;
  line-height: 0.417rem;
  padding: 0.347rem;

  span {
    margin-right: 0.347rem !important;
  }
}
</style>
