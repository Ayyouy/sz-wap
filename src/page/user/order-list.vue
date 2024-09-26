<template>
  <div class="wrapper">
    <!-- <mt-navbar class="top-navbar" v-model="selected" fixed>
      <mt-tab-item
      class="top-nav-item"
      v-if="this.$store.state.settingForm.stockDisplay" id="1">沪深账户</mt-tab-item>
      <mt-tab-item
      class="top-nav-item"
      v-if="this.$store.state.settingForm.indexDisplay" id="2">指数账户</mt-tab-item>
     <mt-tab-item id="3">科创</mt-tab-item> 
      <mt-tab-item
      class="top-nav-item"
      v-if="this.$store.state.settingForm.futuresDisplay" id="4">期货账户</mt-tab-item>
    </mt-navbar> -->
    <!-- <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item v-if="this.$store.state.settingForm.stockDisplay" id="1">
        <List1 :selectedNumber='selected'/>
      </mt-tab-container-item>
      <mt-tab-container-item v-if="this.$store.state.settingForm.indexDisplay" id="2">
        <List2 :selectedNumber='selected'/>
      </mt-tab-container-item>
      <mt-tab-container-item v-if="this.$store.state.settingForm.futuresDisplay" id="4">
        <List4 :selectedNumber='selected'/>
      </mt-tab-container-item>
    </mt-tab-container> -->

    <mt-navbar class="top-navbar" v-model="selected">
      <!-- <mt-tab-item id="0">全部</mt-tab-item> -->
      <!-- v-if="this.$store.state.settingForm.stockDisplay" -->
      <mt-tab-item class="long" id="1">香港股市</mt-tab-item>
      <!-- v-if="this.$store.state.settingForm.stockDisplay" -->
      <mt-tab-item class="long" id="2">美国股市</mt-tab-item>
      <!-- v-if="this.$store.state.settingForm.stockDisplay" -->
      <mt-tab-item class="long" id="4">印度股市</mt-tab-item>
      <!-- v-if="this.$store.state.settingForm.stockDisplay" -->
      <mt-tab-item class="long" id="3">日本股市</mt-tab-item>
      <!-- v-if="this.$store.state.settingForm.futuresDisplay" -->
      <mt-tab-item id="5">期货</mt-tab-item>
      <!--  v-if="this.$store.state.settingForm.indexDisplay" -->
      <mt-tab-item id="6">指数</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="order-list" v-model="selected">
      <!-- <mt-tab-container-item id="0">
          <List0 :changeNavOptions='changeNavOptions'/>
      </mt-tab-container-item> -->
      <!-- v-if="this.$store.state.settingForm.indexDisplay" -->
      <mt-tab-container-item id="1">
        <List4Country :selectedNumber="selected" />
      </mt-tab-container-item>
      <!-- v-if="this.$store.state.settingForm.stockDisplay" -->
      <mt-tab-container-item id="2">
        <List4Country :selectedNumber="selected" />
      </mt-tab-container-item>
      <!-- v-if="this.$store.state.settingForm.kcStockDisplay" -->
      <mt-tab-container-item id="3">
        <List4Country :selectedNumber="selected" />
      </mt-tab-container-item>
      <!-- v-if="this.$store.state.settingForm.futuresDisplay" -->
      <mt-tab-container-item id="4">
        <List4Country :selectedNumber="selected" />
      </mt-tab-container-item>
      <!-- v-if="this.$store.state.settingForm.stockDisplay" -->
      <mt-tab-container-item id="5">
        <List2 :selectedNumber="selected" />
      </mt-tab-container-item>
      <!-- v-if="this.$store.state.settingForm.stockDisplay" -->
      <mt-tab-container-item id="6">
        <List4 :selectedNumber="selected" />
      </mt-tab-container-item>
    </mt-tab-container>
    <foot></foot>
  </div>
</template>

<script>
import foot from "@/components/foot/foot";
// import '@/assets/style/common.less'
// import List1 from "./order-list1";
import List2 from "./order-list2";
// import List3 from "./order-list3";
import List4 from "./order-list4";
import List4Country from "./order-list-4country";
import * as api from "@/axios/api";
import { Toast } from "mint-ui";

