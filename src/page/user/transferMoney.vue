<template>
  <div class="wrapper">
    <div class="box">
      <div class="box-contain clearfix">
        <div class="account text-center">
          <p class="title">{{ $t('transfer.balance1') }}</p>
          <p class="red number">${{ $store.state.userInfo.enableAmt || 0 }}</p>
        </div>
      </div>
    </div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">{{ $t('transfer.inter') }}</mt-tab-item>
      <mt-tab-item id="2">{{ $t('transfer.other') }}</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item id="1">
        <el-radio-group class="payType form-block" v-model="payType">
          <el-radio-button label="0">{{ $t('transfer.fund') }}</el-radio-button>
          <el-radio-button label="1">{{ $t('transfer.cash') }}</el-radio-button>
        </el-radio-group>
        <div class="form-block">
          <mt-field v-show="payType === '1'" :label="$t('transfer.available')"
                    :placeholder="$t('transfer.available')" type="text" disabled
                    v-model="accountMoney"></mt-field>
        </div>
        <div class="form-block">
          <mt-field :label="$t('transfer.amount1')" v-show="payType === '0'" name="amt" v-model="form.account1"
                    :placeholder="$t('transfer.amount2')" type="number">
            <span style="color: #1ba6d0" @click="selectAll(1)">{{ $t('transfer.all') }}</span>
          </mt-field>
          <mt-field :label="$t('transfer.amount1')" v-show="payType === '1'" name="amt" v-model="form.account2"
                    :placeholder="$t('transfer.amount2')" type="number">
            <span style="color: #1ba6d0" @click="selectAll(2)">{{ $t('transfer.all') }}</span>
          </mt-field>
        </div>
        <div class="form-block">
          <mt-field
            :label="payType === '0' ? $t('to.balance1') : $t('to.balance')"
            :placeholder="payType === '0' ? $t('to.balance1') : $t('to.balance')"
            type="text"
            disabled
            style="font-size: 12px"
            v-model="accountMoney"
          ></mt-field>
        </div>
        <div class="btnbox">
          <span class="text-center btnok loginout" @click="toSubmit(1)">
            {{ payType === '0' ? $t('transfer.confirmFund') : $t('transfer.confirmCash') }}</span>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div class="form-block">
          <mt-field
            :label="$t('transfer.available')"
            :placeholder="$t('transfer.available')"
            type="text"
            disabled
            v-model="$store.state.userInfo.enableAmt"
          ></mt-field>
        </div>
        <div class="form-block">
          <mt-field
            :label="$t('transfer.amount1')"
            v-model="form.account"
            :placeholder="$t('transfer.amount2')"
            type="number">
            <span style="color: #1ba6d0" @click="selectAll(3)">{{ $t('transfer.all') }}</span>
          </mt-field>
        </div>
        <div class="form-block">
          <a data-v-5edda588="" class="mint-cell mint-field">
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title"><span class="mint-cell-text">{{ $t('transfer.phone') }}</span></div>
              <div class="mint-cell-value">
                <select class="select-phone" v-model="select">
                  <option class="option-phone" v-for="item in options" :key="item" :label="item" :value="item">{{
                      item
                    }}
                  </option>
                </select>
                <input class="input-phone" :placeholder="$t('transfer.number')" type="tel" pattern="[0-9]*"
                       v-model="phone"
                       @change="getNameByPhone()"/>
                <div class="mint-field-clear" style="display: none;">
                  <i class="mintui mintui-field-error"></i>
                </div>
                <span class="mint-field-state is-default">
                  <i class="mintui mintui-field-default"></i>
                </span>
              </div>
            </div>
            <div class="mint-cell-right"></div>
          </a>

        </div>
        <div class="form-block">
          <mt-field
            :label="$t('transfer.payee')"
            :placeholder="$t('transfer.name')"
            type="text"
            disabled
            v-model="name"
          ></mt-field>
          <p class="red tip">{{ $t('transfer.match') }} </p>
        </div>
        <div class="btnbox">
          <span class="text-center btnok loginout" @click="showDialog">{{ $t('transfer.confirm') }}</span>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <el-dialog
      center
      top="30vh"
      width="80%"
      :title="$t('bank.ver')"
      class="submitDialog"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <p class="title">{{ $t('transfer.safe') }}</p>
      <div class="flexDiv">
        <span>{{ $t('transfer.code') }}：</span>
        <el-input :placeholder="$t('bank.input')" v-model="code" class="input-with-select">
          <template slot="append">
            <el-button
              size="mini"
              type="primary"
              :disabled="!!timer"
              :loading="codeBtnLoading"
              @click="getCode"
            >{{ buttonValue }}
            </el-button>
          </template>
        </el-input>
      </div>
      <p class="timerTip" v-show="timer">{{ $t('transfer.send') }}</p>
      <span slot="footer">
        <el-button type="primary" @click="toSubmit(2)">{{ $t('transfer.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import foot from '@/components/foot/foot'
import * as api from '@/axios/api'
import {Toast} from 'mint-ui'

export default {
  components: {
    foot
  },
  data () {
    return {
      accountMoney: 0,
      selected: '1', // 选中
      form: {
        account1: '',
        account2: '',
        account: ''
      },
      userInfo: {
        realName: ''
      },
      payType: '0',
      phone: '',
      select: '+1',
      options: ['+1', '+852', '+91', '+81', '+86', '+88', '+00', '+99'],
      name: '',
      dialogVisible: false,
      code: '',
      buttonValue: this.$t('register.getCode'),
      timer: null,
      codeBtnLoading: false
    }
  },
  mounted () {
    if (this.$route.query.type) {
      this.selected = this.$route.query.type + ''
    }
    this.getWallets()
    this.getUserInfo()
  },
  methods: {
    async getWallets () {
      let opts = {
        userId: localStorage.getItem('wap-id')
      }
      let data = await api.wallets(opts)
      if (data.status === 0) {
        this.accountMoney = Number(data.data.walletBalance).toFixed(2)
      } else {
        Toast(data.msg)
      }
    },
    async getNameByPhone () {
      if (this.phone.length < 7) {
        Toast(this.$t('pwd.msgAccount'))
        return
      }
      let opt = {
        phoneNum: this.select + this.phone
      }
      let data = await api.getNameByPhone(opt)
      if (data.status === 0) {
        this.name = data.data.realName
      } else {
        Toast(data.msg)
        this.name = ''
      }
    },
    selectAll (val) {
      // 选择全部
      switch (val) {
        case 1:
          this.form.account1 = this.$store.state.userInfo.enableAmt
          break
        case 2:
          this.form.account2 = this.$store.state.userInfo.enableAmt
          break
        case 3:
          this.form.account = this.$store.state.userInfo.enableAmt
      }
    },
    async toSubmit (val) {
      let account = 0
      if (val === 1) {
        if (this.payType === '0') {
          account = this.form.account1
        } else if (this.payType === '1') {
          account = -this.form.account2
        }
      }
      if (val === 2) {
        account = this.form.account
      }
      if (account <= 0 || account > this.$store.state.userInfo.enableAmt) {
        Toast(this.$t('transfer.msg') + this.$store.state.userInfo.enableAmt)
        return
      }
      let opt = {
        phoneNum: this.phone,
        amt: account,
        code: this.code,
        type: val
      }
      let data = await api.transferMoney(opt)
      if (data.status === 0) {
        // Toast('您的转账已完成')
        Toast(this.$t('transfer.success'))
        setTimeout(() => {
          this.$router.push(`/moneyList?index=${+this.selected + 2}`)
        }, 1000)
      } else {
        Toast(data.msg)
      }
    },
    async getUserInfo () {
      // 获取用户信息
      let data = await api.getUserInfo()
      if (data.status === 0) {
        this.$store.state.userInfo = data.data
      } else {
        Toast(data.msg)
      }
    },
    showDialog () {
      // if (!this.form.account || this.form.account === 0 || this.form.account > this.$store.state.userInfo.enableAmt) {
      //   // Toast('请输入正确的转账金额')
      //   Toast(this.$t('transfer.correct'))
      //   return
      // }
      if (!this.phone || this.phone.length < 7) {
        // Toast('请输入收款人手机')
        Toast(this.$t('transfer.input'))
        return
      }
      if (!this.name) {
        // Toast('收款人账号不存在')
        Toast(this.$t('transfer.exist'))
        return
      }
      this.dialogVisible = true
      this.code = ''
      this.buttonValue = this.$t('register.getCode')
      this.codeBtnLoading = false
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    getCode () {
      if (this.timer) {
        return
      }
      let opts = {
        phoneNum: this.$store.state.userInfo.phone
      }
      this.codeBtnLoading = true
      const res = api.sendRechargeSms(opts)
      this.codeBtnLoading = false
      if (res.status === 0) {
        Toast(res.msg)
        let time = 60
        this.buttonValue = `${time}s`
        this.timer = setInterval(() => {
          time--
          this.buttonValue = `${time}s`
          if (time === 0) {
            clearInterval(this.timer)
            this.timer = null
            this.buttonValue = this.$t('register.getCode')
          }
        }, 1000)
      } else {
        Toast(res.msg)
      }
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

.is-selected .mint-tab-item-label:hover {
  text-decoration: none;
}

.wrapper /deep/ .mint-tab-item-label {
  font-size: 0.264rem;
}

.mint-navbar .mint-tab-item.is-selected {
  // color: #d50000;
  // border-bottom: 2px solid #d50000;
  text-decoration: none;
  margin-bottom: 0;
}

.prompt {
  padding: 0.3rem 0 0.2rem 0.7rem;
}

.tip {
  font-size: 0.3rem;
  text-align: center;
  padding-top: 0.2rem;
}

/deep/ .payType {
  padding: 0.4rem;
  display: flex;
  background: #21252a;

  .el-radio-button {
    flex: 1;

    .el-radio-button__inner {
      width: 100%;
    }
  }
}

/deep/ .submitDialog {
  z-index: 100 !important;

  .el-dialog {
    background-color: #21252a;

    .title {
      color: #fff;
      text-align: center;
      font-size: 0.3rem;
      line-height: 0.4rem;
    }

    .el-dialog__header {
      .el-dialog__title {
        color: #fff;
      }
    }

    .flexDiv {
      display: flex;
      align-items: center;
      margin-top: 0.3rem;

      > span {
        color: #fff;
        flex-shrink: 0;
      }
    }

    .timerTip {
      color: #eee;
      text-align: right;
      margin-top: 0.3rem;
    }
  }
}

/deep/ .v-modal {
  z-index: 99 !important;
}

.select-phone {
  width: 0.8rem !important;
  background-color: #16171d;
  text-align: center;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-size: 13px;
  padding-top: 1px;
}

.option-phone {
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  font-size: 13px;
}

.input-phone {
  margin-left: 0.1rem;
  font-size: 13px;

  &::-webkit-input-placeholder {
    color: #363636;
  }

  -webkit-text-fill-color: #fff !important;
  transition: background-color 5000s ease-in-out 0s !important;

  &:-webkit-autofill {
    box-shadow: 0 0 0px 1000px #121319 inset !important;
  }

  &:-webkit-autofill:focus {
    box-shadow: 0 0 0px 1000px #121319 inset !important;
  }
}
</style>
