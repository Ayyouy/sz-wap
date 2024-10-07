<template>
  <div class="wrapper">
    <div class="header">
      <mt-header fixed title="查询平仓单">
        <router-link to="/orderlist" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
    </div>
    <form target="frameFile" v-on:submit.prevent='formSubmit'>
      <mt-button slot="right" class="search-btn-list" @click="getOrderList" icon="search">搜索</mt-button>
      <mt-search
        fixed
        show
        v-model="stockCode"
        @keyup.enter.native="getOrderList"
        placeholder="可输入股票代码查询平仓单"
      >
        <div v-show="loading" class="load-all text-center">
          <mt-spinner type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <ul
          class="order-info-box-wrap"
          v-infinite-scroll="loadMore"
          :infinite-scroll-disabled="loading"
          infinite-scroll-distance="0">
          <li v-for="(item) in list" :key="item.key">
            <div class="order-info-box">
              <div class="order-title">
                <span class="main">{{ item.stockCode }}</span>
                <span class="secondary">{{ item.stockName }}</span>
                <span v-if="item.stockPlate == '科创'" :class="item.stockPlate == '科创' ? 'type' : ''">科创</span>
                <span class="pull-right">总盈亏:
                <b :class="
                  item.rateProfitAndLose > 0
                  ? 'space green'
                  : item.rateProfitAndLose == 0
                  ? 'space'
                  : 'space red'">
                  ${{ item.rateProfitAndLose }}
                </b>
              </span>
              </div>
              <div class="order-info">
                <p class="clearfix">
                  <span class="col-xs-6">买入价格:<b class="space">{{ item.stopTargetPrice }}</b></span>
                  <span class="col-xs-6">市值:<b class="space">{{ item.orderTotalPrice }}</b></span>
                </p>
                <p class="clearfix">
                  <span class="col-xs-6">实际购买价格:<b class="space">{{ item.buyOrderPrice }}</b></span>
                  <span class="col-xs-6">卖出价格:<b class="space">{{ item.sellOrderPrice }}</b></span>
                </p>
                <p class="clearfix">
                  <span class="col-xs-6">数量:<b class="space">{{ item.orderNum }}</b></span>
                  <span class="col-xs-6">手续费:<b class="space">{{ item.orderFee }}</b></span>
                </p>
                <p class="clearfix">
                  <span class="col-xs-6">封锁期:<b class="space">{{ item.lockTime / (60 * 24) }}天</b></span>
                  <span class="col-xs-6">汇率:<b class="space">{{ item.rate }}</b></span>
                </p>
                <p class="clearfix">
                  <span class="col-xs-6">印花税:<b class="space">{{ item.orderSpread }}</b></span>
                  <span class="col-xs-6">留仓费:<b class="space">{{ item.orderStayFee }}</b></span>
                </p>
                <p class="clearfix">
                  <span class="col-xs-6">留仓天数:<b class="space">{{ item.orderStayDays }}</b></span>
                  <span class="col-xs-6">浮动盈亏:
                  <b :class="
                    item.profitAndLose<0
                    ?'space green'
                    :item.profitAndLose==0
                    ?'space':'space red'">
                    {{ item.profitAndLose }}
                  </b>
                </span>
                </p>
                <p class="clearfix">
                <span class="col-xs-12">总盈亏:
                  <b v-if="item.now_price == 0">-</b>
                  <b v-else :class="
                    item.allProfitAndLose < 0
                    ? 'space red'
                    : item.allProfitAndLose >= 0
                    ? 'space'
                    : 'space green'">
                    {{ item.symnol }} {{ item.allProfitAndLose }}
                  </b>
                </span>
                </p>
                <p class="clearfix">
                <span class="secondary col-xs-6" style=" font-size: 12px;">
                  买入:
                  <b v-if="item.buyOrderTime">{{ new Date(item.buyOrderTime) | timeFormat }}</b>
                  <b v-else></b>
                </span>
                  <span class="secondary col-xs-6" style=" font-size: 12px;">
                  卖出:
                  <b v-if="item.sellOrderTime">{{ new Date(item.sellOrderTime) | timeFormat }}</b>
                  <b v-else></b>
                </span>
                </p>
              </div>
            </div>
          </li>
        </ul>
        <div v-show="!loading && hasSearch" class="load-all text-center">
          已全部加载
        </div>
        <div class="text-center" v-if="!hasSearch">
          请查询订单
        </div>
      </mt-search>
    </form>
    <iframe name='frameFile' style="display: none;"></iframe>
    <foot></foot>
  </div>
</template>

<script>
import foot from '@/components/foot/foot'
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  components: {
    foot
  },
  props: {},
  data () {
    return {
      loading: false,
      list: [],
      timer: '',
      pageNum: 1,
      pageSize: 10,
      currentNum: 10,
      hasSearch: false, // 是否查询
      stockCode: '',
      total: 0
    }
  },
  watch: {
    stockCode (newVal) {
      if (!newVal) {
        // 取消事件
        this.list = []
      } else {
        // this.getOrderList()
      }
    }
  },
  computed: {},
  created () {
    this.timer = setInterval(this.refreshList, 5000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    //   this.getStock()
  },
  methods: {
    formSubmit () {
      return false
    },
    async getOrderList () {
      // 查询持仓
      let opt = {
        state: 1,
        stockCode: this.stockCode,
        pageNum: this.pageNum,
        pageSize: 15
      }
      this.loading = true
      this.hasSearch = true
      let data = await api.getOrderList(opt)
      if (data.status === 0) {
        this.list = data.data.list
        this.total = data.data.total
      } else {
        Toast(data.msg)
      }
      this.loading = false
      document.activeElement.blur()
    },
    async refreshList () {
      // 判断是不是已经查询 或者是否正在加载下一页 是则退出，不进行刷新
      if (!this.hasSearch || this.loading) {
        return
      }
      let opt = {
        state: 1,
        stockCode: this.stockCode,
        pageNum: 1,
        pageSize: this.currentNum
      }
      let data = await api.getOrderList(opt)
      this.list = data.data.list
      this.total = data.data.total
    },
    async loadMore () {
      if (this.list.length < this.pageSize || this.total <= this.currentNum) {
        return
      }
      this.loading = true
      // 加载下一页
      this.pageNum++
      await this.getOrderList()
      this.currentNum = this.pageNum * this.pageSize
      this.loading = false
    },
    goBack () {
      this.$router.back(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.table-list-body {
  padding-top: 0.62rem;
}

.search-btn-list {
  position: fixed;
  right: 0;
  height: 40px;
  font-size: 0.25rem;
  // background: #2e3138;
  z-index: 10;
  border: none;
  box-shadow: none;
  top: 36px;
}

.order-info-box-wrap {
  margin-top: 0.9rem;
}

.wrapper /deep/ .mint-searchbar {
  // background: #2e3138;
  position: fixed;
  width: 100%;
  top: 36px;

  .mint-searchbar-inner {
    background-color: rgba(180, 180, 180, 0.1)
  }
}

</style>
