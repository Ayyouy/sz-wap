<template>
  <div class="wrapper">
    <div v-if="list.length<=0" class="empty text-center">
      {{ $t('title2') }}
    </div>
    <div v-if="list.length>0">
      <ul
        class="order-info-box-wrap"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li v-for="item in list" :key="item.key">
          <div class="order-info-box">
            <div class="order-title">
              <span class="main">{{item.indexName}}</span>
              <span class="secondary">({{item.indexCode}})</span>

              <span class="pull-right">{{ $t('pl') }}<b
                :class="item.allProfitAndLose<0?'space green':item.allProfitAndLose==0?'space':'space red'">{{item.allProfitAndLose}}</b></span>
            </div>
            <div class="order-info">
              <div class="table-title clearfix">
                <span class="col-xs-4">{{ $t('line.buy') }}/{{ $t('sell3') }}</span>
                <span class="col-xs-4">{{ $t('number') }}({{ $t('order.lot') }})/{{ $t('money1') }}</span>
                <span class="col-xs-4">{{ $t('fee2') }}/{{ $t('pl2') }}</span>
              </div>
              <div class="table-value clearfix">
                <div class="col-xs-4">
                  <p>{{item.buyOrderPrice}}</p>
                  <p>{{item.sellOrderPrice}}</p>
                </div>
                <div class="col-xs-4">
                  <p>{{item.orderNum}}</p>
                  <p>{{item.allDepositAmt}}</p>
                </div>
                <div class="col-xs-4">
                  <p>{{item.orderFee}}</p>
                  <p>{{item.profitAndLose}}</p>
                </div>
              </div>
              <p class="clearfix">
                        <span class="secondary col-xs-6">{{$t('own.buy')}}
                            <b v-if="item.buyOrderTime">{{new Date(item.buyOrderTime) | timeFormat}}</b>
                            <b v-else></b>
                        </span>
                <span class="secondary col-xs-6 text-right">{{$t('sell2')}}
                            <b v-if="item.sellOrderTime">{{new Date(item.sellOrderTime) | timeFormat}}</b>
                            <b v-else></b>
                        </span>
              </p>
            </div>
          </div>
        </li>
      </ul>
      <div v-show="loading" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
        {{ $t('market.loading') }}
      </div>
      <div v-show="!loading" class="load-all text-center">
        {{ $t('own.all') }}
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
      if (this.list.length < this.pageSize || this.loading || this.total <= this.currentNum) {
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
        pageSize: this.pageSize
      }
      let data = await api.getIndexOrderList(opt)
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
    padding-bottom: 0
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

  .table-title {
    font-size: 0.22rem;
    line-height: 0.4rem;
    margin-bottom: 0.1rem;

    .col-xs-4 {
      padding: 0;
    }
  }

  .table-value {
    .col-xs-4 {
      padding: 0;

      p {
        padding: 0;
        line-height: 0.32rem;
      }
    }
  }

  #app.red-theme{
    .order-info-box{
      background-color: #fff;
      .order-title{
        .main {
          color: #000;
        }
      }
      .order-info{
        color: #000;
      }
    }
    .order-foot {
      border-top-color: #ccc;
    }
    .load-all{
      background-color: #BB1815;
      color: #fff;
    }
    .empty{
      background-color: #fff;
      color: #000;
    }
  }

</style>
