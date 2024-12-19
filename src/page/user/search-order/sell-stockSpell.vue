<template>
  <div class="wrapper">
    <div class="search">
      <div class="search-input">
        <input type="text" :placeholder="$t('own.name')" v-model="stockCode" @keyup.enter="queryList">
      </div>
      <mt-button size="small" @click="queryList" icon="search" style="background-color:#000">{{ $t('market.search') }}
      </mt-button>
    </div>
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
      {{ $t('market.loading') }}
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
  data () {
    return {
      loading: false,
      loaded: false,
      list: [],
      pageNum: 1,
      pageSize: 10,
      stockCode: '',
      total: 0
    }
  },
  watch: {
    stockCode (newVal) {
      this.list = []
      this.total = 0
      this.pageNum = 1
      this.loaded = false
    }
  },
  methods: {
    async queryList () {
      let opt = {
        state: 1,
        stockSpell: this.stockCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize
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
      document.activeElement.blur()
    },
    async loadMore () {
      if (this.loaded) {
        return
      }
      this.pageNum++
      await this.queryList()
    }
  }
}
</script>
<style lang="less" scoped>

.table-list-body {
  padding-top: 0.62rem;
}

.wrapper /deep/ .mint-searchbar {
  background: #16171d;
  position: fixed;
  width: 100%;
  top: 1rem;
  border-bottom: 1px solid #16171d;

  .mint-searchbar-inner {
    background-color: rgba(180, 180, 180, 0.1)
  }
}

.load-all {
  background-color: #16171d;
}

/deep/ .mint-search-list {
  position: relative !important;
  padding-top: 60px;
  padding-bottom: 1rem;

  .order-info-box-wrap {
    padding-bottom: 1rem;
  }
}

.search {
  display: flex;
  justify-content: space-between;
  padding: .2rem;
  position: fixed;
  width: 100%;
  background-color: #16171d;
  z-index: 1;
  top: 1rem;

  &-input {
    flex: 1;
    height: .6rem;
    background-color: #2e3138;

    input {
      height: .6rem;
      width: 100%;
      padding: .2rem;
    }
  }

  button {
    height: .6rem;
  }
}

.order-info-box-wrap {
  padding-top: 1rem;
}
</style>
