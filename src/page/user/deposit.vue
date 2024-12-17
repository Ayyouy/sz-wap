<template>
  <div class="page wrapper">
    <p class="chooceTip">{{ $t('recharge.method1') }}</p>
    <div class="list">
      <div v-for="item in payee" :key="item.key" class="item" @click="toDetail(item.id)">
        <img :src="item.iconUrl"/>
        <span class="name">{{ item.channelType }}</span>
        <span class="min">{{ $t('recharge.min') }}{{ item.channelMinLimit }}</span>
        <span class="max">{{ $t('recharge.max') }}{{ item.channelMaxLimit }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/axios/api'
import {Toast} from 'mint-ui'

export default {
  data () {
    return {
      payee: []
    }
  },
  mounted () {
    this.getPayee()
  },
  methods: {
    // 获取支付渠道
    async getPayee () {
      let data = await api.getPayInfo()
      if (data.status === 0) {
        this.payee = data.data
      } else {
        Toast(data.msg)
      }
    },
    toDetail (payId) {
      this.$router.push('/depositDetail?payId=' + payId)
    }
  }
}
</script>

<style lang="less" scoped>
// @bgColor: #fff;
@bgColor: #16171d;
@fontColor: #fff;
@borderColor: #676b6f;
body {
  background: #000;
}

.wrapper {
  background-color: @bgColor;

  .chooceTip {
    text-align: center;
    padding: 1rem 0;
  }

  .list {
    .item {
      padding: 0.2rem;
      margin: 0.5rem;
      border: 1px solid #999;
      background-color: #1f2636;
      border-radius: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: space-around;

      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
}
</style>
