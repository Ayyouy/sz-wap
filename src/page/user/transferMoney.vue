<template>
  <div class="wrapper">
    <div class="box">
      <div class="box-contain clearfix">
        <div class="account text-center">
          <p class="title">现金账户余额</p>
<!--          <p class="red number" v-show="selected==1">${{ // accountMoney || 0 }}</p>-->
          <p class="red number">${{ $store.state.userInfo.enableAmt || 0 }}</p>
        </div>
      </div>
    </div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">与基金账户互转</mt-tab-item>
      <mt-tab-item id="2">转账给他人</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item id="1">
        <el-radio-group class="payType form-block" v-model="payType">
          <el-radio-button label="0">转入基金账户</el-radio-button>
          <el-radio-button label="1">转入现金账户</el-radio-button>
        </el-radio-group>
        <div class="form-block">
          <mt-field v-show="payType === '1'" label="可转金额" placeholder="可转金额" type="text" disabled
                    v-model="accountMoney"></mt-field>
        </div>
        <div class="form-block">
          <mt-field label="转账金额" v-show="payType === '0'" name="amt" v-model="form.account1"
                    placeholder="请输入转账金额" type="number">
            <span @click="selectAll(1)">全部</span>
          </mt-field>
          <mt-field label="转账金额" v-show="payType === '1'" name="amt" v-model="form.account2"
                    placeholder="请输入转账金额" type="number">
            <span @click="selectAll(2)">全部</span>
          </mt-field>
        </div>
        <div class="form-block">
          <mt-field
            :label="`${payType === '0' ? '基金' : '现金'}账户余额`"
            :placeholder="`${payType === '0' ? '基金' : '现金'}账户余额`"
            type="text"
            disabled
            v-model="accountMoney"
          ></mt-field>
        </div>
        <div class="btnbox">
          <span class="text-center btnok loginout" @click="toSubmit(1)">
            确认转入{{ payType === '0' ? '基金' : '现金' }}账户</span>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div class="form-block">
          <mt-field
            label="可转金额"
            placeholder="可转金额"
            type="text"
            disabled
            v-model="this.$store.state.userInfo.enableAmt"
          ></mt-field>
        </div>
        <div class="form-block">
          <mt-field
            label="转账金额"
            v-model="form.account"
            placeholder="请输入转账金额"
            type="number">
            <span @click="selectAll(3)">全部</span>
          </mt-field>
        </div>
        <div class="form-block">
          <mt-field
            label="转账人手机"
            placeholder="请输入转账人手机"
            type="text"
            v-model="phone"
          ></mt-field>
        </div>
        <div class="form-block">
          <mt-field
            label="收款人姓名"
            placeholder="收款人姓名"
            type="text"
            disabled
            v-model="name"
          ></mt-field>
          <p class="red tip">请核对收款人手机号和姓名是否一致</p>
        </div>
        <div class="btnbox">
          <span class="text-center btnok loginout" @click="showDialog">确定</span>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <el-dialog
      center
      top="30vh"
      width="80%"
      title="验证码确认"
      class="submitDialog"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <p class="title">为了您的资金安全，需要输入您的手机验证码</p>
      <div class="flexDiv">
        <span>验证码：</span>
        <el-input placeholder="请输入" v-model="code" class="input-with-select">
          <template slot="append">
            <el-button
              size="mini"
              type="primary"
              :disabled="!!timer"
              :loading="codeBtnLoading"
              @click="getCode"
            >{{ buttonValue }}
            </el-button
            >
          </template>
        </el-input>
      </div>
      <p class="timerTip" v-show="timer">验证码已发送到您的注册手机</p>
      <span slot="footer">
        <el-button type="primary" @click="toSubmit(2)">确 定</el-button>
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
      name: '',
      dialogVisible: false,
      code: '',
      buttonValue: '获取验证码',
      timer: null,
      codeBtnLoading: false
    }
  },
  watch: {
    phone (val) {
      if (val.length >= 7) {
        this.getNameByPhone(val)
      }
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
    async getNameByPhone (value) {
      if (value) {
        let opt = {
          phoneNum: value
        }
        let data = await api.getNameByPhone(opt)
        if (data.status === 0) {
          this.name = data.data.realName
        } else {
          this.name = ''
        }
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
      } else if (val === 2) {
        account = this.form.account
      }
      let opt = {
        phoneNum: this.phone,
        amt: account,
        code: this.code,
        type: val
      }
      let data = await api.transferMoney(opt)
      if (data.status === 0) {
        Toast('您的转账已完成')
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
      if (!this.form.account || this.form.account === 0 || this.form.account > this.$store.state.userInfo.enableAmt) {
        Toast('请输入正确的转账金额')
      } else if (!this.phone) {
        Toast('请输入收款人手机')
      } else if (!this.name) {
        Toast('收款人账号不存在')
      } else {
        this.dialogVisible = true
        this.code = ''
        this.buttonValue = '获取验证码'
        this.codeBtnLoading = false
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
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
            this.buttonValue = '获取验证码'
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
</style>
