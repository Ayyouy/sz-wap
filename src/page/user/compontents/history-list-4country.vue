<template>
  <div class="wrapper">
    <div v-if="list.length <= 0" class="empty text-center">
      暂无订单信息!
    </div>
    <div v-if="list.length > 0">
      <ul
        class="order-info-box-wrap"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <li v-for="item in list" :key="item.key">
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
      <div v-show="loading" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
        加载中...
      </div>
      <div v-show="!loading" class="load-all text-center">
        已全部加载
      </div>
    </div>
  </div>
</template>

<script>
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  components: {},
  props: {
    selectedNumber: {
      type: String
    },
    hasChangeSell: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      currentNum: 0,
      list: [],
      total: 0 // 记录总值
    }
  },
  watch: {
    hasChangeSell (newval) {
      if (newval) {
        this.list = []
        this.getListDetail()
      }
    },
    selectedNumber (newval) {
      if (newval) {
        this.list = []
        this.getListDetail()
      }
    }
  },
  // mounted () {
  //   this.getListDetail()
  // },
  methods: {
    async loadMore () {
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
        state: 1,
        stockCode: '', // 代码
        stockSpell: '', // 简拼
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        countryId: this.selectedNumber
      }
      let data = await api.getOrderList(opt)
      if (data.status === 0) {
        data.data.list.forEach(element => {
          this.list.push(element)
        })
        this.total = data.data.total
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

.order-title {
  .icon--kulian {
    font-size: 0.7rem;
    color: #006b96;
  }

  .icon-xiaolian {
    font-size: 0.6rem;
    color: #d50000;
  }

  .icon-pingchanglian {
    font-size: 0.6rem;
    color: #ddd;
  }
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
}
</style>
