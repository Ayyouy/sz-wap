<template>
  <div class="wrapper">
    <div class="search">
      <div class="search-input">
        <input type="text" placeholder="可输入股票简拼查询持仓" v-model="stockCode" @keyup.enter="getOrderList">
      </div>
      <mt-button size="small" @click="getOrderList" icon="search" style="background-color:#000">搜索</mt-button>
    </div>
    <div class="">
      <ul
        class="order-info-box-wrap"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="loading"
        infinite-scroll-distance="0">
        <li v-for="(item) in list" :key="item.key">
          <div class="order-info-box">
            <div class="order-title">
              <span @click="toDetail(item.stockCode)" class="main">{{ item.stockCode }}</span>
              <span class="secondary">({{ item.stockName }})</span>
              <span v-if="item.stockPlate=='科创'" :class="item.stockPlate=='科创'?'type':''">科创</span>
              <span class="direction pull-right big-font">
                <b v-if="item.now_price == 0">-</b>
                <b v-else :class="
                   (item.now_price-item.buyOrderPrice)>0
                   ?'space green'
                   :(item.now_price-item.buyOrderPrice)==0
                   ?'space'
                   :'space red'">{{ item.now_price }}
                </b>
              </span>
            </div>
            <div class="order-info">
              <p class="clearfix">
                <span class="col-xs-6">买入价格:<b class="space">{{ item.stopTargetPrice }}</b></span>
                <span class="col-xs-6">折扣率:<b class="space">{{ (item.discount * 100).toFixed(2) }}%</b></span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">实际购买价格:<b class="space">{{ item.buyOrderPrice }}</b></span>
                <span class="col-xs-6">数量:<b class="space">{{ item.orderNum }}</b></span>
              </p>
              <p class="clearfix">
                <span class="col-xs-6">手续费:<b class="space">{{ item.orderFee }}</b></span>
                <span class="col-xs-6">市值:<b class="space">{{ item.orderTotalPrice }}</b></span>
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
                <span class="col-xs-6">浮动盈亏:
                    <b v-if="item.now_price == 0">-</b>
                    <b v-else :class="
                       item.rateProfitAndLose<0
                       ?'space red'
                       :item.rateProfitAndLose>=0
                       ?'space'
                       :'space green'">
                      {{ item.symnol }} {{ item.rateProfitAndLose }}
                    </b>
                </span>
                <span class="col-xs-6">总盈亏:
                    <b v-if="item.now_price == 0">-</b>
                    <b v-else :class="
                    item.allProfitAndLose < 0
                        ? 'space red'
                        : item.allProfitAndLose >= 0
                        ? 'space'
                        : 'space green'">
                    ${{ item.allProfitAndLose }}
                    </b>
                </span>
              </p>
            </div>
            <div class="order-foot clearfix">
              <div style="text-align: left;color: #666;padding: 0;" class="col-xs-6">
                <b v-if="item.buyOrderTime">{{ new Date(item.buyOrderTime) | timeFormat }}</b>
                <b v-else></b>
              </div>
              <div @click="sell(item.positionSn)" class="foot-btn">
                <i class='font-icon'></i>
                我要卖出
              </div>
            </div>
          </div>
        </li>
      </ul>

    </div>
    <div v-show="loading" class="load-all text-center">
      <mt-spinner type="fading-circle"></mt-spinner>
      加载中...
    </div>
    <div v-show="!loading && hasSearch" class="load-all text-center">
      已全部加载
    </div>
    <div class="text-center" v-if="!hasSearch">
      请查询订单
    </div>
    <foot></foot>
  </div>
</template>

<script>
import foot from '@/components/foot/foot'
import {Toast, MessageBox} from 'mint-ui'
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
      }
    }
  },
  methods: {
    async getOrderList () {
      // 查询持仓
      let opt = {
        state: 0,
        stockSpell: this.stockCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.pageNum === 1) {
        this.list = []
        this.total = 0
      }
      this.loading = true
      this.hasSearch = true
      let data = await api.getOrderList(opt)
      if (data.status === 0) {
        data.data.list.forEach(item => {
          this.list.push(item)
        })
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
      this.pageNum = 1
      await this.getOrderList()
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
      this.$router.back()
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
      if (!this.$store.state.userInfo.idCard) {
        Toast('您还未实名认证,请先实名认证了再下单')
        this.$router.push('/authentication')
        return
      }
      MessageBox.confirm('您确定要平仓吗?').then(async action => {
        let opt = {
          positionSn: val
        }
        let data = await api.sell(opt)
        if (data.status === 0) {
          Toast(data.msg)
          this.hasChangeSell = true
          this.handleOptions(this.hasChangeSell)
          this.getListDetail()
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
.table-list-body {
  padding-top: 0.62rem;
}

// .order-info-box-wrap {
//   margin-top: 0.9rem;
// }

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
