<template>
  <div class="wrapper">
    <div class="box transaction">
      <div class="box-contain clearfix">
        <div class="empty text-center" style="margin-top: 0.3rem">
          <!-- 您已通过实名认证 -->
          <i
            style="color: red; font-size: 1.2rem; margin-top: 0.2rem"
            class="iconfont icon-chongzhi2"
          ></i>
        </div>
      </div>
    </div>
    <div class="form-block page-part">
      <mt-field
        readonly
        type="text"
        label="出金货币"
        placeholder="请选择币种"
        class="countryIdField"
        v-model="countryId"
      >
        <select v-model="countryId">
          <option value="1" :class="{ selectActive: countryId == '1' }">
            香港货币
          </option>
          <option value="2" :class="{ selectActive: countryId == '2' }">
            美国货币
          </option>
          <option value="3" :class="{ selectActive: countryId == '3' }">
            日本货币
          </option>
          <option value="4" :class="{ selectActive: countryId == '4' }">
            印度货币
          </option>
          <option value="5" :class="{ selectActive: countryId == '5' }">
            泰达币
          </option>
        </select>
      </mt-field>
      <template v-if="countryId != '5'">
        <mt-field
          label="银行名称"
          placeholder="例:中国工商银行（全称）"
          type="text"
          v-model="bankName"
        />
        <!-- <mt-field
          label="开户支行"
          placeholder="需要精确到分行或者支行"
          type="text"
          v-model="bankAddress"
        /> -->
        <mt-field
          label="银行卡号"
          placeholder="请输入银行卡号"
          v-model="bankNo"
        />
      </template>
      <template v-else>
        <mt-field
          label="钱包地址"
          placeholder="请输入泰达币钱包地址"
          v-model="bankNo"
        />
      </template>
    </div>
    <!-- <div class="form-block page-part">
        <mt-field label="持卡人姓名" placeholder="和银行卡绑定一致" type="text" v-model="username"></mt-field>
        <mt-field label="银行预留手机号" placeholder="请输入持卡人手机号" type="text" v-model="username"></mt-field>
    </div> -->
    <div class="rule-box">
      <div class="title">提示：</div>
      <ul>
        <li>
          1、新用户注册后必须通过添加{{
            countryId == "5" ? "泰达币" : "银行卡"
          }}。
        </li>
        <li>
          2、用户只能添加一张本人{{ countryId == "5" ? "泰达币" : "银行卡" }}。
        </li>
        <li>
          3、真实姓名必须和出金{{
            countryId == "5" ? "泰达币" : "银行卡"
          }}户名一致。
        </li>
      </ul>
    </div>
    <div class="btnbox">
      <span class="text-center btnok" @click="showDialog">确定</span>
    </div>

    <el-dialog
      center
      top="30vh"
      width="80%"
      title="验证码确认"
      class="submitDialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <p class="title">
        为了您的资金安全，修改银行卡和钱包信息时，需要输入您的手机验证码
      </p>
      <div class="flexDiv">
        <span>验证码：</span>
        <el-input placeholder="请输入" v-model="code" class="input-with-select">
          <template slot="append">
            <el-button
              size="mini"
              type="primary"
              :disabled="!!timer"
              :loading="codeBtnLoading"
              @click="getCode"
              >{{ buttonValue }}</el-button
            >
          </template>
        </el-input>
      </div>
      <p class="timerTip" v-show="timer">验证码已发送到您的注册手机</p>
      <span slot="footer">
        <el-button type="primary" @click="toSure">确 定</el-button>
      </span>
    </el-dialog>
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
      bankName: "",
      bankNo: "",
      bankAddress: "", // 支行地址
      countryId: "",
      type: "添加",
      dialogVisible: false,
      code: "",
      buttonValue: "获取验证码",
      timer: null,
      codeBtnLoading: false,
    }
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    // todo 注意添加或修改之前判断是否实名认证额了，等待接口修改好后再完成这个
    this.type = this.$route.query.type ? "修改" : "添加";
    if (this.$store.state.bankInfo) {
      this.bankName = this.$store.state.bankInfo.bankName;
      this.bankNo = this.$store.state.bankInfo.bankNo;
      this.bankAddress = this.$store.state.bankInfo.bankAddress;
      this.countryId = this.$store.state.bankInfo.countryId;
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    showDialog() {
      // if (isNull(this.bankNo) || !bankNoReg(this.bankNo)) {
      //   Toast("请输入银行卡号");
      // } else if (isNull(this.bankName) || !isName(this.bankName)) {
      //   Toast("请输入银行名称");
      // } else if (isNull(this.bankAddress) || !isName(this.bankAddress)) {
      //   Toast("请输入开户支行");
      // } else {
      this.dialogVisible = true;
      this.code = "";
      this.buttonValue = "获取验证码";
      this.codeBtnLoading = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      // }
    },
    getCode() {
      if (this.timer) {
        return;
      }
      let opts = {
        phoneNum: this.$store.state.userInfo.phone,
      };
      this.codeBtnLoading = true
      const res = api.sendAddBankSms(opts);
      this.codeBtnLoading = false
      if (res.status === 0) {
      Toast(res.msg);
      let time = 60;
      this.buttonValue = `${time}s`;
      this.timer = setInterval(() => {
        time--;
        this.buttonValue = `${time}s`;
        if (time == 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.buttonValue = "获取验证码";
        }
      }, 1000);
      } else {
        Toast(res.msg);
      }
    },
    async toSure() {
      // 添加银行卡
      if (!this.code) {
        Toast("请输入验证码");
      } else {
        let opts = {
          bankName: this.bankName,
          bankNo: this.bankNo,
          bankAddress: this.bankAddress,
          countryId: this.countryId,
          code: this.code
        };
        if (this.$route.query.type == "edit") {
          let data = await api.updateBankCard(opts);
          if (data.status == 0) {
            Toast("修改成功!");
            this.$router.push("/card");
          } else {
            Toast(data.msg);
          }
        } else {
          let data = await api.addBankCard(opts);
          if (data.status == 0) {
            Toast("添加成功!");
            this.$router.push("/card");
          } else {
            Toast(data.msg);
          }
        }
      }
    },
    goBack() {
      this.$router.back(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.rule-box {
  padding: 0.2rem 0.3rem;

  .title {
    font-size: 0.3rem;
    height: 0.5rem;
    line-height: 0.5rem;
    margin-bottom: 0.2rem;
  }

  ul {
    li {
      color: #999;
      line-height: 0.5rem;
    }
  }
}

/deep/ .countryIdField {
  .mint-field-core {
    display: none;
  }
  .mint-cell-value {
    padding-right: 0.1rem;
  }
  .mint-field-other {
    width: 100%;
    select {
      width: 100%;
      height: 0.7rem;
      background: #21252a;

      option {
        color: #fff;
      }
    }
  }
}

.submitDialog {
  /deep/ .el-dialog {
    background-color: #21252a;
    .title {
      color: #fff;
      text-align: center;
      font-size: 0.3rem;
      line-height: 0.4rem;
    }
    .el-dialog__header {
      .el-dialog__title {
        color: #fff;
      }
    }
    .flexDiv {
      display: flex;
      align-items: center;
      margin-top: 0.3rem;
      > span {
        color: #fff;
        flex-shrink: 0;
      }
    }
    .timerTip {
      color: #eee;
      text-align: right;
      margin-top: 0.3rem;
    }
  }
}
</style>
