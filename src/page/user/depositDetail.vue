<template>
  <div class="wrapper">
    <div class="pageTitle">入金渠道</div>
    <div class="box">
      <div class="clearfix">
        <div class="account text-center">
          <p class="title">当前可用余额（元）</p>
          <p class="red number">{{ $store.state.userInfo.enableAmt }}</p>
        </div>
      </div>
    </div>
    <div class="item">
      <img :src="detail.iconUrl" />
      <span class="name">{{ detail.channelType }}</span>
      <span class="min">最低: {{ detail.channelMinLimit }}</span>
      <span class="max">最高: {{ detail.channelMaxLimit }}</span>
    </div>

    <div class="form-block page-part">
      <mt-field
        label="入金金额($)"
        placeholder="请输入入金金额"
        type="number"
        v-model="formData.amt"
      />
      <p class="num1">{{ detail.code }}：{{ formData.amt * detail.rate }}</p>
      <p class="num2">USD/{{ detail.code }}=1:{{ detail.rate }}</p>
      <div class="upload-box clearfix">
        <p class="left">截图凭证</p>
        <div class="upload-btn">
          <el-upload
            name="upload_file"
            list-type="picture-card"
            :with-credentials="true"
            :action="`${url}/user/upload.do`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleError"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="formData.rechargeImg"
              :src="formData.rechargeImg"
              class="id-img avatar"
            />
            <i v-else class="iconfont icon-zhaopian"></i>
            <span v-if="!formData.rechargeImg && !imgStatus" class="btn-title"
              >截图凭证</span
            >
            <span v-if="imgStatus" class="btn-title">正在上传中...</span>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="form-block page-part">
      <template v-if="detail.ctype !== 2">
        <mt-field
          label="收款名称"
          placeholder="收款名称"
          disabled
          type="text"
          v-model="detail.channelName"
        >
          <span
            v-clipboard:copy="detail.channelName"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            <i class="iconfont icon-fuzhi"></i>复制
          </span>
        </mt-field>
        <mt-field
          label="收款银行"
          placeholder="收款银行"
          disabled
          type="text"
          v-model="detail.channelDesc"
        >
          <span
            v-clipboard:copy="detail.channelDesc"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            <i class="iconfont icon-fuzhi"></i>复制
          </span>
        </mt-field>
        <mt-field
          label="收款账号"
          placeholder="收款账号"
          disabled
          type="text"
          v-model="detail.channelAccount"
        >
          <span
            v-clipboard:copy="detail.channelAccount"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            <i class="iconfont icon-fuzhi"></i>复制
          </span>
        </mt-field>
      </template>
      <template v-else>
        <mt-field
          label="钱包地址"
          placeholder="钱包地址"
          disabled
          type="text"
          v-model="detail.channelAccount"
        >
          <span
            v-clipboard:copy="detail.channelAccount"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            <i class="iconfont icon-fuzhi"></i>复制
          </span>
        </mt-field>
      </template>
    </div>
    <div class="attention" style="margin-bottom: 10px">
      <p>注意事项</p>
    </div>
    <div class="attention">
      <p>
        由于支付收款上线限制，每次收款公户可能不一样，请每次充值前获取最新的二维码完成支付
      </p>
      <p>
        如果您的网络环境不稳定，或由于设备、环境、偏好、行为、关系、账户、身份等维度问题，可能导致支付宝风控系统提示风险，请您在安全的环境下发起支付
      </p>
      <p class="tip-text">
        <i class="iconfont icon-jingpaibuzhou2"></i>为确保入金及时到账，<span
          class="red"
          >请确认您输入的金额和提交的充值金额一致</span
        >.
      </p>
      <p class="tip-text">
        <i class="iconfont icon-jingpaibuzhou1"></i
        >受支付宝到账通知时间影响,入金时间到账时间可能会延迟，请耐心等待.
      </p>
    </div>
    <div class="btnbox">
      <span class="text-center btnok" @click="toSure">提交</span>
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
      <p><i class="el-icon-success" />您的入金申请已提交</p>
      <span slot="footer">
        <el-button type="primary" @click="$router.push('moneyList')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import APIUrl from "../../axios/api.url"; // 引入api.url.js

import * as api from "@/axios/api";
export default {
  data() {
    return {
      detail: {},
      number: "",
      card: "",
      phone: "",
      settingInfo: {
        withMinAmt: 1000,
        withTimeBegin: 13, // 提现开始时间
        withTimeEnd: 15, // 提现结束时间
        withFeeSingle: 3, // 提现单笔手续费
        withFeePercent: 0.008, // 提现单笔手续费
      },
      payInfo: {},
      payId: "",
      formData: {
        amt: "", // 转账金额（美元）
        payType: "", // 渠道类型 #0：支付包 1：银行转账 2：虚拟货币
        currency: "", // 货币简称
        rechargeImg: "", // 转账凭证截图
      },
      dialogVisible: false,
      imgSrc: "",
      imgStatus: false,
      url: "",
    };
  },
  mounted() {
    this.payId = this.$route.query.payId;
    this.getDetail();
    this.url = APIUrl.baseURL;
  },
  methods: {
    // 获取支付渠道详情数据
    async getDetail() {
      let data = await api.getPayInfoDetail({ payId: this.payId })
      console.log('data:',data)
      if (data.status === 0) {
        this.detail = data.data;
        this.imgSrc = data.data.formUrl;
      } else {
        Toast(data.msg);
      }
    },
    handleAvatarSuccess(res, file) {
      this.imgStatus = false;
      this.formData.rechargeImg = res.data.url;
    },
    beforeAvatarUpload(file) {
      this.imgStatus = true;
      //     const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
      //     const isLt2M = file.size / 1024 / 1024 < 20;
      //     if (!isJPG) {
      //         Toast('请选择jpg或者png的图片格式!');
      //     }
      // // if (!isLt2M) {
      // //     Toast('上传头像图片大小不能超过 2MB!');
      // // }
      //     return isJPG && isLt2M;
    },
    handleError() {
      this.imgStatus = false;
    },
    // 提交
    async toSure() {
      this.formData.payType = this.detail.ctype;
      this.formData.currency = this.detail.code;
      if (
        this.formData.amt <= 0 
      ) {
        Toast("请输入正确的金额");
        return;
      }
      if (
        this.formData.amt < this.detail.channelMinLimit || this.formData.amt > this.detail.channelMaxLimit
      ) {
        Toast("金额超出可充值范围");
        return;
      }
      if (
        ![0, 1, 2].includes(this.formData.payType) ||
        !this.formData.currency
      ) {
        Toast("参数异常");
        return;
      }
      if (!this.formData.rechargeImg) {
        Toast("请上传转账凭证");
        return;
      }
      let data = await api.inMoneySubmit(this.formData);
      Toast(data.msg);
      if (data.status === 0) {
        this.dialogVisible = true;
      }
    },
    onCopy: function (e) {
      Toast("复制成功！");
    },
    onError: function (e) {
      Toast("复制失败，请重试！");
    },
  },
};
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
