<template>
  <div class="wrapper">
    <mt-button slot="right" class="search-btn-list" icon="search" @click="getListMarket">
      {{ $t('market.search') }}
    </mt-button>
    <mt-search
      fixed
      show
      autofocus
      v-model="keywords"
      @keyup.enter.native="getListMarket"
      :placeholder="$t('market.input')">
      <ul class="table-list">
        <li class="title">
          <div>
            <ul class='clearfix'>
              <li class="li-title">{{ $t('market.index') }}</li>
              <li class="li-base">{{ $t('market.price') }}</li>
              <li class="li-base">{{ $t('market.chg') }}</li>
              <li class="li-base">{{ $t('market.change') }}</li>
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
            <ul class="clearfix"
                :class="item.nowPrice-item.preclose_px<0?'green':item.nowPrice-item.preclose_px==0?'':'red'"
                @click='toDetail(item)'>
              <li class="li-title">
                <p class="name"><i class="iconfont icon-r red"></i>{{ item.name }}</p>
                <p class="code">{{ item.code }}</p>
              </li>
              <li class="li-base">
                <span>{{ item.nowPrice ? Number(item.nowPrice).toFixed(2) : '-' }}</span>
              </li>
              <li class="li-base">
                <span v-if="item.nowPrice == 0">-</span>
                <span
                  v-else>{{ item.nowPrice - item.preclose_px > 0 ? '+' : '' }} {{ item.hcrate ? item.hcrate : '0' }}%</span>
              </li>
              <li class="li-base no-bold">
                <span v-if="item.nowPrice == 0">-</span>
                <span
                  v-else>{{ item.nowPrice - item.preclose_px > 0 ? '+' : '' }}{{ (item.nowPrice - item.preclose_px).toFixed(2) }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-show="loading" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
        {{ $t('market.loading') }}
      </div>
      <div v-show="!loading && hasSearch" class="load-all text-center">
        {{ $t('market.loaded') }}
      </div>
      <div v-show="!hasSearch" class="load-all text-center">
        {{ $t('market.input2') }}
      </div>
    </mt-search>
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
      loading: false,
      keywords: '',
      pageNum: 1,
      pageSize: 15,
      list: [],
      timer: '',
      currentNum: 15,
      hasSearch: false // 是否查询
    }
  },
  watch: {
    keywords (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getListMarket()
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
  methods: {
    async getListMarket () {
      let opt = {
        keyWords: this.keywords,
        pageNum: this.pageNum,
        pageSize: 15
      }
      this.hasSearch = true
      let data = await api.getListMarket(opt)
      if (data.status === 0) {
        data.data.forEach(element => {
          this.list.push(element)
        })
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
      let data = await api.getListMarket(opt)
      this.list = data.data
    },
    async loadMore () {
      if (this.list.length < 10) {
        return
      }
      this.loading = true
      // 加载下一页
      this.pageNum++
      this.currentNum = this.pageNum * this.pageSize
      await this.getListMarket()
      this.loading = false
    },
    toDetail (val) {
      // 详情
      this.$router.push({
        path: '/listdetail',
        query: {
          code: val.code
          // name: val.name
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

.table-list {
  .li-title {
    width: 34%;

  }

  .li-base {
    width: 22%;
    text-align: center;

    &.no-bold {
      span {
        font-weight: 400;
      }
    }
  }
}

.search-btn-list {
  position: fixed;
  right: 0;
  height: 42px;
  font-size: 0.25rem;
  z-index: 10;
  border: none;
  box-shadow: none;
}

.wrapper /deep/ .mint-searchbar {
  background: #2e3138;
  position: fixed;
  width: 100%;

  .mint-searchbar-inner {
    background-color: rgba(180, 180, 180, 0.1)
  }
}

</style>
