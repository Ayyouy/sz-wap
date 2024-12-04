<template>
  <div class="wrapper">
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item id="2">
        <div class="account-container">
          <div class="account-center">
            <span>{{ $t('myFund.account') }}</span>
          </div>
          <div class="account-box">
            <div class="content">
              <ul class="clearfix">
                <li>
                  <i class="iconfont icon-zijin1"></i>
                  <div class="name">{{ $t('myFund.used') }}</div>
                  <p class="number red"> ${{ Number(fundInfo.buyMoney).toFixed(2) }}</p>
                </li>
                <li>
                  <i class="iconfont icon-keyongzijin"></i>
                  <div class="name">{{ $t('myFund.available') }}</div>
                  <p class="number yellow">${{ Number(fundInfo.balance).toFixed(2) }}</p>
                </li>
                <li>
                  <i class="iconfont icon-yingkuixuanzhong"></i>
                  <div class="name">{{ $t('myFund.pl') }}</div>
                  <p class="number green">${{ Number(fundInfo.amount).toFixed(2) }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="list.length<=0 && !getStatus2" class="empty text-center">
          {{ $t('msg0') }}
        </div>
        <div v-if="list.length<=0 && getStatus2" class="empty text-center">
          <mt-spinner type="fading-circle"></mt-spinner>
          {{ $t('market.loading') }}
        </div>
        <div v-if="list.length>0">
          <ul class="order-info-box-wrap"
              v-infinite-scroll="loadMore"
              :infinite-scroll-disabled="loading2"
              infinite-scroll-distance="0">
            <li v-for="(item) in list" :key="item.id">
              <div class="order-info-box">
                <el-row class="self-el-row" style="padding-top: 0.4rem">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.order') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.orderNum }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.redemptionPortion!=0">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.total') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span style="color: #1b8e5d"> ${{ Number(item.dueIncome).toFixed(3) }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.real') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span style="color: #1b8e5d"> ${{ Number(item.income).toFixed(3) }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.name') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.fundName }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.nav') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.perValue }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.units') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.perValue * item.buyPortion }}（{{ item.buyPortion }}{{ $t('myFund.unit') }}）</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.time') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ new Date(item.buyTime) | timeFormat }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.redemptionPortion===0">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('note1') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ new Date(item.redemptionTime)| timeFormat }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.buyDays>item.blackoutPeriod">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.red') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.perValue * item.redeemedPortion }}（{{
                        item.redeemedPortion
                      }}{{ $t('myFund.unit') }}）</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.buyDays>item.blackoutPeriod">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.pos') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.perValue * item.redemptionPortion }}（{{
                        item.redemptionPortion
                      }}{{ $t('myFund.unit') }}）</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.fee') }}）</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.subscriptionFee }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.buyDays>item.blackoutPeriod">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.paid') }}）</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.backEndLoad }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.redemptionPortion!=0">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.current') }}）</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span>{{ $t('myFund.periodStart') }}）{{ item.currentPeriod }}{{ $t('myFund.periodEnd') }}）</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.redemptionPortion!=0&&item.buyDays>item.blackoutPeriod">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('myFund.days') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.lastPerDays }}{{ $t('capital.day') }}</span>
                  </el-col>
                </el-row>
                <div class="btn-bg">
                  <el-button type="info" v-if="item.redemptionPortion===0">
                    {{ $t('note2') }}
                  </el-button>
                  <el-button v-else-if="item.redemptionPortion!=0&&(item.buyDays>item.blackoutPeriod)" type="success"
                             @click="btnShowDialog(item)">
                    {{ $t('redeem.red') }}
                  </el-button>
                  <el-button v-else-if="item.redemptionPortion!=0&&(item.buyDays<=item.blackoutPeriod)" type="info">
                    {{ $t('myFund.lockStart') }}{{ new Date(item.lockEndDate) | dateFormat }}{{ $t('myFund.lockEnd') }}
                  </el-button>
                </div>
              </div>
            </li>
          </ul>
          <div v-show="loading2" class="load-all text-center">
            <mt-spinner type="fading-circle"></mt-spinner>
            {{ $t('market.loading') }}
          </div>
          <div v-show="!loading2" class="load-all text-center">
            {{ $t('market.loaded') }}
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <Foot></Foot>
    <el-dialog center top="25vh" :title="$t('redeem.red')" width="80%" :visible.sync="dialogVisible" :show-close="false"
               :close-on-click-modal="false">
      <div>
        <el-form :inline="false" :model="form" size="mini">
          <el-form-item :label="$t('redeem.units')" prop="buyNum">
            <el-input v-model="form.buyNum" :placeholder="$t('redeem.input')" type="number"
                      @input="checkNumber"></el-input>
            <div class="el-form-item__error">
              {{ checkMessage }}
            </div>
          </el-form-item>
          <span></span>
          <el-row style="margin-top: 10px;margin-bottom:10px;">
            <el-col :span="21" class="text-right">
              {{ $t('redeem.start') }}{{ choice.perValue * choice.redemptionPortion }}（{{
                choice.redemptionPortion
              }}{{ $t('myFund.unit') }}）
            </el-col>
            <el-col :span="3" class="text-right">
              <span style="color: #1ba6d0" @click="form.buyNum=choice.redemptionPortion">{{ $t('redeem.fill') }}</span>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        {{ $t('redeem.explain') }}
        <div style="margin-top: 10px;">
          {{ $t('redeem.p1') }}
          <span style="color: #1ba6d0">{{ $t('myFund.periodStart') }}{{
              choiceNext.per
            }}{{ $t('myFund.periodEnd') }}</span>
          {{ $t('redeem.p2') }}
          <span style="color: #1ba6d0">{{ choiceNext.perIncome }}</span>
          {{ $t('redeem.p3') }}
          <span style="color: #1ba6d0">{{ $t('myFund.periodStart') }}{{
              choiceNext.perLast
            }}{{ $t('myFund.periodEnd') }}</span>
          {{ $t('redeem.p4') }}
          <span style="color: #1ba6d0">{{ choiceNext.lastPerIncome }}</span>，
          {{ $t('redeem.p5') }}
          <span style="color: #1ba6d0">{{ choiceNext.blackoutPeriod - choiceNext.moreDays }}</span>
          {{ $t('redeem.p6') }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button @click="cancelDialog1">{{ $t('redeem.cancel') }}</el-button>
              <el-button type="primary" @click="submit()">{{ $t('redeem.confirm') }}</el-button>
            </span>
    </el-dialog>
    <el-dialog center top="40vh" :title="$t('redeem.redemption')" width="80%" :visible.sync="dialogVisible2">
      <div>
        {{ $t('redeem.explain') }}
        <div style="margin-top: 10px;">
          <span v-if="choiceNext.per>4">{{ $t('redeem.p9') }}</span>
          <span v-else>{{ $t('redeem.p7') }}</span>
          <span style="color: #1ba6d0">${{ buyMoney }}</span>
          {{ $t('redeem.p8') }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible2 = false">{{ $t('redeem.cancel') }}</el-button>
              <el-button type="primary" @click="submitNext()">{{ $t('redeem.confirm') }}</el-button>
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
  data () {
    return {
      loading2: false, // 是否正在加载更多
      isRefresh: false, // 是否正在刷新
      getStatus2: false, // 是否正在数据
      pageNum: 1,
      pageSize: 10,
      currentNum: 10,
      dialogVisible: false,
      dialogVisible2: false,
      checkMessage: '',
      form: {
        buyNum: ''
      },
      fundInfo: {
        amount: 0,
        balance: 0,
        buyMoney: 0
      },
      choice: {},
      choiceNext: {},
      list: [],
      total: 0, // 记录总值,
      selected: '2', // 选中
      buyMoney: ''
    }
  },
  methods: {
    checkNumber (val) {
      if (this.form.buyNum === '' || this.form.buyNum <= 0) {
        this.checkMessage = this.$t('buy.zero')
        return false
      }
      if (Number.parseInt(this.form.buyNum) > Number.parseInt(this.choice.redemptionPortion)) {
        this.checkMessage = this.$t('redeem.exceed')
        return false
      }
      const regex = /^[1-9]\d*$/
      if (!regex.test(this.form.buyNum)) {
        this.checkMessage = this.$t('note3')
        return false
      } else {
        this.checkMessage = ''
        return true
      }
    },
    cancelDialog1 () {
      this.dialogVisible = false
      this.checkMessage = ''
    },
    submit () {
      this.checkNumber(this.form.buyNum)
      if (this.checkMessage !== '') {
        return false
      } else {
        this.dialogVisible = false
        this.callRedeemLoss()
      }
    },
    async callRedeemLoss () {
      let opts = {
        fuId: this.choice.fuId,
        redeemPortion: this.form.buyNum
      }
      let data = await api.redeemCountLoss(opts)
      if (data.status === 0) {
        this.buyMoney = data.data
      } else {
        Toast(data.msg)
      }
      this.dialogVisible2 = true
    },
    submitNext () {
      this.dialogVisible2 = false
      this.callRedeem()
    },
    async callRedeem () {
      let opts = {
        fuId: this.choice.fuId,
        redeemPortion: this.form.buyNum,
        userId: localStorage.getItem('wap-id')
      }
      let data = await api.redeem(opts)
      if (data.status === 0) {
        // Toast('赎回成功')
        Toast(this.$t('redeem.success'))
        this.pageNum = 1
        this.currentNum = this.pageSize
        this.total = 0
        this.form.buyNum = ''
        await this.getList()
      } else {
        Toast(data.msg)
      }
    },
    btnShowDialog (val) {
      this.form.buyNum = ''
      this.choice = val
      this.getRedeemCount()
    },
    async getRedeemCount () {
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
    async getList () {
      let opts = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        isRedeem: -1
      }
      this.getStatus2 = true
      if (this.pageNum === 1) {
        this.list = []
      }
      let data = await api.getPositionsList(opts)
      if (data.status === 0) {
        this.getStatus2 = false
        this.total = data.data.total
        data.data.list.forEach(item => {
          // redemptionPortion= 0 // 表示已经申购完毕
          // 申购完成的时间字段：redemptionTime
          // item.buyDays > item.blackoutPeriod 通过这两个字段来判断是否在封锁期
          // lastPerDays:离本期结束天数
          // lockEndDate:解封时间
          // redemptionPortion:为0时表示已申购完毕，否则就可以申购
          if (item.redemptionPortion !== 0) {
            let days = Number(item.buyDays)
            let lock = Number(item.blackoutPeriod)
            let currentPeriod = parseInt(days / lock)
            let buyPeriod = days % lock
            if (buyPeriod !== 0) {
              currentPeriod += 1
            }
            item.currentPeriod = currentPeriod
          }
          this.list.push(item)
        })
      } else {
        Toast(data.msg)
      }
    },
    async getBalance () {
      let data = await api.getBalanceFunds({})
      if (data.status === 0) {
        this.fundInfo = data.data
      } else {
        Toast(data.msg)
      }
    },
    async loadMore () {
      if (this.list.length < this.pageSize || this.loading2 || this.total <= this.currentNum) {
        return
      }
      this.loading2 = true
      this.pageNum = this.pageNum + 1
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

.order-list {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
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
  padding-top: 10px;
  padding-bottom: 10px;
}

.btn-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding-bottom: 20px;
}
</style>
