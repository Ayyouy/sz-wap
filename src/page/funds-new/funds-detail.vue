<template xmlns="http://www.w3.org/1999/html">
  <div class="wrapper">
    <div class="box-bg">
      <div class="box-center">
        <span class="fund-name">{{ detail.name }}</span>
      </div>
      <div class="box-center">
        <div class="box-center-clean">
          <span class="fund-content">{{ detail.annualizedReturn }}%</span>
        </div>
        <div class="box-center-clean">
          <span class="fund-content">${{ detail.perValue }}</span>
        </div>
        <div class="box-center-clean">
          <span class="fund-content">{{ detail.blackoutPeriod }}{{ $t('fundDetail.days') }}</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-center-clean">
          <span>{{ $t('fundDetail.aar') }}</span>
        </div>
        <div class="box-center-clean">
          <span>{{ $t('fundDetail.nav2') }}</span>
        </div>
        <div class="box-center-clean">
          <span>{{ $t('fundDetail.lock') }}</span>
        </div>
      </div>
    </div>
    <div class="box-bg">
      <div>
        <div style="margin: .1rem">
          <span style="font-weight: bold">{{ detail.name }}</span>
        </div>
      </div>
      <div style="margin: 20px .1rem .1rem;">
        <p style="font-size: 12px;margin-bottom: 0.2rem;text-indent: 2em;line-height: 18px"
           v-for="item in detail.info.split('\n')" :key="item">{{ item }}</p>
      </div>
    </div>
    <div class="box-bg" style="margin-bottom: 200px">
      <div class="box-center">
        <div style="margin: .1rem">
          <span style="font-weight: bold">{{ $t('fundDetail.info') }}</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>{{ $t('fundDetail.aar2') }}</span>
        </div>
        <div class="box-right">
          <span>{{ detail.annualizedReturn }}%</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>{{ $t('fundDetail.nav2') }}</span>
        </div>
        <div class="box-right">
          <span>${{ detail.perValue }}</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>{{ $t('fundDetail.max') }}</span>
        </div>
        <div class="box-right">
          <span>{{ detail.maxNum }}</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>{{ $t('fundDetail.issued') }}</span>
        </div>
        <div class="box-right">
          <span>{{ detail.totalNum }}</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>{{ $t('fundDetail.lock') }}</span>
        </div>
        <div class="box-right">
          <span>{{ detail.blackoutPeriod }}{{ $t('fundDetail.days') }}</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>{{ $t('fundDetail.sub') }}</span>
        </div>
        <div class="box-right">
          <span>{{ detail.purchaseRates }}%</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>{{ $t('fundDetail.red') }}</span>
        </div>
        <div class="box-right">
          <span>{{ detail.redemptionRate }}%</span>
        </div>
      </div>
    </div>
    <div class="box-bottom">
      <div class="box-bottom-left">
        <div class="box-bottom-money">
          <span style="font-size: 12px">{{ $t('fundDetail.balance') }}${{ accountMoney }}</span>
        </div>
        <div class="box-bottom-money">
          <span style="font-size: 12px">{{ $t('fundDetail.purchase') }}${{
              Number(detail.newPerValue * detail.maxBuyNum).toFixed(2)
            }}（{{
              detail.maxBuyNum
            }}{{ $t('buy.units') }}）</span>
        </div>
      </div>
      <div class="box-bottom-right" @click="dialogVisible=true">{{ $t('fundDetail.buy') }}</div>
    </div>
    <el-dialog center top="25vh" :title="$t('fundDetail.buy')" width="80%" :visible.sync="dialogVisible"
               :show-close="false"
               :close-on-click-modal="false">
      <div>
        <el-form :inline="false" :model="form" size="mini">
          <el-form-item :label="$t('buy.purchase')" prop="buyNum">
            <el-input v-model="form.buyNum" :placeholder="$t('redeem.input')" type="number"
                      @input="checkNumber"></el-input>
            <div class="el-form-item__error">{{ checkMessage }}</div>
          </el-form-item>
          <el-row style="margin-top: 10px;margin-bottom:10px;">
            <el-col :span="24" class="text-right">
              {{ $t('buy.pay') }}
              ${{ Number(form.buyNum * detail.newPerValue).toFixed(2) }}
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;margin-bottom:10px;">
            <el-col :span="21" class="text-left">
              {{ $t('fundDetail.purchase') }}
              ${{ Number(detail.newPerValue * detail.maxBuyNum).toFixed(2) }}
              （{{ detail.maxBuyNum }}{{ $t('buy.units') }}）
            </el-col>
            <el-col :span="3" class="text-right">
              <span style="color: #1ba6d0" @click="buyAllNumber">{{ $t('buy.fill') }}</span>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        {{ $t('buy.explain') }}
        <div style="margin-top: 10px;">
          {{ $t('buy.lockStart') }}
          {{ detail.blackoutPeriod }}
          {{ $t('buy.lockEnd') }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">{{ $t('buy.cancel') }}</el-button>
        <el-button type="primary" @click="submit()">{{ $t('buy.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '../../axios/api'
import {Toast} from 'mint-ui'

export default {
  data () {
    return {
      accountMoney: 0,
      detail: {
        newPerValue: 0,
        maxBuyNum: 0
      },
      dialogVisible: false,
      buyNumFlag: false,
      form: {
        buyNum: ''
      },
      checkMessage: ''
    }
  },
  mounted () {
    this.accountMoney = this.$route.query.am
    this.getDetail()
  },
  methods: {
    checkNumber (val) {
      if (this.form.buyNum === '' || this.form.buyNum <= 0) {
        this.checkMessage = this.$t('buy.zero')
        return false
      }
      if (Number.parseInt(this.form.buyNum) > this.detail.maxBuyNum) {
        this.checkMessage = this.$t('buy.limit')
        return false
      }
      // 是否要判断最大申购量
      const regex = /^[1-9]\d*$/
      if (!regex.test(this.form.buyNum)) {
        this.checkMessage = this.$t('note3')
        return false
      }
      if (Number.parseInt(this.form.buyNum) * this.detail.newPerValue > this.accountMoney) {
        this.checkMessage = this.$t('note4')
        return false
      }
      this.checkMessage = ''
      return true
    },
    buyAllNumber () {
      this.form.buyNum = this.detail.maxBuyNum
      this.checkNumber(this.form.buyNum)
    },
    cancelDialog () {
      this.dialogVisible = false
      this.checkMessage = ''
      this.form.buyNum = ''
    },
    async submit () {
      this.checkNumber(this.form.buyNum)
      if (this.checkMessage !== '') {
        return false
      }
      let opts = {
        buyPortion: this.form.buyNum,
        fundId: this.detail.id,
        userId: localStorage.getItem('wap-id')
      }
      let data = await api.buyFundsNew(opts)
      if (data.status === 0) {
        this.form.buyNum = ''
        // Toast('购买成功')
        Toast(this.$t('buy.success'))
        await this.$router.push('/fundsnew?index=2')
      } else {
        Toast(data.msg)
      }
      this.dialogVisible = false
    },
    async getDetail () {
      let opts = {
        id: this.$route.query.id
      }
      let data = await api.getFundsNewDetail(opts)
      if (data.status === 0) {
        // 申购费率：purchaseRates
        // 每份净值：perValue
        // 最大购买份额：accountMoney/(perValue*(1+purchaseRates/100)) 取整
        // 支付金额计算：buyNum*perValue*(1+purchaseRates/100)
        this.detail = data.data
        let newPerValue = this.detail.perValue * (1 + this.detail.purchaseRates / 100)
        this.detail.newPerValue = newPerValue
        this.detail.maxBuyNum = Number.parseInt(this.accountMoney / newPerValue)
      } else {
        Toast(data.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  padding-bottom: 0;
}

.box-bg {
  margin: .18rem;
  padding: .12rem .2rem;
  background-color: #1F2636;
  border-radius: .1rem;
}

.box-center {
  padding: .10rem .0rem .20rem .0rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.fund-name {
  font-size: 28px;
  display: inline-block;
  text-align: center;
  word-wrap: break-word;
}

.fund-content {
  font-size: 30px;
  color: #1b8e5d;
}

.fund-title {
  margin: .1rem;
}

.box-center-clean {
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.box-left {
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: .1rem;
}

.box-right {
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: .1rem;
}

.box-bottom {
  height: 50px;
  line-height: 50px;
  position: fixed;
  bottom: 0px;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  background-color: #16171d;
}

.box-bottom-left {
  width: 64%;
  height: 50px;
  line-height: 50px;
  display: flex;
  //margin: .2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1F2636;
  border-radius: 3px;
}

.box-bottom-right {
  width: 34%;
  //margin: .2rem;
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background-color: #1ba6d0;
}

.box-bottom-money {
  height: 20px;
  line-height: 20px;
}

.submitDialog {
  /deep/ .el-dialog {
    //background-color: #21252a;
    background-color: #ffffff;

    p {
      color: #fff;
      text-align: center;
      font-size: 0.4rem;

      i {
        color: green;
      }
    }

    // .el-dialog__footer {
    //   display: flex;
    //   justify-content: center;
    // }
  }
}
</style>
