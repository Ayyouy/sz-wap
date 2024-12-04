<template>
  <div class="wrapper">
    <div v-if="list.length <= 0 && !getStatus" class="empty text-center">
      {{ $t('title2') }}
    </div>
    <div v-if="list.length <= 0 && getStatus" class="empty text-center">
      <mt-spinner type="fading-circle"></mt-spinner>
      {{ $t('market.loading') }}
    </div>
    <div v-if="list.length > 0">
      <ul
        class="order-info-box-wrap"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="loading"
        infinite-scroll-distance="0"
      >
        <li v-for="item in list" :key="item.key">
          <div class="order-info-box">
            <div class="order-title">
              <span @click="toDetail(item.stockCode)" class="main">{{
                  item.stockName
                }}</span>
              <span class="secondary">({{ item.stockCode }})</span>
              <span
                v-if="item.stockPlate == '科创'"
                :class="item.stockPlate == '科创' ? 'type' : ''"
              >{{ $t('title1') }}</span>
              <span class="direction pull-right big-font">
                {{ $t('market.price') }}:
                <b v-if="item.now_price == 0">-</b>
                <b
                  v-else
                  :class="
                    item.now_price - item.buyOrderPrice < 0
                      ? 'space green'
                      : item.now_price - item.buyOrderPrice == 0
                      ? 'space'
                      : 'space red'
                  "
                >{{ item.now_price }}</b
                >
              </span>
            </div>
            <div class="order-info">
              <p class="clearfix">
                <span class="col-xs-4"
                >{{ $t('own.price') }}<b class="space">{{ item.buyOrderPrice }}</b></span
                >
                <span class="col-xs-4 text-center"
                >{{ $t('own.vol') }}<b class="space">{{ item.orderNum }}</b></span
                >
                <span class="col-xs-4 text-right"
                >{{ $t('own.mkt') }}<b class="space">{{ item.orderTotalPrice }}</b></span
                >
              </p>
              <p class="clearfix">
                <span class="col-xs-4"
                >{{ $t('own.fee') }}<b class="space">{{ item.orderFee }}</b></span
                >
                <span class="col-xs-4 text-center"
                >{{ $t('own.notice1') }}<b class="space">{{ item.orderSpread }}</b></span
                >
                <span class="col-xs-4 text-right"
                >{{ $t('fee1') }}<b class="space">{{ item.orderStayFee }}</b></span
                >
              </p>
              <p class="clearfix">
                <span class="col-xs-4"
                >{{ $t('fee') }}<b class="space">{{ item.spreadRatePrice }}</b></span
                >
                <span class="col-xs-4 text-center"
                >{{ $t('pl1') }}
                  <b v-if="item.now_price == 0">-</b>
                  <b
                    v-else
                    :class="
                      item.profitAndLose < 0
                        ? 'space red'
                        : item.profitAndLose >= 0
                        ? 'space'
                        : 'space green'
                    "
                  >{{ item.profitAndLose }}</b
                  >
                </span>
                <span class="col-xs-4 text-right big-font"
                >{{ $t('pl') }}
                  <b v-if="item.now_price == 0">-</b>
                  <b
                    v-else
                    :class="
                      item.allProfitAndLose < 0
                        ? 'space red'
                        : item.allProfitAndLose >= 0
                        ? 'space'
                        : 'space green'
                    "
                  >{{ item.allProfitAndLose }}</b
                  >
                </span>
              </p>
            </div>
            <div class="order-foot clearfix">
              <div
                style="text-align: left;color: #666;padding: 0;"
                class="col-xs-6"
              >
                <b v-if="item.buyOrderTime">{{
                    new Date(item.buyOrderTime) | timeFormat
                  }}</b>
                <b v-else></b>
              </div>
              <div @click="sell(item.positionSn)" class="foot-btn">
                <i class="font-icon"></i>
                {{ $t('sell') }}
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-show="loading" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
        {{ $t('market.loading') }}
      </div>
      <div v-show="!loading" class="load-all text-center">
        {{ $t('market.loaded') }}
      </div>
    </div>
  </div>
</template>

