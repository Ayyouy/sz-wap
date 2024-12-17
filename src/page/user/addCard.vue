<template>
  <div class="wrapper">
    <div class="box transaction">
      <div class="box-contain clearfix">
        <div class="empty text-center" style="margin-top: 0.3rem">
          <i style="color: red; font-size: 1.2rem; margin-top: 0.2rem"
            class="iconfont icon-chongzhi2"></i>
        </div>
      </div>
    </div>
    <div class="form-block page-part">
      <mt-field
        readonly
        type="text"
        :label="$t('bank.out')"
        :placeholder="$t('bank.select')"
        class="countryIdField"
        v-model="countryId">
        <select v-model="countryId">
          <option value="1" :class="{ selectActive: countryId == '1' }">
            {{$t('bank.hk')}}
          </option>
          <option value="2" :class="{ selectActive: countryId == '2' }">
            {{$t('bank.us')}}
          </option>
          <option value="3" :class="{ selectActive: countryId == '3' }">
            {{$t('bank.jp')}}
          </option>
          <option value="4" :class="{ selectActive: countryId == '4' }">
            {{$t('bank.ir')}}
          </option>
          <option value="5" :class="{ selectActive: countryId == '5' }">
            {{$t('bank.tether')}}
          </option>
        </select>
      </mt-field>
      <template v-if="countryId != '5'">
        <mt-field
          :label="$t('bank.name')"
          :placeholder="$t('bank.example')"
          type="text"
          v-model="bankName"/>
        <mt-field
          :label="$t('bank.number')"
          :placeholder="$t('bank.inputNumber')"
          v-model="bankNo"/>
      </template>
      <template v-else>
        <mt-field
          :label="$t('bank.wallet')"
          :placeholder="$t('bank.inputWallet')"
          v-model="bankNo"/>
      </template>
    </div>
    <div class="rule-box">
      <div class="title">{{$t('bank.prompt2')}}</div>
      <ul>
        <li>
          {{$t('bank.notice1')}}
        </li>
        <li>
          {{$t('bank.notice2')}}
        </li>
        <li>
          {{$t('bank.notice3')}}
        </li>
      </ul>
    </div>
    <div class="btnbox">
      <span class="text-center btnok" @click="showDialog">{{$t('bank.confirm')}}</span>
    </div>
    <el-dialog
      center
      top="30vh"
      width="80%"
      :title="$t('bank.ver')"
      class="submitDialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false">
      <p class="title">
        {{$t('bank.security')}}
      </p>
      <div class="flexDiv">
        <span>{{$t('bank.code')}}</span>
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
      <p class="timerTip" v-show="timer">{{$t('transfer.send')}}</p>
      <span slot="footer">
        <el-button type="primary" @click="toSure">{{$t('bank.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/axios/api'
import {Toast} from 'mint-ui'

export default {
  data () {
    return {
      bankName: '',
      bankNo: '',
      bankAddress: '', // 支行地址
      countryId: '',
      type: this.$t('bank.add1'),
      dialogVisible: false,
      code: '',
      buttonValue: this.$t('pwd.getCode'),
      timer: null,
      codeBtnLoading: false
    }
  },
  mounted () {
    this.type = this.$route.query.type ? this.$t('bank.edit') : this.$t('bank.add1')
    if (this.$store.state.bankInfo) {
      this.bankName = this.$store.state.bankInfo.bankName
      this.bankNo = this.$store.state.bankInfo.bankNo
      this.bankAddress = this.$store.state.bankInfo.bankAddress
      this.countryId = this.$store.state.bankInfo.countryId
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    showDialog () {
      // if (isNull(this.bankNo) || !bankNoReg(this.bankNo)) {
      //   Toast("请输入银行卡号");
      // } else if (isNull(this.bankName) || !isName(this.bankName)) {
      //   Toast("请输入银行名称");
      // } else if (isNull(this.bankAddress) || !isName(this.bankAddress)) {
      //   Toast("请输入开户支行");
      // } else {
      this.dialogVisible = true
      this.code = ''
      this.buttonValue = this.$t('pwd.getCode')
      this.codeBtnLoading = false
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      // }
    },
    getCode () {
      if (this.timer) {
        return
      }
      let opts = {
        phoneNum: this.$store.state.userInfo.phone
      }
      this.codeBtnLoading = true
      const res = api.sendAddBankSms(opts)
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
            this.buttonValue = this.$t('pwd.getCode')
          }
        }, 1000)
      } else {
        Toast(res.msg)
      }
    },
    async toSure () {
      // 添加银行卡
      if (!this.code) {
        // Toast('请输入验证码')
        Toast(this.$t('register.inputCode'))
      } else {
        let opts = {
          bankName: this.bankName,
          bankNo: this.bankNo,
          bankAddress: this.bankAddress,
          countryId: this.countryId,
          code: this.code
        }
        if (this.$route.query.type === 'edit') {
          let data = await api.updateBankCard(opts)
          if (data.status === 0) {
            // Toast('修改成功!')
            Toast(this.$t('bank.change'))
            await this.$router.push('/card')
          } else {
            Toast(data.msg)
          }
        } else {
          let data = await api.addBankCard(opts)
          if (data.status === 0) {
            // Toast('添加成功!')
            Toast(this.$t('bank.success'))
            await this.$router.push('/card')
          } else {
            Toast(data.msg)
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.rule-box {
  padding: 0.2rem 0.3rem;

  .title {
    font-size: 0.3rem;
    height: 0.5rem;
    line-height: 0.5rem;
    margin-bottom: 0.2rem;
  }

  ul {
    li {
      color: #999;
      line-height: 0.5rem;
    }
  }
}

/deep/ .countryIdField {
  .mint-field-core {
    display: none;
  }

  .mint-cell-value {
    padding-right: 0.1rem;
  }

  .mint-field-other {
    width: 100%;

    select {
      width: 100%;
      height: 0.7rem;
      background: #21252a;

      option {
        color: #fff;
      }
    }
  }
}

.submitDialog {
  /deep/ .el-dialog {
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
</style>
