<template>
  <div class="page wrapper">
    <p class="chooceTip">{{$t('recharge.method1')}}</p>
    <div class="list">
      <div v-for="i in optionsPay" :key="i.key" class="item" @click="toDetail(i.id)">
        <img :src="i.iconUrl"/>
        <span class="name">{{ i.channelType }}</span>
        <span class="min">{{$t('recharge.min')}}: {{ i.channelMinLimit }}</span>
        <span class="max">{{$t('recharge.max')}}: {{ i.channelMaxLimit }}</span>
      </div>
    </div>
    <el-dialog
      top="30vh"
      width="80%"
      :title="dialogObj.title"
      class="submitDialog"
      :visible.sync="dialogObj.flag"
      :close-on-click-modal="false"
    >
      <p>
        {{ dialogObj.content }}
      </p>
      <span slot="footer">
        <el-button type="danger" size="mini" @click="dialogObj.cancel">{{$t('recharge.cancel')}}</el-button>
        <el-button type="primary" size="mini" @click="dialogObj.success">{{ dialogObj.successTitle }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/axios/api'
import {Toast} from 'mint-ui'

export default {
  data () {
    return {
      optionsPay: [],
      dialogObj: {
        flag: false,
        title: this.$t('my.auth1'),
        content: this.$t('recharge.unable'),
        successTitle: this.$t('auth.auth'),
        success: Function,
        cancel: Function
      }
    }
  },
  mounted () {
    if (!this.$store.state.userInfo.isActive) {
      this.dialogObj.flag = true
      this.dialogObj.cancel = this.dialogCancel
      this.dialogObj.success = () => {
        this.dialogObj.flag = false
        this.$router.push('/authentication')
      }
    } else {
      this.getPayInfo()
    }
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
