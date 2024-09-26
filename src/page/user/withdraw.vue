<template>
  <div class="wrapper">
    <div>
      <div class="box">
        <div class="box-contain clearfix">
          <div class="account text-center">
            <p class="title">可提现金额（元）</p>
            <p class="red number">{{ $store.state.userInfo.enableAmt || 0 }}</p>
          </div>
        </div>
      </div>
      <div class="form-block page-part">
        <mt-field
          label="提现金额($)"
          placeholder="请输入提现金额"
          type="number"
          v-model="formData.amt"
        >
          <span @click="changeAllNumber">全部</span>
        </mt-field>
      </div>
      <div class="attention">
        <p>注意：默认提取现金账户的可用资金</p>
      </div>
      <el-radio-group class="payType" v-model="formData.payType" v-if="$store.state.bankInfo.countryId != 5">
        <el-radio-button label="0">银行卡</el-radio-button>
        <!-- <el-radio-button label="1">泰达币</el-radio-button> -->
      </el-radio-group>
      <el-radio-group class="payType" v-model="formData.payType" v-else>
        <el-radio-button label="0">泰达币</el-radio-button>
      </el-radio-group>
      <div class="form-block page-part">
        <template v-if="$store.state.bankInfo.countryId != 5">
          <p class="rate">USD/{{ $store.state.bankInfo.code }}=1:{{ $store.state.bankInfo.rate }}</p>
          <mt-field readonly :label="$store.state.bankInfo.currency+'出金'" v-model="formData.aa" />
          <mt-field readonly label="姓名" v-model="$store.state.bankInfo.realName" />
          <mt-field readonly label="出金银行" v-model="$store.state.bankInfo.bankName" />
          <mt-field readonly label="出金账号" v-model="$store.state.bankInfo.bankNo" />
        </template>
        <template v-else>
          <p class="rate">USD/{{ $store.state.bankInfo.code }}=1:{{ $store.state.bankInfo.rate }}</p>
          <mt-field readonly :label="$store.state.bankInfo.currency+'出金'" v-model="formData.aa" />
          <mt-field readonly label="钱包地址" v-model="$store.state.bankInfo.bankNo" />
        </template>
      </div>
      <div class="attention">
        <p>1、当前有持仓订单不能出金 。</p>
        <p>2、出金请先在官网通过实名认证和绑定银行卡 。</p>
        <p>
          3、出金时间工作日 {{ settingInfo.withTimeBegin }} : 00 到
          {{ settingInfo.withTimeEnd }} : 00 之间。
        </p>
        <p>
          4、每笔出金扣除 {{ settingInfo.withFeeSingle }} 元手续费<span
            v-if="settingInfo.withFeePercent != 0"
            >，加上出金金额 * {{ settingInfo.withFeePercent }}</span
          >。
        </p>
        <p>5、每笔提现金额最小 {{ settingInfo.withMinAmt }} 元。</p>
        <p>
          6、<span class="red"
            >出金时段内出金一般2小时到账，出金时间受银行间清算时间影响，各家银行到账时间不同，最迟T+1次日24点前到账</span
          >
        </p>
      </div>
      <div class="btnbox">
        <span class="text-center btnok" @click="toSure">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/axios/api";
import { Toast } from "mint-ui";

export default {
  components: {},
  props: {},
  data() {
    return {
      card: "",
      phone: "",
      settingInfo: {
        withMinAmt: 1000,
        withTimeBegin: 13, // 提现开始时间
        withTimeEnd: 15, // 提现结束时间
        withFeeSingle: 3, // 提现单笔手续费
        withFeePercent: 0.008, // 提现单笔手续费
      },
      formData: {
        amt: "",
        payType: "0",
        rate: 1,
      },
    };
  },
  watch: {},
  computed: {},
  created() {},
  beforeDestroy() {
    if (this.$state.theme == "red") {
      document.body.classList.remove("red-bg");
      document.body.classList.add("black-bg");
    }
  },
  mounted() {
    if (this.$state.theme == "red") {
      document.body.classList.remove("black-bg");
      document.body.classList.add("red-bg");
    }
    this.getSettingInfo();
    console.log(this.$store.state.bankInfo)
  },
  watch: {
    "formData.amt"(val) {
      this.formData.aa = val * this.$store.state.bankInfo.rate;
    },
  },
  methods: {
    changeAllNumber() {
      this.formData.amt = this.$store.state.userInfo.enableAmt;
    },
    async getSettingInfo() {
      let data = await api.getSetting();
      if (data.status === 0) {
        // 成功
        this.settingInfo = data.data;
      } else {
        Toast(data.msg);
      }
    },
    async toSure() {
      // 确定提现
      //   未实名认证和添加银行卡不能提现
      if (!this.$store.state.userInfo.isActive) {
        Toast("请先实名认证");
        this.$router.push("/authentication");
        return;
      }
      if (!this.$store.state.bankInfo.bankNo) {
        Toast("请先绑定银行卡");
        this.$router.push("/addCard");
        return;
      }
      if (!this.formData.amt || this.formData.amt <= 0) {
        Toast("请输入正确的提现金额");
      } else if (this.formData.amt - this.settingInfo.withMinAmt < 0) {
        Toast("提现金额不得小于" + this.settingInfo.withMinAmt);
      } else {
        let opts = {
          amt: this.formData.amt,
          currency: this.$store.state.bankInfo.code,
          countryId: this.$store.state.bankInfo.countryId
        };
        let data = await api.outMoney(opts);
        if (data.status === 0) {
          // 成功
          Toast("申请成功，请等待审核!");
           this.$router.push("/moneyList?index=2");
        } else {
          Toast(data.msg ? data.msg : "提现失败,请重新提现或者联系管理员");
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
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

.addcard {
  height: 0.834rem;
  line-height: 0.834rem;
  font-size: 0.29rem;
  color: rgb(187, 187, 187);

  a {
    color: #177be1;
  }
}

.attention {
  // height: 0.417rem;
  line-height: 0.417rem;
  padding: 0.347rem;
}

/deep/ .payType {
  margin: 0 0.4rem;
  display: flex;
  .el-radio-button {
    flex: 1;
    .el-radio-button__inner {
      width: 100%;
    }
  }
}

/deep/ .mint-field .mint-cell-title {
  text-align: right;
}

.rate {
  text-align: right;
  font-size: 0.4rem;
  margin: 0.3rem;
}
</style>
