<template>
  <div class="wrapper">
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item id="1">
        <div v-if="list.length<=0 && !getStatus" class="empty text-center">
          {{ $t('note5') }}
        </div>
        <div v-if="list.length<=0 && getStatus" class="empty text-center">
          <mt-spinner type="fading-circle"></mt-spinner>
          {{ $t('market.loading') }}
        </div>
        <div v-if="list.length>0">
          <ul class="order-info-box-wrap"
              v-infinite-scroll="loadMore"
              :infinite-scroll-disabled="loading"
              infinite-scroll-distance="0">
            <li v-for="(item) in list" :key="item.id">
              <div class="order-info-box" @click="btnFundDetailView(item.id)">
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-center">
                    <span
                      style="font-size: 30px;color: #1b8e5d;line-height: 30px;height: 30px;">{{
                        item.annualizedReturn
                      }}%</span>
                  </el-col>
                  <el-col :span="16" class="text-center fund-name-custom">
                    {{ item.name }}
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-center">
                    {{ $t('fundList.aar') }}
                  </el-col>
                  <el-col :span="16" class="text-center">
                    {{ $t('fundList.nav') }}${{ item.perValue }}
                    <span style="margin-left: 30px">
                      {{ $t('fundList.ndp') }}
                      {{ item.blackoutPeriod }}
                      {{ $t('capital.day') }}
                    </span>
                  </el-col>
                </el-row>
              </div>
            </li>
          </ul>
          <div v-show="loading" class="load-all text-center">
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div v-show="!loading" class="load-all text-center">
            {{ $t('market.loaded') }}
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <Foot></Foot>
  </div>
</template>

<script>
import Foot from '@/components/foot/foot'
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  components: {
    Foot
  },
  data () {
    return {
      loading: false, // 是否正在加载更多
      isRefresh: false, // 是否正在刷新
      getStatus: false, // 是否正在数据
      pageNum: 1,
      pageSize: 10,
      currentNum: 10,
      list: [],
      total: 0, // 记录总值,
      selected: '1' // 选中
    }
  },
  methods: {
    async getList () {
      let opts = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        state: 0
      }
      this.getStatus = true
      if (this.pageNum === 1) {
        this.list = []
      }
      let data = await api.getFundsNewList(opts)
      if (data.status === 0) {
        this.getStatus = false
        this.total = data.data.total
        data.data.list.forEach(item => {
          this.list.push(item)
        })
      } else {
        Toast(data.msg)
      }
    },
    async loadMore () {
      if (this.list.length < this.pageSize || this.loading || this.total <= this.currentNum) {
        return
      }
      this.loading = true
      this.pageNum = this.pageNum + 1
      await this.getList()
      this.currentNum = this.pageNum * this.pageSize
      this.loading = false
    },
    async btnFundDetailView (val) {
      let opts = {
        userId: localStorage.getItem('wap-id')
      }
      let data = await api.wallets(opts)
      if (data.status === 0) {
        let accountMoney = Number(data.data.walletBalance).toFixed(2)
        await this.$router.push({
          path: '/fundsdetail?id=' + val + '&am=' + accountMoney
        })
      } else {
        Toast(data.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.fund-name-custom {
  font-size: 16px;
  line-height: 30px;
  height: 30px;
}

.is-selected .mint-tab-item-label:hover {
  text-decoration: none;
}

.wrapper /deep/ .mint-tab-item-label {
  font-size: 0.264rem;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 2px solid #d50000;
  text-decoration: none;
}

.mint-tab-container-item {
  // padding-top: 1.2rem;
  .mint-button--default {
    padding: 0 0.2rem;
    font-size: 0.24rem;
    height: 0.5rem;
    margin: 0.2rem 0.2rem 0;
    color: #607d8b;
    box-shadow: 0 0 1px #3b71b9;
    background: none;
  }
}

.mint-navbar {
  box-shadow: 0px 0px 4px rgba(6, 0, 1, 0.2);

  .mint-tab-item {
    // background: #21252a;
    padding: 0.2rem 0;

    &.is-selected {
      border: none;
      margin-bottom: 0;
    }

    .mint-tab-item-label {
      font-size: 0.22rem;
    }

    .iconfont {
      // display: block;
      font-size: 0.46rem;
      margin-bottom: 0.12rem;
      vertical-align: middle;
      margin-right: 0.12rem;
    }
  }
}

.sub-navbar {
  background-color: #16171D !important;
  height: .7rem;
  justify-content: center;
  box-shadow: none;

  /deep/ .mint-tab-item-label {
    font-size: .24rem;
  }

  .mint-tab-item {
    position: relative;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    width: 1.4rem;
    height: .4rem;
    background-color: #3D4456;
    padding: 0;
    line-height: .4rem;
    margin: 0.3rem .2rem 0;

    /deep/ .mint-tab-item-label {
      line-height: .4rem;
      height: .4rem;
    }

    &.is-selected {
      color: #fff;
      background-color: #138EB4;
    }
  }
}

#app.red-theme {
  .sub-navbar {
    background-color: #E9E9E9 !important;

    .mint-tab-item {
      background-color: #CCCCCC;
      color: #000;

      &.is-selected {
        color: #fff;
        background-color: #BB1815;
      }
    }
  }
}

.self-el-row {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