<script>
import {Toast, MessageBox} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  props: {
    handleOptions: {
      type: Function,
      default: function () {
      }
    },
    selectedNumber: {
      type: String
    }
  },
  data () {
    return {
      loading: false, // 是否正在加载更多
      isRefresh: false, // 是否正在刷新
      getStatus: false, // 是否正在数据
      pageNum: 1,
      pageSize: 10,
      currentNum: 10,
      list: [],
      total: 0, // 记录总值
      hasChangeSell: false // 平仓状态改变
    }
  },
  watch: {
    selectedNumber (val) {
      if (!this.$store.state.userInfo.idCard) {
        this.getUserInfo()
      }
      this.getListDetail()
      clearInterval(this.timer)
      this.timer = setInterval(this.refreshList, 5000)
    }
  },
  created () {
    this.timer = setInterval(this.refreshList, 5000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    if (!this.$store.state.userInfo.idCard) {
      this.getUserInfo()
    }
    this.getListDetail()
  },
  methods: {
    async getUserInfo () {
      // 获取用户信息
      let data = await api.getUserInfo()
      if (data.status === 0) {
        this.$store.state.userInfo = data.data
      } else {
        Toast(data.msg)
      }
    },
    async loadMore () {
      // 1、总数小于 该次查询的总页数 不进行加载更多 （无下一页）
      // 2、当页加载数据还未加载完 不进行下一个加载
      if (
        this.list.length < this.pageSize ||
        this.loading ||
        this.total <= this.currentNum
      ) {
        return
      }
      this.loading = true
      // 加载下一页
      this.pageNum++
      await this.getListDetail()
      this.currentNum = this.pageNum * this.pageSize
      this.loading = false
    },
    async getListDetail () {
      let opt = {
        state: 0,
        stockCode: '', // 代码
        stockSpell: '', // 简拼
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        countryId: this.selectedNumber
      }
      this.getStatus = true
      if (this.pageNum === 1) {
        this.list = []
      }
      let data = await api.getOrderList(opt)
      if (data.status === 0) {
        data.data.list.forEach(element => {
          this.list.push(element)
        })
        this.getStatus = false
        this.total = data.data.total
      } else {
        Toast(data.msg)
      }
    },
    async refreshList () {
      // 判断是不是已经查询 或者是否正在加载下一页 是则退出，不进行刷新
      if (this.loading) {
        return
      }
      let opt = {
        state: 0,
        stockCode: '', // 代码
        stockSpell: '', // 简拼
        pageNum: 1,
        pageSize: this.currentNum
      }
      this.isRefresh = true
      let data = await api.getOrderList(opt)
      this.isRefresh = false
      this.total = data.data.total
      this.list = data.data.list
    },
    canBuyStatus () {
      let dataTime = new Date()
      let day = dataTime.getDay() // 星期几
      let hour = dataTime.getHours() // 小时
      let minute = dataTime.getMinutes() // 分钟
      if (day === 6 || day === 7) {
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
    sell (val) {
      // if(!this.canBuyStatus()){
      //     Toast('不在开盘时间内，暂不能交易！')
      //     return
      // }
      MessageBox.confirm(this.$t('title')).then(async action => {
        let opt = {
          positionSn: val
        }
        let data = await api.sell(opt)
        if (data.status === 0) {
          Toast(data.msg)
          this.hasChangeSell = true
          this.handleOptions(this.hasChangeSell)
          await this.getListDetail()
        } else {
          Toast(data.msg)
        }
      })
    },
    toDetail (code) {
      this.$router.push({
        path: '/listdetail',
        query: {
          code: code
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  padding-bottom: 0;
}

.col-xs-3 .iconfont {
  font-size: 0.22rem;
}

#app.red-theme {
  .order-info-box {
    background-color: #fff;

    .order-title {
      .main {
        color: #000;
      }
    }

    .order-info {
      color: #000;
    }
  }

  .order-foot {
    border-top-color: #ccc;
  }

  .load-all {
    background-color: #bb1815;
    color: #fff;
  }

  .empty {
    background-color: #e9e9e9;
    color: #000;
  }
}
</style>
