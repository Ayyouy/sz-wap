<template>
  <div class="wrapper">
    <ul class="table-list">
      <li class="title">
        <div>
          <ul class='clearfix'>
            <li class="li-title">{{ $t('choice.symbol') }}</li>
            <li class="li-base">{{ $t('choice.price') }}</li>
            <li class="li-base">{{ $t('choice.chg') }}</li>
            <li class="li-base text-center">
              {{ $t('choice.delete') }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <ul class="table-list table-list-body"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="20">
      <li class="list-body" v-for="item in list" :key="item.key">
        <div>
          <ul class="clearfix" :class="item.nowPrice-item.preclose_px<0?'green':'red'">
            <li @click='toDetail(item)' :class="item.stock_plate == '科创'?'li-title li-title-kc':'li-title'">
              <p class="name">
                {{ item.stockCode }}
              </p>
              <p class="code">
                {{ item.stockName }}
              </p>
            </li>
            <li @click='toDetail(item)' class="li-base">
              <span :style="item.nowPrice>0?'green':'red'">{{
                  item.nowPrice ? Number(item.nowPrice).toFixed(2) : '-'
                }}</span>
            </li>
            <li @click='toDetail(item)' class="li-base">
              <span v-if="item.nowPrice == 0">-</span>
              <span
                v-else :style="(item.nowPrice - item.preclose_px)>0?'green':'red'">{{
                  item.nowPrice - item.preclose_px > 0 ? '+' : ''
                }}{{
                  item.hcrate ? item.hcrate : '-'
                }}%</span>
            </li>
            <li class="li-base text-center">
              <mt-button plain @click="toDeleteMy(item)"><i class="iconfont icon-shanchucopy"></i></mt-button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div v-if="getStatus" class="text-center empty" style="margin-top: 1rem;">
      <mt-spinner type="fading-circle"></mt-spinner>
      <span style="margin-top: 0.1rem;">{{ $t('market.loading') }}</span>
    </div>
    <div v-show="!getStatus && list.length>0" class="text-center empty" style="margin-top: 1rem;">
      <span style="margin-top: 0.1rem;">{{ $t('market.loaded') }}</span>
    </div>
    <div v-show="!getStatus && list.length<=0" class="text-center empty" style="margin-top: 1rem;">
      <span style="margin-top: 0.1rem;">{{ $t('note6') }}</span>
    </div>
    <foot></foot>
  </div>
</template>

<script>
import foot from '../../components/foot/foot'
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  components: {
    foot
  },
  props: {},
  data () {
    return {
      loading: false, // 正在加载下一页
      isRefresh: false, // 正在刷新
      getStatus: false, // 正在获取数据
      list: [],
      timer: '',
      currentNum: 15,
      market: [],
      changeTextClass: {},
      pageNum: 1,
      pageSize: 15
    }
  },
  created () {
    this.timer = setInterval(this.refreshList, 5000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    this.getStock()
    this.getMarket()
  },
  methods: {
    async getMarket () {
      // 获取大盘指数
      let result = await api.getIndexMarket()
      if (result.status === 0) {
        this.market = result.data
      } else {
        Toast(result.msg)
      }
    },
    async getStock () {
      let opt = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.getStatus = true
      let data = await api.getMyList(opt)
      this.getStatus = false
      if (data.status === 0) {
        this.list = data.data.list
      } else {
        Toast(data.msg)
      }
    },
    async refreshList () {
      if (this.loading) {
        return
      }
      let opt = {
        pageNum: 1,
        pageSize: this.currentNum
      }
      this.isRefresh = true
      let data = await api.getMyList(opt)
      this.list = data.data.list
      this.isRefresh = false
    },
    async loadMore () {
      if (this.list.length < 10) {
        return
      }
      this.loading = true
      // 加载下一页
      this.pageNum++
      await this.getStock()
      this.currentNum = this.pageNum * this.pageSize
      this.loading = false
    },
    async toDeleteMy (val) {
      let data = await api.delOption({code: val.stockCode})
      if (data.status === 0) {
        // Toast('删除自选股成功')
        Toast(this.$t('line.removeSuccess'))
        await this.getStock()
      } else {
        Toast(data.msg)
      }
    },
    async getQhDetail (code, stockGid) {
      let opts = {
        futuresCode: code
      }
      let data = await api.queryFuturesByCode(opts)
      if (data.status === 0) {
        this.statusDetail = data.data
        await this.$router.push({
          path: '/listdetail2',
          query: {
            code: stockGid,
            qhinfo: this.statusDetail
          }
        })
      } else {
        Toast(data.msg)
      }
    },
    toDetail (val) {
      let code = val.stockCode
      if (val.stockGid !== undefined && val.stockGid.indexOf('hf_') !== -1) {
        this.getQhDetail(val.stockCode, val.stockGid)
      } else if (val.stockCode !== undefined && val.stockCode.substring(0, 3) === '000') {
        code = val.stockGid
        this.$router.push({
          path: '/listdetail2',
          query: {
            code: code,
            stock_type: val.stock_type,
            zsinfo: val
          }
        })
      } else {
        this.$router.push({
          path: '/listdetail2',
          query: {
            code: code,
            stock_type: val.stock_type,
            zsinfo: val
          }
        })
      }
    },
    toSearch () {
      this.$router.push('/searchmylist')
    }
  }
}
</script>
<style lang="less" scoped>
.table-list-body {
  // padding-top:0.62rem;
  // margin-top: 40px;
}

.wrapper {
  padding-top: 0.2rem;
  background-color: #16171d;
}

.account-box {
  margin-top: 0.5rem;
  background-color: #16171d;

  .box-contain {
    background-color: #16171d;
  }
}

.red-bg .table-list .title {
  //   top: 2.5rem;
}

/*大盘指数*/
.box-contain {
  min-height: 1.3rem;

  .more {
    position: absolute;
    right: 0;
    padding-top: 0.5rem;
    padding-right: 0.2rem;
    cursor: pointer;
  }

  .tab {
    float: left;
    width: 31%;
    margin: 0.05rem 1%;
    margin-top: 0;
    text-align: center;
    padding: 0.1rem 0;
    background: none !important;

    p {
      margin-top: 0.1rem;
    }

    .name {
      font-size: .22rem;
    }

    .price {
      font-size: 0.34rem;
    }

    .status {
      margin-top: 0.1rem;
      font-size: .22rem;
    }
  }
}

.table-list .title {
  top: 1rem;
}

.red-theme {
  .table-list .title {
    background-color: #E9E9E9;
    color: #222;
  }

  .wrapper {
    background-color: #E9E9E9;
  }

  .table-list ul li {
    border-bottom-color: #E9E9E9;
    background-color: #fff;
  }

  .account-box .box-contain {
    background-color: #E9E9E9;
  }

  .box-contain .tab .name {
    color: #222;
  }

  .table-list ul .li-title .name {
    color: #222;
  }

  .load-all {
    //background-color: #E9E9E9;
  }
}
</style>