export default {
  components: {
    foot,
    // List1,
    List2,
    // List3,
    List4,
    List4Country
  },
  props: {},
  data() {
    return {
      selected: "1" // 选中
    };
  },
  watch: {},
  computed: {},
  created() {
    if (!this.$store.state.userInfo.phone) {
      this.getUserInfo();
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.selected = this.$route.query.index;
    }
    this.getProductSetting();
  },
  methods: {
    async getUserInfo() {
      // 获取用户信息
      let data = await api.getUserInfo();
      if (data.status === 0) {
        this.$store.state.userInfo = data.data;
      } else {
        Toast(data.msg);
      }
    },
    async getProductSetting() {
      let data = await api.getProductSetting();
      if (data.status === 0) {
        this.$store.state.settingForm = data.data;
      } else {
        this.$message.error(data.msg);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  background-color: #16171d;
  .top-navbar {
    background: none;
    box-shadow: none;
    /deep/.mint-tab-item {
      .mint-tab-item-label {
        font-size: 0.28rem;
        font-family: MicrosoftYaHeiLight;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
      &.is-selected {
        position: relative;
        background: linear-gradient(
          0deg,
          rgba(27, 166, 208, 1),
          rgba(2, 116, 150, 1)
        );
        &::after {
          position: absolute;
          content: "";
          display: block;
          width: 0.67rem;
          height: 0.06rem;
          background-color: #138eb4;
          bottom: 0;
          left: 50%;
          margin-left: -0.335rem;
          display: none;
        }
      }
    }
  }
  .order-list {
    width: 100%;
    height: 100%;
    /deep/.mint-tab-container-wrap {
      width: 100%;
      height: 100%;
    }
  }
}
.is-selected .mint-tab-item-label:hover {
  text-decoration: none;
}

.wrapper /deep/ .mint-tab-item-label {
  font-size: 0.264rem;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 2px solid #d50000;
  text-decoration: none;
  box-shadow: none;
}

.mint-tab-container-item {
  padding-top: 0.8rem;

  .mint-button--default {
    padding: 0 0.2rem;
    font-size: 0.24rem;
    height: 0.5rem;
    margin: 0.2rem 0.2rem 0;
    color: #607d8b;
    box-shadow: 0 0 1px #3b71b9;
    background: none;
  }
}

.mint-navbar {
  // box-shadow: 0px 0px 4px rgba(6,0,1,0.2);
  .mint-tab-item {
    padding: 0.2rem 0;

    &.is-selected {
      border: none;
      margin-bottom: 0;
    }

    .mint-tab-item-label {
      font-size: 0.22rem;
    }

    .iconfont {
      display: block;
      font-size: 0.46rem;
      margin-bottom: 0.12rem;
    }
  }
}

.top-navbar {
  .mint-tab-item {
    padding: 0.2rem 0;
    width: 1.42rem;
    height: 0.44rem;
    margin: 0.3rem 0.1rem 0 0.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.01rem;
    &.long {
      flex: 2;
    }
  }
}
/deep/.order-info-box {
  background-color: #08080d;
  .main {
    font-size: 0.3rem;
  }
  .order-title {
    border-bottom: none;
    height: 0.7rem;
    .space {
      font-size: 0.24rem;
    }
    .type-up {
      color: #fff;
      border: none;
      background-image: url(../../assets/ico/zhang.png);
      background-size: cover;
      padding-left: 0.2rem;
    }
    .type-down {
      color: #fff;
      border: none;
      background-image: url(../../assets/ico/die.png);
      background-size: cover;
      padding-left: 0.2rem;
    }
  }
  .code {
    margin-bottom: 0.3rem;
  }
  .table-title {
    font-size: 0.24rem;
  }
  .table-value {
    font-size: 0.24rem;
    color: #ccc;
  }
  .order-foot {
    padding: 0;
    .foot-btn {
      border-color: #b12525;
      background-color: #b12525;
      color: #fff;
      padding: 0 0.1rem;
      height: 0.34rem;
      line-height: 0.34rem;
      font-size: 0.2rem;
    }
  }
}

#app.red-theme {
  .top-navbar {
    background-color: #e9e9e9 !important;
    .mint-tab-item {
      background-color: #e9e9e9;
    }
    .top-nav-item.is-selected {
      color: #000;
    }
    .top-nav-item.is-selected :after {
      background-color: #bb1815;
    }
  }
  .sub-navbar {
    background-color: #e9e9e9;
  }
  .wrapper {
    background-color: #e9e9e9;
  }
  .load-all {
    background: #fff !important;
  }
}
/deep/.red-theme .order-info-box {
  background-color: #fff;
}
</style>
