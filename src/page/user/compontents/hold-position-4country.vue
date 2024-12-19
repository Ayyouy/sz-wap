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
              <span @click="toDetail(item.stockCode)" class="main">
                {{ item.stockCode }}
              </span>
              <span class="secondary">{{ item.stockName }}</span>
              <span v-if="item.stockPlate == '科创'"
                    :class="item.stockPlate == '科创' ? 'type' : ''">{{ $t('title1') }}</span>
              <span class="direction pull-right big-font" v-show="item.nowPrice">
                <b v-if="item.now_price == 0">-</b>
                <b v-else
                   :class="
                   (item.now_price - item.buyOrderPrice) > 0
                      ? 'space green'
                      : item.now_price - item.buyOrderPrice == 0
                      ? 'space'
                      : 'space red'">{{ Number(item.now_price).toFixed(2) }}
                </b>
              </span>
            </div>
            <div class="order-info">
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.price') }}
                  <b class="space">
                    {{ Number(item.stopTargetPrice).toFixed(2) }}
                  </b>
                </span>
                <span class="col-xs-6">{{ $t('own.rate') }}
                  <b class="space">
                    {{ Number(item.discount * 100).toFixed(2) }}%
                  </b>
                </span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.actual') }}
                  <b class="space">
                    {{ Number(item.buyOrderPrice).toFixed(2) }}
                  </b>
                </span>
                <span class="col-xs-6">{{ $t('own.vol') }}
                  <b class="space">
                    {{ item.orderNum }}
                  </b>
                </span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.fee') }}
                  <b class="space">
                    {{ Number(item.orderFee).toFixed(2) }}
                  </b>
                </span>
                <span class="col-xs-6">{{ $t('own.mkt') }}
                  <b class="space">
                    {{ Number(item.orderTotalPrice).toFixed(2) }}
                  </b>
                </span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.lock') }}
                  <b class="space">
                    {{ item.lockTime / (60 * 24) }}{{ $t('capital.day') }}
                  </b>
                </span>
                <span class="col-xs-6">{{ $t('own.fx') }}
                  <b class="space">
                    {{ Number(item.rate).toFixed(2) }}
                  </b>
                </span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.notice1') }}
                  <b class="space">
                    {{ Number(item.orderSpread).toFixed(2) }}
                  </b>
                </span>
                <span class="col-xs-6">{{ $t('own.notice2') }}
                  <b class="space">
                    {{ Number(item.orderStayFee).toFixed(2) }}
                  </b>
                </span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">{{ $t('own.notice3') }}
                  <b v-if="item.now_price == 0">-</b>
                  <b v-else :class="
                     item.rateProfitAndLose < 0
                     ? 'space red'
                     : item.rateProfitAndLose >= 0
                     ? 'space'
                     : 'space green'">
                    {{ item.symnol }} {{ Number(item.rateProfitAndLose).toFixed(2) }}
                  </b>
                </span>
                <span class="col-xs-6">{{ $t('own.notice4') }}
                  <b v-if="item.now_price == 0">-</b>
                  <b v-else :class="
                      item.allProfitAndLose < 0
                        ? 'space red'
                        : item.allProfitAndLose >= 0
                        ? 'space'
                        : 'space green'">
                    ${{ Number(item.allProfitAndLose).toFixed(2) }}
                  </b>
                </span>
              </p>
            </div>
            <div class="order-foot">
              <div
                style="text-align: left;color: #666;padding: 0;font-size: 12px;"
                class="col-xs-6">
                {{ $t('own.buy') }}
              </div>
              <div
                style="text-align: left;color: #666;padding: 0;font-size: 12px;"
                class="col-xs-6">
                {{ $t('own.unlock') }}
              </div>
            </div>
            <div class="order-foot">
              <div
                style="text-align: left;color: #666;padding: 0;font-size: 12px;"
                class="col-xs-6">
                <span v-if="item.buyOrderTime"> {{ new Date(item.buyOrderTime) | timeFormat }}</span>
              </div>
              <div
                style="text-align: left;color: #666;padding: 0;font-size: 12px;"
                class="col-xs-6">
                <span v-if="item.unlockTime"> {{ new Date(item.unlockTime) | timeFormat }}</span>
              </div>
            </div>
            <div class="order-foot clearfix">
              <div @click="sell(item.positionSn)" class="foot-btn">
                <i class="font-icon"></i>
                {{ $t('own.closes') }}
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
import {Toast, MessageBox} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  props: {
    selected: {
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
      this.list = []
      this.total = 0
      this.pageNum = 1
      this.loaded = false
      this.getListDetail()
      if (!this.$store.state.userInfo.idCard) {
        this.getUserInfo()
      }
    }
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
      if (this.loaded) {
        return
      }
      this.pageNum++
      await this.getListDetail()
    },
    async getListDetail () {
      let opt = {
        state: 0,
        stockCode: '', // 代码
        stockSpell: '', // 简拼
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        countryId: this.selected
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
    },
    sell (val) {
      MessageBox.confirm(this.$t('title')).then(async action => {
        let opt = {
          positionSn: val
        }
        let data = await api.sell(opt)
        if (data.status === 0) {
          Toast(data.msg)
          this.list = []
          this.total = 0
          this.pageNum = 1
          this.loaded = false
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
    margin-top: .8rem;
    background-color: #bb1815;
    color: #fff;
  }

  .empty {
    background-color: #e9e9e9;
    color: #000;
  }
}

.load-all {
  margin-top: .8rem;
  background-color: #21252a;
}
</style>
