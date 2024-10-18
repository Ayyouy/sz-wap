<template xmlns="http://www.w3.org/1999/html">
  <div class="wrapper">
    <div class="box-bg">
      <div class="box-center">
        <span class="fund-name">{{ detail.name }}</span>
      </div>
      <div class="box-center">
        <div class="box-center-clean">
<!--          <span class="fund-content">{{ (detail.oneIncome / detail.blackoutPeriod).toFixed(2) * 365 }}%</span>-->
          <span class="fund-content">{{ detail.annualizedReturn }}%</span>
        </div>
        <div class="box-center-clean">
          <span class="fund-content">${{ detail.perValue }}</span>
        </div>
        <div class="box-center-clean">
          <span class="fund-content">{{ detail.blackoutPeriod }}天</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-center-clean">
          <span>年化收益</span>
        </div>
        <div class="box-center-clean">
          <span>每份净值</span>
        </div>
        <div class="box-center-clean">
          <span>封锁期</span>
        </div>
      </div>
    </div>
    <div class="box-bg">
      <div>
        <div style="margin: .1rem">
          <span style="font-weight: bold">{{ detail.name }}</span>
        </div>
      </div>
      <div v-html="detail.info" style="margin: 20px .1rem .1rem;"></div>
    </div>
    <div class="box-bg" style="margin-bottom: 200px">
      <div class="box-center">
        <div style="margin: .1rem">
          <span style="font-weight: bold">基金信息</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>年化收益率</span>
        </div>
        <div class="box-right">
<!--          <span>{{ // (detail.oneIncome / detail.blackoutPeriod).toFixed(2) * 365 }}%</span>-->
          <span>{{ detail.annualizedReturn }}%</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>每份净值</span>
        </div>
        <div class="box-right">
          <span>${{ detail.perValue }}</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>最大申购量</span>
        </div>
        <div class="box-right">
          <span>{{ detail.maxNum }}</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>发行份数</span>
        </div>
        <div class="box-right">
          <span>{{ detail.totalNum }}</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>封锁期</span>
        </div>
        <div class="box-right">
          <span>{{ detail.blackoutPeriod }}天</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>申购费率</span>
        </div>
        <div class="box-right">
          <span>{{ detail.purchaseRates }}%</span>
        </div>
      </div>
      <div class="box-center">
        <div class="box-left">
          <span>赎回费率</span>
        </div>
        <div class="box-right">
          <span>{{ detail.redemptionRate }}%</span>
        </div>
      </div>
    </div>
    <div class="box-bottom">
      <div class="box-bottom-left">
        <div class="box-bottom-money">
          <span>基金账户余额：${{ accountMoney }}</span>
        </div>
        <div class="box-bottom-money">
          <span>最大可购买：${{ detail.perValue * detail.maxNum }}（{{ detail.maxNum }}份）</span>
        </div>
      </div>
      <div class="box-bottom-right" @click="dialogVisible=true">购买</div>
    </div>
    <el-dialog center top="40vh" title="购买" width="80%" :visible.sync="dialogVisible">
      <div>
        <el-form :inline="false" :model="form" size="mini" ref="ruleForm" :rules="rule">
          <el-form-item label="购买份额" prop="buyNum">
            <el-input v-model="form.buyNum" placeholder="请输入" type="number" @input="changeBuyNum"></el-input>
            <div style="font-size: 12px;color: #f56c6c" v-show="buyNumFlag">请输入整数</div>
          </el-form-item>
          <el-row style="margin-top: 10px;margin-bottom:10px;">
            <el-col :span="24" class="text-right">需支付：${{ form.buyNum * detail.perValue }}</el-col>
          </el-row>
          <el-row style="margin-top: 10px;margin-bottom:10px;">
            <el-col :span="21" class="text-right">最大可购买：${{
                detail.perValue * detail.maxNum
              }}（{{ detail.maxNum }}份）
            </el-col>
            <el-col :span="3" class="text-right">
              <span style="color: #1ba6d0" @click="form.buyNum=detail.maxNum">填入</span>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        说明：
        <div style="margin-top: 10px;">封锁期为{{ detail.blackoutPeriod }}天，封锁期内没有收益</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
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
      detail: {},
      dialogVisible: false,
      buyNumFlag: false,
      form: {
        buyNum: ''
      },
      rule: {
        name: [{required: true, message: '不可为空', trigger: 'blur'}],
        buyNum: [
          {required: true, message: '请输入购买份额', trigger: 'blur'},
          {validator: this.validateNumber, trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    this.getWallets()
    this.getDetail()
  },
  methods: {
    changeBuyNum (val) {
      this.buyNumFlag = /[.]/.test(val)
    },
    validateNumber (rule, value, callback) {
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      if (value <= 0) {
        return callback(new Error('输入值需大于零'))
      }
      if (value > this.detail.maxNum) {
        return callback(new Error('输入值超过最大购买份额'))
      }
      if (Number(value) * Number(this.detail.perValue) > this.accountMoney) {
        return callback(new Error('余额不足，请减少购买份额'))
      }
      callback()
    },
    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let opts = {
            buyPortion: this.form.buyNum,
            fundId: this.detail.id,
            userId: localStorage.getItem('wap-id')
          }
          let data = await api.buyFundsNew(opts)
          if (data.status === 0) {
            this.form.buyNum = ''
            Toast('购买成功')
            this.$router.push('/fundsnew?index=2')
          } else {
            Toast(data.msg)
          }
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
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
    async getDetail () {
      let opts = {
        id: this.$route.query.id
      }
      let data = await api.getFundsNewDetail(opts)
      if (data.status === 0) {
        this.detail = data.data
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
  width: 6.9rem;
  margin: .3rem;
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
  font-size: 25px;
}

.fund-content {
  font-size: 35px;
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
  height: 60px;
  line-height: 60px;
  position: fixed;
  bottom: 5px;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: row;
}

.box-bottom-left {
  width: 64%;
  height: 60px;
  line-height: 60px;
  display: flex;
  margin: .1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1F2636;
  border-radius: 3px;
}

.box-bottom-right {
  width: 34%;
  margin: .1rem;
  height: 60px;
  line-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background-color: #1ba6d0;
}

.box-bottom-money {
  height: 30px;
  line-height: 30px;
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
