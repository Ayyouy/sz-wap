<template>
  <div class="wrapper">
    <div v-if="list.length <= 0" class="empty text-center">
      {{ $t('title2')}}
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
              <span class="main">{{ item.stockName }}</span>
              <span class="secondary">({{ item.stockCode }})</span>

              <span
                v-if="item.stockPlate == '科创'"
                :class="item.stockPlate == '科创' ? 'type' : ''"
                >{{ $t('title1')}}</span
              >
              <span class="pull-right"
                >{{ $t('pl')}}<b
                  :class="
                    item.allProfitAndLose < 0
                      ? 'space green'
                      : item.allProfitAndLose == 0
                      ? 'space'
                      : 'space red'
                  "
                  >{{ item.allProfitAndLose }}</b
                ></span
              >
            </div>
            <div class="order-info">
              <p class="clearfix">
                <span class="col-xs-4"
                  >{{ $t('own.price')}}<b class="space">{{ item.buyOrderPrice }}</b></span
                >
                <span class="col-xs-4 text-center"
                  >{{ $t('own.vol')}}<b class="space">{{ item.orderNum }}</b></span
                >
                <span class="col-xs-4 text-right"
                  >{{ $t('own.mkt')}}<b class="space">{{ item.orderTotalPrice }}</b></span
                >
              </p>
              <p class="clearfix">
                <span class="col-xs-4"
                  >{{ $t('sell1')}}<b class="space">{{ item.sellOrderPrice }}</b></span
                >
                <span class="col-xs-4 text-center"></span>
                <span class="col-xs-4 text-right"
                  >{{ $t('fee')}}<b class="space">{{ item.orderStayFee }}</b></span
                >
              </p>
              <p class="clearfix">
                <span class="col-xs-4"
                  >{{ $t('own.fee')}}<b class="space">{{ item.orderFee }}</b></span
                >
                <span class="col-xs-4 text-center"
                  >{{ $t('own.notice1')}}<b class="space">{{ item.orderSpread }}</b></span
                >
                <span class="col-xs-4 text-right"
                  >{{ $t('fee1')}}<b class="space">{{ item.orderStayFee }}</b></span
                >
              </p>

              <p class="clearfix">
                <span class="col-xs-5"
                  >{{ $t('day')}}<b class="space">{{ item.orderStayDays }}</b></span
                >
                <span class="col-xs-7 text-right"
                  >{{ $t('pl1')}}<b
                    :class="
                      item.profitAndLose < 0
                        ? 'space green'
                        : item.profitAndLose == 0
                        ? 'space'
                        : 'space red'
                    "
                    >{{ item.profitAndLose }}</b
                  ></span
                >
              </p>
              <p class="clearfix">
                <span class="secondary col-xs-6"
                  >{{ $t('line.buy')}}:
                  <b v-if="item.buyOrderTime">{{
                    new Date(item.buyOrderTime) | timeFormat
                  }}</b>
                  <b v-else></b>
                </span>
                <span class="secondary col-xs-6 text-right"
                  >{{ $t('sell2')}}
                  <b v-if="item.sellOrderTime">{{
                    new Date(item.sellOrderTime) | timeFormat
                  }}</b>
                  <b v-else></b>
                </span>
              </p>
            </div>
          </div>
        </li>
      </ul>
      <div v-show="loading" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
        {{ $t('market.loading')}}
      </div>
      <div v-show="!loading" class="load-all text-center">
        {{ $t('own.all')}}
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
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
    }
  },
  mounted () {
    this.getListDetail()
  },
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
