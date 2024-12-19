<template>
  <div class="wrapper">
    <div>
      <ul
        class="order-info-box-wrap"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="loading"
        infinite-scroll-distance="0">
        <li v-for="item in list" :key="item.key">
          <div class="order-info-box">
            <div class="order-title">
              <span class="main">{{ item.stockCode }}</span>
              <span class="secondary">{{ item.stockName }}</span>
              <span v-if="item.stockPlate == '科创'"
                    :class="item.stockPlate == '科创' ? 'type' : ''">{{ $t('title1') }}</span>
              <span class="pull-right">{{ $t('own.notice4') }}
                <b :class="
                  item.rateProfitAndLose > 0
                  ? 'space green'
                  : item.rateProfitAndLose == 0
                  ? 'space'
                  : 'space red'">
                  ${{ Number(item.rateProfitAndLose).toFixed(2) }}
                </b>
              </span>
            </div>
            <div class="order-info">
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.price') }}
                  <b class="space">{{ Number(item.stopTargetPrice).toFixed(2) }}</b></span>
                <span class="col-xs-6">{{ $t('own.mkt') }}
                  <b class="space">{{ item.orderTotalPrice }}</b></span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.actual') }}
                  <b class="space">{{ Number(item.buyOrderPrice).toFixed(2) }}</b></span>
                <span class="col-xs-6">{{ $t('sell4') }}
                  <b class="space">{{ Number(item.sellOrderPrice).toFixed(2) }}</b></span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.vol') }}
                  <b class="space">{{ item.orderNum }}</b></span>
                <span class="col-xs-6">{{ $t('own.fee') }}
                  <b class="space">{{ Number(item.orderFee).toFixed(2) }}</b></span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.lock') }}<b class="space">
                  {{ item.lockTime / (60 * 24) }}{{ $t('capital.day') }}</b></span>
                <span class="col-xs-6">{{ $t('own.fx') }}
                  <b class="space">{{ Number(item.rate).toFixed(2) }}</b></span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.notice1') }}
                  <b class="space">{{ Number(item.orderSpread).toFixed(2) }}</b></span>
                <span class="col-xs-6">{{ $t('own.notice2') }}
                  <b class="space">{{ Number(item.orderStayFee).toFixed(2) }}</b></span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('day') }}<b class="space">{{ item.orderStayDays }}</b></span>
                <span class="col-xs-6">{{ $t('pl1') }}
                  <b :class="
                    item.profitAndLose<0
                    ?'space green'
                    :item.profitAndLose==0
                    ?'space':'space red'">
                    {{ Number(item.profitAndLose).toFixed(2) }}
                  </b>
                </span>
              </p>
              <p class="clearfix">
                <span class="col-xs-12">{{ $t('pl') }}
                  <b v-if="item.now_price == 0">-</b>
                  <b v-else :class="
                    item.allProfitAndLose < 0
                    ? 'space red'
                    : item.allProfitAndLose >= 0
                    ? 'space'
                    : 'space green'">
                    {{ item.symnol }} {{ Number(item.allProfitAndLose).toFixed(2) }}
                  </b>
                </span>
              </p>
            </div>
            <div class="order-foot">
              <div
                style="text-align: left;color: #666;padding: 0;font-size: 12px;"
                class="col-xs-6">
                <div v-if="item.buyOrderTime">{{ $t('own.buy') }}
                </div>
              </div>
              <div
                style="text-align: left;color: #666;padding: 0;font-size: 12px;"
                class="col-xs-6">
                <div v-if="item.sellOrderTime">{{ $t('sell2') }}</div>
              </div>
            </div>
            <div class="order-foot">
              <div
                style="text-align: left;color: #666;padding: 0;font-size: 12px;"
                class="col-xs-6">
                <span v-if="item.buyOrderTime">
                  {{ new Date(item.buyOrderTime) | timeFormat }}
                </span>
              </div>
              <div
                style="text-align: left;color: #666;padding: 0;font-size: 12px;"
                class="col-xs-6">
                <span v-if="item.sellOrderTime">{{
                    new Date(item.sellOrderTime) | timeFormat
                  }}
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-show="loading" class="load-all text-center">
      <mt-spinner type="fading-circle"></mt-spinner>
    </div>
    <div v-show="loaded && list.length>0" class="load-all text-center">
      {{ $t('market.loaded') }}
    </div>
    <div v-show="loaded && list.length==0" class="load-all text-center">
      {{ $t('market.empty') }}
    </div>
  </div>
</template>

<script>
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  props: {
    selected: {
      type: String
    },
    country: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      loaded: false,
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    selected (val) {
      if (val === '2') {
        this.list = []
        this.total = 0
        this.pageNum = 1
        this.loaded = false
        this.getListDetail()
      }
    }
  },
  methods: {
    async loadMore () {
      if (this.loaded) {
        return
      }
      this.pageNum++
      await this.getListDetail()
    },
    async getListDetail () {
      let opt = {
        state: 1,
        stockCode: '', // 代码
        stockSpell: '', // 简拼
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        countryId: this.country
      }
      this.loading = true
      let data = await api.getOrderList(opt)
      if (data.status === 0) {
        data.data.list.forEach(item => {
          this.list.push(item)
        })
        this.total = data.data.total
        this.loaded = this.pageNum * this.pageSize >= this.total
      } else {
        Toast(data.msg)
      }
      this.loading = false
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
    margin-top: .8rem;
    background-color: #bb1815;
    color: #fff;
  }
}

.load-all {
  margin-top: .8rem;
  background-color: #21252a;
}
</style>
