<template>
  <div class="wrapper">
    <mt-button slot="right" class="search-btn-list" icon="search" @click="getStock">{{$t('market.search')}}</mt-button>
    <mt-search
      fixed
      show
      autofocus
      v-model="keywords"
      @keyup.enter.native="getStock"
      :placeholder="$t('market.input3')"
    >
      <ul class="table-list">
        <li class="title">
          <div>
            <ul class='clearfix'>
              <li class="li-title">{{$t('choice.symbol')}}</li>
              <li class="li-base">{{$t('choice.price')}}</li>
              <li class="li-base">{{$t('choice.chg')}}</li>
              <li class="li-base text-center">
                {{$t('choice.delete')}}
              </li>
            </ul>
          </div>

        </li>
      </ul>
      <ul class="table-list table-list-body"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10">
        <li class="list-body" v-for="item in list" :key="item.key">
          <div>
            <ul class="clearfix" :class="item.nowPrice-item.preclose_px<0?'green':'red'">
              <li @click='toDetail(item)' :class="item.stock_plate == '科创'?'li-title li-title-kc':'li-title'">
                <p class="name">
                  {{item.stockName}}
                </p>
                <p v-if="item.stock_plate == '科创'" class="code"><i class="iconfont kechuang-mark">{{$t('title1')}}</i>{{item.stockCode}}
                </p>
                <p v-else class="code">
                  <i :class="item.stock_type == 'sz'?'iconfont shen-mark hushen-mark':'iconfont hushen-mark'">{{item.stock_type
                    == 'sz'?'深':'沪'}}</i>
                  {{item.stockCode}}
                </p>
              </li>
              <li @click='toDetail(item)' class="li-base">
                <span :class="item.nowPrice-item.preclose_px<0?'green':'red'">{{item.nowPrice?Number(item.nowPrice).toFixed(2):'-'}}</span>
              </li>
              <li @click='toDetail(item)' class="li-base">
                <span v-if="item.nowPrice == 0">-</span>
                <span v-else :class="item.nowPrice-item.preclose_px<0?'green':'red'">{{item.nowPrice-item.preclose_px>0?'+':''}}{{item.hcrate?item.hcrate:'-'}}%</span>
              </li>
              <li class="li-base text-center">
                <mt-button plain @click="toDeleteMy"><i class="iconfont icon-shanchucopy"></i></mt-button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-show="loading" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
        {{$t('market.loading')}}
      </div>
      <div v-show="!loading" class="load-all text-center">
        {{$t('market.loaded')}}
      </div>
    </mt-search>
    <foot></foot>
  </div>
</template>

<script>
import foot from '../../components/foot/foot'
import { Toast } from 'mint-ui'
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
      keywords: '', // 查询
      pageNum: 1,
      pageSize: 15,
      currentNum: 15,
      hasSearch: false // 是否查询
    }
  },
  created () {
    this.timer = setInterval(this.refreshList, 5000)
  },
  beforeDestroy () {
    if (this.$state.theme === 'red') {
      document.body.classList.remove('red-bg')
      document.body.classList.add('black-bg')
    }
    clearInterval(this.timer)
  },
  mounted () {
    if (this.$state.theme === 'red') {
      document.body.classList.remove('black-bg')
      document.body.classList.add('red-bg')
    }
  },
  methods: {
    async getStock () {
      let opt = {
        keyWords: this.keywords,
        pageNum: this.pageNum,
        pageSize: 15
      }
      this.hasSearch = true
      let data = await api.getMyList(opt)
      if (data.status === 0) {
        this.list = data.data.list
      } else {
        Toast(data.msg)
      }
    },
    async refreshList () {
      // 判断是不是已经查询 或者是否正在加载下一页 是则退出，不进行刷新
      if (!this.hasSearch || this.loading) {
        return
      }
      let opt = {
        keyWords: this.keywords,
        pageNum: 1,
        pageSize: this.currentNum
      }
      let data = await api.getMyList(opt)
      this.list = data.data.list
    },
    async loadMore () {
      if (this.list.length < 10) {
        return
      }
      this.loading = true
      // 加载下一页
      this.pageNum++
      this.currentNum = this.pageNum * this.pageSize
      await this.getStock()
      this.loading = false
    },
    toDeleteMy () {
      let data = api.delOption({ code: this.$route.query.code })
      if (data.status === 0) {
        Toast(data.msg)
      } else {
        Toast(data.msg)
      }
    },
    toDetail (val) {
      // if(true){
      //     Toast('系统正在升级，暂关闭交易！')
      //     return
      // }
      // 详情
      this.$router.push({
        path: '/listdetail',
        query: {
          code: val.code,
          name: val.name
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

  .search-btn-list {
    position: fixed;
    right: 0;
    height: 28px;
    font-size: 0.25rem;
    // background: #2e3138;
    z-index: 10;
    border: none;
    box-shadow: none;
    margin-top: 8px;
  }

  .wrapper /deep/ .mint-searchbar {
    // background: #2e3138;
    position: fixed;
    width: 100%;

    .mint-searchbar-inner {
      background-color: rgba(180, 180, 180, 0.1)
    }
  }

  .red-theme {

  }
</style>
