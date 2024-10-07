<template>
  <div class="page wrapper">
    <p class="chooceTip">请选择入金方式</p>
    <div class="list">
      <div v-for="i in optionsPay" :key="i.key" class="item" @click="toDetail(i.id)">
        <img :src="i.iconUrl"/>
        <span class="name">{{ i.channelType }}</span>
        <span class="min">最低: {{ i.channelMinLimit }}</span>
        <span class="max">最高: {{ i.channelMaxLimit }}</span>
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
      optionsPay: []
    }
  },
  mounted () {
    this.getPayInfo()
  },
  methods: {
    async getPayInfo () {
      // 获取支付渠道
      let data = await api.getPayInfo()
      if (data.status === 0) {
        this.optionsPay = data.data
        this.id = data.data[0].id
        this.type = data.data[0].ctype
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
