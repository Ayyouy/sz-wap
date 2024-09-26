<template>
  <div class="wrapper">
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item id="2">
        <div v-if="list.length<=0 && !getStatus2" class="empty text-center">
          暂无我的基金信息!
        </div>
        <div v-if="list.length<=0 && getStatus2" class="empty text-center">
          <mt-spinner type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <div v-if="list.length>0">
          <ul class="order-info-box-wrap"
              v-infinite-scroll="loadMore"
              :infinite-scroll-disabled="loading2"
              infinite-scroll-distance="0">
            <li v-for="(item) in list" :key="item.id">
              <div class="order-info-box">
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>预期总收益</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span style="color: #1b8e5d"> ${{ item.dueIncome }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>已获得收益</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span style="color: #1b8e5d"> ${{ item.income }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>基金名称</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.fundName }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>每份净值</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.perValue }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>申购金额（份额）</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.perValue * item.buyPortion }}（{{ item.buyPortion }}份）</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>申购时间</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ new Date(item.buyTime) | timeFormat }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="!item.flag">
                  <el-col :span="8" class="text-left">
                    <span>解封时间</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ new Date(item.lockTime) | timeFormat }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.flag">
                  <el-col :span="8" class="text-left">
                    <span>赎回金额（份额）</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.perValue * item.redeemedPortion }}（{{ item.redeemedPortion }}份）</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.flag">
                  <el-col :span="8" class="text-left">
                    <span>持仓金额（份额）</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.perValue * item.redemptionPortion }}（{{ item.redemptionPortion }}份）</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.flag">
                  <el-col :span="8" class="text-left">
                    <span>离本期结算天数</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.nextDay }}天</span>
                  </el-col>
                </el-row>
                <div class="btn-bg">
                  <el-button v-if="item.flag" type="success" @click="btnShowDialog(item)">
                    赎回
                  </el-button>
                  <el-button v-else type="info">
                    封锁中（{{ new Date(item.lockTime) | timeFormat }}解封）
                  </el-button>
                </div>
              </div>
            </li>
          </ul>
          <div v-show="loading2" class="load-all text-center">
            <mt-spinner type="fading-circle"></mt-spinner>
            加载中...
          </div>
          <div v-show="!loading2" class="load-all text-center">
            已全部加载
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <Foot></Foot>
    <el-dialog center top="40vh" title="赎回" width="80%" :visible.sync="dialogVisible">
      <div>
        <el-form :inline="false" :model="form" size="mini" ref="ruleForm" :rules="rule">
          <el-form-item label="赎回份额" prop="buyNum">
            <el-input v-model="form.buyNum" placeholder="请输入" type="number" @input="handleInput"></el-input>
          </el-form-item>
          <span></span>
          <el-row style="margin-top: 10px;margin-bottom:10px;">
            <el-col :span="21" class="text-right">
              最大可赎回：${{ choice.perValue * choice.redemptionPortion }}（{{ choice.redemptionPortion }}份）
            </el-col>
            <el-col :span="3" class="text-right">
              <span style="color: #1ba6d0" @click="form.buyNum=choice.redemptionPortion">填入</span>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        说明：
        <div style="margin-top: 10px;">
          您的持仓基金，目前正处理于<span style="color: #1ba6d0">第{{ choiceNext.per }}期</span>阶段，
          收益率为<span style="color: #1ba6d0">{{ choiceNext.perIncome }}%</span>，
          若您赎回该份额，赎回资金将按<span style="color: #1ba6d0">第{{ Number.parseInt(choiceNext.per) - 1 }}期</span>收益率为
          <span style="color: #1ba6d0">{{ choiceNext.lastPerIncome }}%</span>，
          计算 <span style="color: #1ba6d0">{{ choiceNext.moreDays }}</span>天的持仓收益。
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog center top="40vh" title="确定赎回" width="80%" :visible.sync="dialogVisible2">
      <div>
        说明：
        <div style="margin-top: 10px;">
          您本次赎回资金，将损失<span
          style="color: #1ba6d0">${{
            (form.buyNum * choiceNext.perValue) * (choiceNext.perIncome / 100) / (choiceNext.blackoutPeriod * choiceNext.moreDays)
          }}</span>投资收益，您确认赎回？
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitNext()">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import Foot from '@/components/foot/foot'
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  components: {
    Foot
  },
  props: {},
  data() {
    return {
      loading2: false, // 是否正在加载更多
      isRefresh: false, // 是否正在刷新
      getStatus2: false, // 是否正在数据
      pageNum: 1,
      pageSize: 10,
      currentNum: 10,
      dialogVisible: false,
      dialogVisible2: false,
      form: {
        buyNum: ''
      },
      choice: {},
      choiceNext: {},
      rule: {
        name: [{required: true, message: '不可为空', trigger: 'blur'}],
        buyNum: [
          {required: true, message: '请输入赎回份额', trigger: 'blur'},
          {validator: this.validateNumber, trigger: 'blur'}
        ]
      },
      list: [],
      total: 0, // 记录总值,
      selected: '2' // 选中
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    validateNumber(rule, value, callback) {
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      if (value <= 0) {
        return callback(new Error('输入值需大于零'))
      }
      if (value > this.choice.redemptionPortion) {
        return callback(new Error('超过最大赎回值'))
      }
      const regex = /^[1-9]\d*$/
      if (!regex.test(value)) {
        return callback(new Error('输入值需要正整数'))
      }
      callback()
    },
    handleInput(value) {
      // 使用正则表达式来判断是否为正整数
      const regex = /^[1-9]\d*$/
      // 如果输入的值不符合正整数的正则表达式，则将其设置为上一个有效值
      if (!regex.test(value)) {
        this.form.buyNum = this.form.buyNum.substring(0, this.inputValue.length - 1)
      }
    },
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.dialogVisible = false
          this.dialogVisible2 = true
        } else {
          return false
        }
      })
    },
    submitNext() {
      this.dialogVisible2 = false
      this.callRedeem()
    },
    async callRedeem() {
      let opts = {
        fuId: this.choice.fuId,
        redeemPortion: this.form.buyNum,
        userId: localStorage.getItem('wap-id')
      }
      let data = await api.redeem(opts)
      if (data.status === 0) {
        Toast('赎回成功')
        this.pageNum = 1
        this.currentNum = this.pageSize
        this.total = 0
        this.form.buyNum = ''
        await this.getList()
      } else {
        Toast(data.msg)
      }
    },
    btnShowDialog(val) {
      this.choice = val
      this.getRedeemCount()
    },
    async getRedeemCount() {
      let opts = {
        fuId: this.choice.fuId
      }
      let data = await api.redeemCount(opts)
      if (data.status === 0) {
        this.choiceNext = data.data
        this.dialogVisible = true
      } else {
        Toast(data.msg)
      }
    },
    async getList(val) {
      let opts = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        isRedeem: 0
      }
      this.getStatus2 = true
      if (this.pageNum === 1) {
        this.list = []
      }
      let data = await api.getPositionsList(opts)
      if (data.status === 0) {
        this.getStatus2 = false
        this.total = data.data.total
        const now = new Date()
        data.data.list.forEach(item => {
          const date = new Date(item.buyTime)
          const oldDate = date
          date.setDate(date.getDate() + item.blackoutPeriod)
          // 为true时表示可以回购
          item.flag = date < now
          if (item.flag) {
            let nextDay = Math.ceil(Math.abs(oldDate - now) / (1000 * 60 * 60 * 24))
            item.nextDay = item.blackoutPeriod - (nextDay % item.blackoutPeriod)
          } else {
            item.lockTime = date
          }
          this.list.push(item)
        })
      } else {
        Toast(data.msg)
      }
    },
    async loadMore() {
      if (this.list.length < this.pageSize || this.loading2 || this.total <= this.currentNum) {
        return
      }
      this.loading2 = true
      this.pageNum++
      await this.getList()
      this.currentNum = this.pageNum * this.pageSize
      this.loading2 = false
    }
  }
}
</script>
<style lang="less" scoped>
.is-selected .mint-tab-item-label:hover {
  text-decoration: none;
}

