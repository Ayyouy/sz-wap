<template>
  <div class="wrapper">
    <div class="pageTitle">{{ $t('recharge.method2') }}</div>
    <div class="box">
      <div class="clearfix">
        <div class="account text-center">
          <p class="title">{{ $t('recharge.balance') }}</p>
          <p class="red number">{{ $store.state.userInfo.enableAmt }}</p>
        </div>
      </div>
    </div>
    <div class="item">
      <img :src="detail.iconUrl"/>
      <span class="name">{{ detail.channelType }}</span>
      <span class="min">{{ $t('recharge.min') }} {{ detail.channelMinLimit }}</span>
      <span class="max">{{ $t('recharge.max') }} {{ detail.channelMaxLimit }}</span>
    </div>

    <div class="form-block page-part">
      <mt-field
        :label="$t('recharge.amount1')"
        :placeholder="$t('recharge.amount2')"
        type="number"
        v-model="formData.amt"
      />
      <p class="num1">{{ detail.code }}：{{ Number(formData.amt * detail.rate).toFixed(2) }}</p>
      <p class="num2">USD/{{ detail.code }}=1:{{ detail.rate }}</p>
      <div class="upload-box clearfix">
        <p class="left">{{ $t('recharge.screen') }}</p>
        <div class="upload-btn">
          <el-upload
            name="upload_file"
            list-type="picture-card"
            :with-credentials="true"
            action="#"
            multiple
            :limit="1"
            :file-list="fileList"
            :show-file-list="false"
            :auto-upload="false"
            :on-exceed="limitCheck"
            :on-remove="removeFile"
            :on-change="handleChange">
            <img v-if="formData.rechargeImg" :src="formData.rechargeImg" class="id-img avatar"/>
            <i v-else class="iconfont icon-zhaopian"></i>
            <span v-if="!formData.rechargeImg && !imgStatus" class="btn-title">{{ $t('recharge.screen') }}</span>
            <span v-if="imgStatus" class="btn-title">{{ $t('recharge.upload') }}</span>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="form-block page-part">
      <template v-if="detail.ctype !== 2">
        <mt-field
          :label="$t('recharge.payee')"
          :placeholder="$t('recharge.payee')"
          disabled
          type="text"
          v-model="detail.channelName"
        >
          <span
            v-clipboard:copy="detail.channelName"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            <i class="iconfont icon-fuzhi"></i>{{ $t('recharge.copy') }}
          </span>
        </mt-field>
        <mt-field
          :label="$t('recharge.bank')"
          :placeholder="$t('recharge.bank')"
          disabled
          type="text"
          v-model="detail.channelDesc"
        >
          <span
            v-clipboard:copy="detail.channelDesc"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            <i class="iconfont icon-fuzhi"></i>{{ $t('recharge.copy') }}
          </span>
        </mt-field>
        <mt-field
          :label="$t('recharge.account')"
          :placeholder="$t('recharge.account')"
          disabled
          type="text"
          v-model="detail.channelAccount"
        >
          <span
            v-clipboard:copy="detail.channelAccount"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            <i class="iconfont icon-fuzhi"></i>{{ $t('recharge.copy') }}
          </span>
        </mt-field>
      </template>
      <template v-else>
        <mt-field
          :label="$t('recharge.wallet')"
          :placeholder="$t('recharge.wallet')"
          disabled
          type="text"
          v-model="detail.channelAccount"
        >
          <span
            v-clipboard:copy="detail.channelAccount"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            <i class="iconfont icon-fuzhi"></i>{{ $t('recharge.copy') }}
          </span>
        </mt-field>
      </template>
    </div>
    <div class="attention" style="margin-bottom: 10px">
      <p>{{ $t('recharge.attention1') }}</p>
    </div>
    <div class="attention">
      <p>
        {{ $t('recharge.attention2') }}
      </p>
      <p>
        {{ $t('recharge.attention3') }}
      </p>
      <p class="tip-text">
        <i class="iconfont icon-jingpaibuzhou2"></i>{{ $t('recharge.attention4') }}
        <span class="red">{{ $t('recharge.attention5') }}</span>
      </p>
      <p class="tip-text">
        <i class="iconfont icon-jingpaibuzhou1"></i>
        {{ $t('recharge.attention6') }}
      </p>
    </div>
    <div class="btnbox">
      <span class="text-center btnok" :style="doubleSubmit?'color:#eee;background:#676b6f':''"
            @click="toSure">{{ $t('recharge.submit') }}</span>
    </div>
    <el-dialog
      center
      top="40vh"
      width="80%"
      class="submitDialog"
      :show-close="false"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <p><i class="el-icon-success"/>{{ $t('recharge.submitted') }}</p>
      <span slot="footer">
        <el-button type="primary" @click="$router.push('moneyList')"
        >{{ $t('recharge.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {Toast} from 'mint-ui'
import APIUrl from '@/axios/api.url' // 引入api.url.js
import * as api from '@/axios/api'
import axios from 'axios'

export default {
  data () {
    return {
      detail: {},
      number: '',
      card: '',
      phone: '',
      settingInfo: {
        withMinAmt: 1000,
        withTimeBegin: 13, // 提现开始时间
        withTimeEnd: 15, // 提现结束时间
        withFeeSingle: 3, // 提现单笔手续费
        withFeePercent: 0.008 // 提现单笔手续费
      },
      payInfo: {},
      payId: '',
      fileList: [],
      formData: {
        amt: '', // 转账金额（美元）
        payType: '', // 渠道类型 #0：支付包 1：银行转账 2：虚拟货币
        currency: '', // 货币简称
        rechargeImg: '' // 转账凭证截图
      },
      dialogVisible: false,
      imgSrc: '',
      imgStatus: false,
      url: '',
      doubleSubmit: false,
      doubleTitle: this.$t('recharge.double') // 第一遍时提示此消息，第二遍时就提示返回重拾，这种是应对服务器异常，而导致doubleSubmit值没变过来的情况
    }
  },
  mounted () {
    this.payId = this.$route.query.payId
    this.getDetail()
    this.url = APIUrl.baseURL
  },
  methods: {
    // 获取支付渠道详情数据
    async getDetail () {
      let data = await api.getPayInfoDetail({payId: this.payId})
      if (data.status === 0) {
        this.detail = data.data
        this.imgSrc = data.data.formUrl
      } else {
        Toast(data.msg)
      }
    },
    handleChange (file, fileList) {
      this.fileList = fileList
      const isLt2M = (file.size / 1024 / 1024 < 2)
      if (!isLt2M) {
        // Toast('上传头像图片大小不能超过 2MB!')
        Toast(this.$t('recharge.imgLimit'))
        this.fileList.pop()
      } else {
        this.imgStatus = true
        this.confirm()
      }
      return isLt2M
    },
    limitCheck (file, fileList) {
      // Toast('每次最多上传一个文件')
      Toast(this.$t('recharge.imgSingle'))
      this.formData.rechargeImg = ''
      this.fileList = []
    },
    removeFile (file, fileList) {
      this.formData.rechargeImg = ''
      this.fileList = fileList
    },
    confirm () {
      const param = new FormData()
      param.append('upload_file', this.fileList[0].raw)
      const url = this.url + '/user/upload.do'
      axios(url, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': localStorage.getItem('wap-token')
        },
        method: 'POST',
        data: param
      }).then(res => {
        this.imgStatus = false
        this.formData.rechargeImg = res.data.data.url
        this.fileList = []
      }).catch(res => {
        Toast(res.data.msg)
        this.imgStatus = false
        this.formData.rechargeImg = ''
        this.fileList = []
      })
    },
    // 提交
    async toSure () {
      if (this.doubleSubmit) {
        Toast(this.doubleTitle)
        return
      }
      this.doubleSubmit = true
      this.formData.payType = this.detail.ctype
      this.formData.currency = this.detail.code
      if (this.formData.amt <= 0) {
        this.doubleSubmit = false
        // Toast('请输入正确的金额')
        Toast(this.$t('recharge.msgAmount'))
        return
      }
      if (this.formData.amt < this.detail.channelMinLimit || this.formData.amt > this.detail.channelMaxLimit) {
        this.doubleSubmit = false
        // Toast('金额超出可充值范围')
        Toast(this.$t('recharge.limit'))
        return
      }
      if (
        ![0, 1, 2].includes(this.formData.payType) ||
        !this.formData.currency
      ) {
        // Toast('参数异常')
        Toast(this.$t('recharge.msgParam'))
        this.doubleSubmit = false
        return
      }
      if (!this.formData.rechargeImg) {
        // Toast('请上传转账凭证')
        Toast(this.$t('recharge.proof'))
        this.doubleSubmit = false
        return
      }
      let data = await api.inMoneySubmit(this.formData)
      Toast(data.msg)
      if (data.status === 0) {
        this.dialogVisible = true
      }
      this.doubleSubmit = false
    },
    onCopy: function (e) {
      // Toast('复制成功！')
      Toast(this.$t('recharge.success'))
    },
    onError: function (e) {
      // Toast('复制失败，请重试！')
      Toast(this.$t('recharge.msgCopy'))
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

  .pageTitle {
    font-size: 0.4rem;
    text-align: center;
    padding: 0.4rem 0;
    color: #fff;
  }

  .box {
    background-color: @bgColor;

    .account {
      padding-bottom: 0.2rem;

      .title {
        height: 1.4rem;
        line-height: 1.4rem;
        font-size: 0.29rem;
        // color: rgb(51, 51, 51);
        text-align: center;
        // font-weight: 700;
      }

      .number {
        font-size: 0.566rem;
        font-weight: 600;
      }
    }
  }

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

  .num1 {
    font-size: 0.4rem;
    margin: 0.3rem;
    margin-left: 0.5rem;
  }

  .num2 {
    margin-left: 0.5rem;
    margin-bottom: 0.3rem;
  }

  .upload-box {
    color: #fff;
    display: flex;
    align-items: center;
    background: #21252a;
    padding: 0 0.33rem;

    .left {
      width: 30%;
      font-size: 0.29rem;
      text-align: center;
    }

    .upload-btn {
      // border: 1px solid #ddd;
      flex: 1;
      border-radius: 4px;
      margin-bottom: 10px;
      float: left;
      margin: 0.2rem;
      margin-right: 0;
      text-align: center;
      position: relative;

      .btn-hidden {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        opacity: 0;
      }

      .id-img {
        max-width: 100%;
        max-height: 100%;
      }

      /deep/ .el-upload--picture-card {
        background: none;
        width: 100%;
        height: 1.6rem;
        line-height: 1.6rem;
      }

      .btn-title {
        position: absolute;
        top: 23px;
        left: 0;
        width: 100%;
      }

      /deep/ .el-upload__input {
        display: none;
      }
    }
  }

  .attention {
    // height: 0.417rem;
    line-height: 0.417rem;
    padding: 0.347rem;
  }

  .submitDialog {
    /deep/ .el-dialog {
      background-color: #21252a;

      p {
        color: #fff;
        text-align: center;
        font-size: 0.4rem;

        i {
          color: green;
        }
      }

      // .el-dialog__footer {
      //   display: flex;
      //   justify-content: center;
      // }
    }
  }
}
</style>
