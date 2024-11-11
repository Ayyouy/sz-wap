<template>
  <div class="wrapper">
    <div style="margin: 10px;padding-bottom: 10px">
      <p style="font-size: 12px;margin-bottom: 0.2rem;text-indent: 2em;line-height: 18px"
         v-for="item in info.split('\n')" :key="item">{{ item }}</p>
    </div>
  </div>
</template>
<script>
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  data () {
    return {
      info: ''
    }
  },
  mounted: function () {
    this.getInfoSite()
  },
  methods: {
    async getInfoSite () {
      let data = await api.getInfoSite()
      if (data.status === 0) {
        this.info = data.data.tradeAgreeText
      } else {
        Toast(data.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
body {
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}

.wrapper {
  width: 100%;
  height: 100%;
}

</style>