.wrapper /deep/ .mint-tab-item-label {
  font-size: 0.264rem;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 2px solid #d50000;
  text-decoration: none;
}

.mint-tab-container-item {
  // padding-top: 1.2rem;
  .mint-button--default {
    padding: 0 0.2rem;
    font-size: 0.24rem;
    height: 0.5rem;
    margin: 0.2rem 0.2rem 0;
    color: #607d8b;
    box-shadow: 0 0 1px #3b71b9;
    background: none;
  }
}

.mint-navbar {
  box-shadow: 0px 0px 4px rgba(6, 0, 1, 0.2);

  .mint-tab-item {
    // background: #21252a;
    padding: 0.2rem 0;

    &.is-selected {
      border: none;
      margin-bottom: 0;
    }

    .mint-tab-item-label {
      font-size: 0.22rem;
    }

    .iconfont {
      // display: block;
      font-size: 0.46rem;
      margin-bottom: 0.12rem;
      vertical-align: middle;
      margin-right: 0.12rem;
    }
  }
}

.sub-navbar {
  background-color: #16171D !important;
  height: .7rem;
  justify-content: center;
  box-shadow: none;

  /deep/ .mint-tab-item-label {
    font-size: .24rem;
  }

  .mint-tab-item {
    position: relative;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    width: 1.4rem;
    height: .4rem;
    background-color: #3D4456;
    padding: 0;
    line-height: .4rem;
    margin: 0.3rem .2rem 0;

    /deep/ .mint-tab-item-label {
      line-height: .4rem;
      height: .4rem;
    }

    &.is-selected {
      color: #fff;
      background-color: #138EB4;
    }
  }
}

#app.red-theme {
  .sub-navbar {
    background-color: #E9E9E9 !important;

    .mint-tab-item {
      background-color: #CCCCCC;
      color: #000;

      &.is-selected {
        color: #fff;
        background-color: #BB1815;
      }
    }
  }
}

.self-el-row {
  padding-top: 20px;
  padding-bottom: 20px;
}

.btn-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding-bottom: 20px;
}
</style>
