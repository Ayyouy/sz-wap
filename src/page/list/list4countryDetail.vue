<template>
  <div class="wrapper">
    <div class="page-part detail-part">
      <!-- 明细 -->
      <div class="header-bg">
        <div class="header-title">
          <span class="header-name">{{ detail.name }}</span>
        </div>
        <div class="header-code">
          <span class="header-code-tip"></span>
          <span class="header-code-txt">{{ detail.code }}</span>
        </div>
      </div>
      <div class="clearfix">
        <div class="pull-left col-xs-7">
          <p
            :class="
              detail.nowPrice - detail.preclose_px >= 0
                ? 'price green'
                : 'price red'
            "
          >
            {{ detail.nowPrice }}
          </p>
          <p
            :class="
              detail.nowPrice - detail.preclose_px >= 0
                ? 'gain green'
                : 'gain red'
            "
          >
            {{ detail.hcrate }}%
          </p>
        </div>
        <div class="pull-right col-xs-5">
          <ul class="price-detail text-center">
            <li>
              <p class="title">{{ $t('line.prev') }}</p>
              <p
                :class="
                  detail.nowPrice - detail.preclose_px >= 0
                    ? 'number green'
                    : 'number red'
                "
              >
                {{ detail.preclose_px }}
              </p>
            </li>
            <li>
              <p class="title">{{ $t('line.open') }}</p>
              <p
                :class="
                  detail.nowPrice - detail.preclose_px >= 0
                    ? 'number green'
                    : 'number red'
                "
              >
                {{ detail.open_px }}
              </p>
            </li>
            <li>
              <p class="title">{{ $t('line.high') }}</p>
              <p
                :class="
                  detail.nowPrice - detail.preclose_px >= 0
                    ? 'number green'
                    : 'number red'
                "
              >
                {{ detail.today_max }}
              </p>
            </li>
            <li>
              <p class="title">{{ $t('line.low') }}</p>
              <p
                :class="
                  detail.nowPrice - detail.preclose_px >= 0
                    ? 'number green'
                    : 'number red'
                "
              >
                {{ detail.today_min }}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="row detail-list">
        <div class="col-xs-4">
          <p class="title">{{ $t('line.vol') }}</p>
          <p class="number">
            {{ (Number(detail.business_amount) / 100 / 10000).toFixed(2) }}{{ $t('line.thou') }}
          </p>
        </div>
        <div class="col-xs-6">
          <p class="title">{{ $t('line.tran') }}</p>
          <p class="number">
            {{ (Number(detail.business_balance) / 100000000).toFixed(2) }}{{ $t('line.mill') }}
          </p>
        </div>
      </div>
    </div>
    <div class="page-part box-part">
      <imgBox :code="$route.query.code" :imgList="detail"/>
    </div>
    <div class="explain">
      <p class="title">{{ $t('line.explain') }}</p>
      <div class="content" v-html="detail.remark"/>
    </div>
    <div class="agree-footer text-center">
      <div class="btn-box clearfix">
        <a v-if="!isOptionOpt"
          class="pull-left bottom-btn"
          href="javascript:;"
          @click="addOptions">
          {{ $t('line.add') }}
        </a>
        <a v-if="isOptionOpt"
           class="pull-left bottom-btn"
           href="javascript:;"
           @click="deteleOptions">
          {{ $t('line.remove') }}
        </a>
        <a class="pull-left bottom-btn on" href="javascript:;" @click="toBuy">
          {{ $t('line.order') }}
        </a>
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
      detail: {
        id: 1,
        name: '',
        code: '',
        spell: 'pfyx,pfyh',
        gid: '',
        nowPrice: '',
        hcrate: 0,
        today_max: '',
        today_min: '',
        business_balance: '',
        business_amount: '',
        preclose_px: '',
        open_px: '',
        buy1: '',
        buy2: '',
        buy3: '',
        buy4: '',
        buy5: '',
        ticker: null,
        volume: null,
        sell1: '',
        sell2: '',
        sell3: '',
        sell4: '',
        sell5: '',
        buy1_num: '',
        buy2_num: '',
        buy3_num: '',
        buy4_num: '',
        buy5_num: '',
        sell1_num: '',
        sell2_num: '',
        sell3_num: '',
        sell4_num: '',
        sell5_num: '',
        minImg: '',
        dayImg: '',
        weekImg: '',
        monthImg: '',
        depositAmt: 0,
        amount: null,
        average: null,
        zf: null,
        zd: null,
        remark: '' // #  富文本，折扣说明
      }, // 详情
      isOptionOpt: false, // 是否已经添加自选
      timer: null,
      loading: false
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
      //   if(!this.$store.state.userInfo.phone){
      //     MessageBox.confirm('您还未登录，是否去登录?').then(action => {
      //         this.$router.push('/login')
      //     });
      //     return
      //   }
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
      // if (
      //   this.$route.query.code != undefined &&
      //   this.$route.query.code.indexOf("hf_") != -1
      // ) {
      //   this.$router.push({
      //     path: "/futuresBuy",
      //     query: {
      //       info: this.qhinfo,
      //     },
      //   });
      // } else if (
      //   this.$route.query.code != undefined &&
      //   (this.$route.query.code.indexOf("sh") != -1 ||
      //     this.$route.query.code.indexOf("sz") != -1)
      // ) {
      //   this.$router.push({
      //     path: "/indexBuy",
      //     query: {
      //       info: this.zsinfo,
      //     },
      //   });
      // } else {
      this.$router.push({
        name: 'fourCountryBuy',
        params: {
          gid: this.detail.id,
          name: this.detail.name,
          code: this.detail.code,
          hcrate: this.detail.hcrate,
          nowPrice: this.detail.nowPrice,
          discount: this.detail.discount,
          areaId: this.$route.query.areaId
        }
      })
      // }
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

.explain {
  .title {
    font-size: 0.3rem;
    margin: 0.5rem 0 0 0.2rem;
  }

  .content {
    min-height: 3rem;
    margin-top: 0.2rem;
    background-color: #555555;
    padding: 0.5rem 0.3rem;
  }
}

.header-bg {
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  justify-items: flex-start;

  .header-title {
    margin-left: 15px;
    width: auto;
  }

  .header-name {
    font-size: 20px;
  }

  .header-code {
    width: 55px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    background-color: #1ba6d0;
    margin-left: 0.1rem;
    position: relative;
    border-radius: 2px;
  }

  .header-code-tip {
    position: absolute;
    top: 5px;
    left: -3px;
    width: 6px;
    height: 6px;
    background-color: #1ba6d0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .header-code-txt {
    font-size: 12px;
  }
}
</style>
