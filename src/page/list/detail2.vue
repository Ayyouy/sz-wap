<template>
  <div class="wrapper">
    <div class="page-part detail-part ">
      <!-- 明细 -->
      <div class="clearfix">
        <div class="pull-left col-xs-7">
          <p :class="detail.nowPrice - detail.preclose_px <0?'price green':'price red'">
            {{ detail.nowPrice }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'gain green':'gain red'">
            {{ detail.hcrate }}%</p>
        </div>
        <div class="pull-right col-xs-5">
          <ul class="price-detail text-center">
            <li>
              <p class="title">{{$t('line.prev')}}</p>
              <p :class="detail.nowPrice - detail.preclose_px <0?'number green':'number red'">
                {{ detail.preclose_px }}</p>
            </li>
            <li>
              <p class="title">{{$t('line.open')}}</p>
              <p :class="detail.nowPrice - detail.preclose_px <0?'number green':'number red'">
                {{ detail.open_px }}</p>
            </li>
            <li>
              <p class="title">{{$t('line.high')}}</p>
              <p :class="detail.nowPrice - detail.preclose_px <0?'number green':'number red'">
                {{ detail.today_max }}</p>
            </li>
            <li>
              <p class="title">{{$t('line.low')}}</p>
              <p :class="detail.nowPrice - detail.preclose_px <0?'number green':'number red'">
                {{ detail.today_min }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="row detail-list">
        <div class="col-xs-4">
          <p class="title">{{$t('line.vol')}}</p>
          <p class="number">{{ (Number(detail.business_amount) / 100 / 10000).toFixed(2) }}{{$t('line.thou')}}</p>
        </div>
        <div class="col-xs-6">
          <p class="title">{{$t('line.tran')}}</p>
          <p class="number">{{ (Number(detail.business_balance) / 100000000).toFixed(2) }}{{$t('line.mill')}}</p>
        </div>
      </div>
    </div>
    <div class="page-part box-part">
      <!-- 图 -->
      <imgBox :code="$route.query.code" :imgList='detail'/>
    </div>
    <div class="page-part">
      <ul class="stock-price clearfix">
        <li class="text-center pull-left">
          <p>{{ $t('buy2') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.buy1 }}</p>
          <p>{{ (Number(detail.buy1_num) / 100).toFixed(2) }}</p>
        </li>
        <li class="text-center pull-left">
          <p>{{ $t('buy3') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.buy2 }}</p>
          <p>{{ (Number(detail.buy2_num) / 100).toFixed(2) }}</p>
        </li>
        <li class="text-center pull-left">
          <p>{{ $t('buy4') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.buy3 }}</p>
          <p>{{ (Number(detail.buy3_num) / 100).toFixed(2) }}</p>
        </li>
        <li class="text-center pull-left">
          <p>{{ $t('buy5') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.buy4 }}</p>
          <p>{{ (Number(detail.buy4_num) / 100).toFixed(2) }}</p>
        </li>
        <li class="text-center pull-left">
          <p>{{ $t('buy6') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.buy5 }}</p>
          <p>{{ (Number(detail.buy5_num) / 100).toFixed(2) }}</p>
        </li>
      </ul>
    </div>
    <div class="page-part">
      <ul class="stock-price clearfix">
        <li class="text-center pull-left">
          <p>{{ $t('sell5') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.sell1 }}</p>
          <p>{{ (Number(detail.sell1_num) / 100).toFixed(2) }}</p>
        </li>
        <li class="text-center pull-left">
          <p>{{ $t('sell6') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.sell2 }}</p>
          <p>{{ (Number(detail.sell2_num) / 100).toFixed(2) }}</p>
        </li>
        <li class="text-center pull-left">
          <p>{{ $t('sell7') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.sell3 }}</p>
          <p>{{ (Number(detail.sell3_num) / 100).toFixed(2) }}</p>
        </li>
        <li class="text-center pull-left">
          <p>{{ $t('sell8') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.sell4 }}</p>
          <p>{{ (Number(detail.sell4_num) / 100).toFixed(2) }}</p>
        </li>
        <li class="text-center pull-left">
          <p>{{ $t('sell9') }}</p>
          <p :class="detail.nowPrice - detail.preclose_px <0?'green':'red'">{{ detail.sell5 }}</p>
          <p>{{ (Number(detail.sell5_num) / 100).toFixed(2) }}</p>
        </li>
      </ul>
    </div>
    <div class="agree-footer text-center">
      <div v-if="$store.state.userInfo.phone" class="btn-box clearfix">
        <a v-if="!isOptionOpt" class="pull-left bottom-btn" href="javascript:;" @click="addOptions">{{ $t('line.add') }}</a>
        <a v-if="isOptionOpt" class="pull-left bottom-btn" href="javascript:;"
           @click="deteleOptions">{{ $t('line.remove') }}</a>
        <a class="pull-left bottom-btn on" href="javascript:;" @click="toBuy">{{ $t('line.order') }}</a>
      </div>
    </div>
  </div>
</template>
<script>
import imgBox from './compontent/img'
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  components: {
    imgBox
  },
  props: {},
  data () {
    return {
      detail: {}, // 详情
      buyList: [
        {price: 33.5, price2: 14323.5},
        {price: 33.5, price2: 14323.5},
        {price: 33.5, price2: 14323.5},
        {price: 33.5, price2: 14323.5},
        {price: 33.5, price2: 14323.5}
      ],
      isOptionOpt: false, // 是否已经添加自选
      timer: null,
      loading: false,
      qhinfo: {},
      zsinfo: {}
    }
  },
  created () {
    this.timer = setInterval(this.refreshList, 5000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    this.getDetail()
    if (this.$store.state.userInfo.phone) {
      // 判断是否登录
      this.getOpation()
    } else {
      // 获取用户信息
      this.getUserInfo()
    }
    this.qhinfo = this.$route.query.qhinfo
    this.zsinfo = this.$route.query.zsinfo
  },
  methods: {
    toSearch () {
      this.$router.push('/searchlist')
    },
    async getUserInfo () {
      // 获取用户信息
      let data = await api.getUserInfo()
      if (data.status === 0) {
        this.$store.state.userInfo = data.data
        await this.getOpation()
      } else {
        Toast(data.msg)
      }
      this.$store.state.user = this.user
    },
    async refreshList () {
      if (this.loading) {
        return
      }
      await this.getDetail()
    },
    async getOpation () {
      let opts = {
        code: this.$route.query.code
      }
      let data = await api.isOption(opts)
      if (data.status === 0) {
        // 0 --> 未添加
        this.isOptionOpt = false
      } else {
        this.isOptionOpt = true
      }
    },
    async getDetail () {
      let opts = {
        code: this.$route.query.code
      }
      this.loading = true
      let data = await api.getSingleStock(opts)
      this.loading = false
      if (data.status === 0) {
        this.detail = data.data
      } else {
        Toast(data.msg)
      }
    },
    async addOptions () {
      let data = await api.addOption({code: this.$route.query.code})
      if (data.status === 0) {
        // Toast('添加自选成功')
        Toast(this.$t('line.addSuccess'))
        this.isOptionOpt = true
      } else {
        Toast(data.msg)
      }
    },
    async deteleOptions () {
      let data = await api.delOption({code: this.$route.query.code})
      if (data.status === 0) {
        // Toast('删除自选股成功')
        Toast(this.$t('line.removeSuccess'))
        this.isOptionOpt = false
      } else {
        Toast(data.msg)
      }
    },
    toBuy () {
      // 期货
      if (this.$route.query.code !== undefined && this.$route.query.code.indexOf('hf_') !== -1) {
        this.$router.push({
          path: '/futuresBuy',
          query: {
            info: this.qhinfo
          }
        })
      } else if (this.$route.query.code !== undefined && (this.$route.query.code.indexOf('sh') !== -1 || this.$route.query.code.indexOf('sz') != -1)) {
        this.$router.push({
          path: '/indexBuy',
          query: {
            info: this.zsinfo
          }
        })
      } else {
        this.$router.push(
          {
            name: 'buy',
            params: {
              gid: this.detail.id,
              name: this.detail.name,
              code: this.detail.code,
              hcrate: this.detail.hcrate,
              nowPrice: this.detail.nowPrice
            }
          })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.btn-box {
  padding: 0;
}

.mint-header {
  background: #21252a;
}

.page-part {
  // background: #21252a;
  padding: 0.3rem;
  margin-bottom: 0.1rem;
  border-bottom: 0.01rem solid #676b6f;
}

.stock-price li {
  width: 20%;

  p {
    height: 0.34rem;
    line-height: 0.34rem;
  }
}

.detail-part {
  .price {
    font-size: 0.56rem;
    margin-top: 0.1rem;
    margin-bottom: 0.2rem;
    padding-bottom: 0.2rem;
  }

  .gain {
    font-size: 0.24rem;
  }

  .title {
    line-height: 0.36rem;

  }

  .number {
    line-height: 0.36rem;

  }

  .price-detail {
    li {
      width: 50%;
      float: left;
      margin-bottom: 0.16rem;
    }
  }

  .detail-list {
    padding-left: 0.3rem;
  }
}

.box-part {
  padding: 0;
}
</style>
