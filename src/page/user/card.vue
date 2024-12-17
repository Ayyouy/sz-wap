<template>
  <div class="wrapper">
    <div class="box page-part transaction">
      <div class="box-contain clearfix">
        <div v-if="cardInfo.length <= 0" class="empty text-center" style="font-size: 0.35rem">
          {{$t('bank.no')}}
        </div>
        <div v-if="cardInfo.length > 0" class="back-info">
          <ul>
            <li class="clearfix" v-for="i in cardInfo" :key="i.key">
              <div class="col-xs-3">
                <img src="../../../static/img/pay.png" alt="pay"/>
              </div>
              <div class="col-xs-9">
                <p v-if="i.countryId != 5">{{ i.bankName }}</p>
                <p>{{ i.bankNo }}</p>
              </div>
            </li>
          </ul>
          <p class="red">{{$t('bank.limit')}}</p>
        </div>
      </div>
    </div>
    <div v-if="cardInfo.length <= 0" class="btnbox">
      <span class="text-center btnok" @click="addCard">{{$t('bank.add')}}</span>
    </div>
    <div v-else class="btnbox">
      <span class="text-center btnok" @click="addCard('edit')">{{$t('bank.modify')}}</span>
    </div>
  </div>
</template>

<script>
import * as api from '@/axios/api'
import {Toast} from 'mint-ui'

export default {
  data () {
    return {
      cardInfo: []
    }
  },
  beforeDestroy () {
    if (this.$state.theme === 'red') {
      document.body.classList.remove('red-bg')
      document.body.classList.add('black-bg')
    }
  },
  mounted () {
    if (this.$state.theme === 'red') {
      document.body.classList.remove('black-bg')
      document.body.classList.add('red-bg')
    }
    this.getCardDetail()
  },
  methods: {
    // 添加银行卡
    addCard (val) {
      if (val === 'edit') {
        this.$router.push({
          path: '/addCard',
          query: {
            type: val
          }
        })
      } else {
        this.$router.push('/addCard')
      }
    },
    async getCardDetail () {
      // 获取银行卡信息
      let opts = {
        code: this.$route.query.code
      }
      let data = await api.getBankCard(opts)
      if (data.status === 0) {
        this.cardInfo = []
        this.cardInfo.push(data.data)
        this.$store.state.bankInfo = data.data
      } else {
        Toast(data.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.back-info {
  padding: 0.2rem 0.3rem;

  .name {
    font-size: 0.3rem;
    padding: 0.1rem 0rem;
  }

  ul {
    li {
      // border:0.01rem solid #ddd;
      padding: 0.2rem;

      img {
        width: 0.84rem;
        margin-top: 0.1rem;
      }

      div {
        line-height: 0.35rem;
      }
    }
  }
}

.transaction {
  color: rgba(100, 100, 100, 0.78);

  .empty {
    width: 100%;
    font-size: 0.43rem;
    color: #888888;
    text-align: center;
    line-height: 2rem;
  }
}

.btnbox {
  width: 70%;
  margin: 0 auto;
}
</style>
