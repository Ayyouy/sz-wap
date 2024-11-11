<template>
  <div :class="`wrapper ${$state.theme === 'red' ? 'red-theme' : 'black-theme'}`">
    <!--    :fixed="selected != '2' ? true : false"-->
    <mt-navbar class="top-navbar" v-model="selected" :fixed="selected != '2' ? true : false">
      <mt-tab-item class="long" v-if="stockDisplay" id="6">美国股市</mt-tab-item>
      <mt-tab-item class="long" v-if="stockDisplay" id="8">日本股市</mt-tab-item>
      <mt-tab-item class="long" v-if="stockDisplay" id="5">香港股市</mt-tab-item>
      <mt-tab-item class="long" v-if="stockDisplay" id="7">印度股市</mt-tab-item>
      <mt-tab-item v-if="futureDisplay" id="4">期货</mt-tab-item>
      <mt-tab-item v-if="indexDisplay" id="1">指数</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item v-if="indexDisplay" id="1">
        <List1 :selectedNumber="selected"/>
      </mt-tab-container-item>
      <mt-tab-container-item v-if="stockDisplay" id="2">
        <List2 :selectedNumber="selected"/>
      </mt-tab-container-item>
      <mt-tab-container-item v-if="kcDisplay" id="3">
        <List3 :selectedNumber="selected"/>
      </mt-tab-container-item>
      <mt-tab-container-item v-if="futureDisplay" id="4">
        <List4 :selectedNumber="selected"/>
      </mt-tab-container-item>
      <mt-tab-container-item v-if="stockDisplay" id="5">
        <List5 selectedNumber="1"/>
      </mt-tab-container-item>
      <mt-tab-container-item v-if="stockDisplay" id="6">
        <List5 selectedNumber="2"/>
      </mt-tab-container-item>
      <mt-tab-container-item v-if="stockDisplay" id="7">
        <List5 selectedNumber="4"/>
      </mt-tab-container-item>
      <mt-tab-container-item v-if="stockDisplay" id="8">
        <List5 selectedNumber="3"/>
      </mt-tab-container-item>
    </mt-tab-container>
    <foot></foot>
  </div>
</template>

<script>
import foot from '@/components/foot/foot'
import List1 from './list-index'
import List2 from './list-stock'
import List3 from './list-kechuang'
import List4 from './list-futures'
import List5 from './list-4country'
import * as api from '@/axios/api'
import {Toast} from 'mint-ui'

export default {
  components: {
    foot,
    List1,
    List2,
    List3,
    List4,
    List5
  },
  props: {},
  data () {
    return {
      selected: '', // 选中
      stockDisplay: this.$store.state.settingForm.stockDisplay,
      futureDisplay: this.$store.state.settingForm.futuresDisplay,
      indexDisplay: this.$store.state.settingForm.indexDisplay,
      kcDisplay: this.$store.state.settingForm.kcStockDisplay
    }
  },
  created () {
    this.getProductSetting()
    if (!this.$store.state.userInfo.phone) {
      this.getUserInfo()
    }
  },
  mounted () {
    if (this.$route.query.index) {
      this.selected = this.$route.query.index
      console.log('list selected：', this.selected)
    }
  },
  methods: {
    async getUserInfo () {
      // 获取用户信息
      let data = await api.getUserInfo()
      if (data.status === 0) {
        this.$store.state.userInfo = data.data
      } else {
        Toast(data.msg)
      }
    },
    async getProductSetting () {
      let data = await api.getProductSetting()
      if (data.status === 0) {
        this.$store.state.settingForm = data.data
        this.stockDisplay = this.$store.state.settingForm.stockDisplay
        this.futureDisplay = this.$store.state.settingForm.futuresDisplay
        this.indexDisplay = this.$store.state.settingForm.indexDisplay
        this.kcDisplay = this.$store.state.settingForm.kcStockDisplay
        // 1 指数 2 沪深 3科创 4 期货
        if (this.stockDisplay) {
          this.selected = '5'
        } else if (this.indexDisplay) {
          this.selected = '1'
        } else if (this.kcDisplay) {
          this.selected = '3'
        } else {
          this.selected = '4'
        }
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.is-selected .mint-tab-item-label:hover {
  text-decoration: none;
}

.wrapper /deep/ .mint-tab-item-label {
  font-size: 0.264rem;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 2px solid #d50000;
  text-decoration: none;
}

.nav-wrapper {
  padding-top: 0.8rem;
}

.mint-tab-container-item {
  // padding-top: 1.2rem;

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
  box-shadow: 0px 0px 4px rgba(6, 0, 1, 0.2);

  .mint-tab-item {
    // background: #21252a;
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

.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding-top: 1rem;

  .top-navbar {
    position: absolute;
    top: 0;
    background: none;
    box-shadow: none;

    /deep/ .mint-tab-item {
      .mint-tab-item-label {
        font-size: 0.28rem;
        font-family: MicrosoftYaHeiLight;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }

      &.is-selected {
        position: relative;
        background: linear-gradient(0deg,
        rgba(27, 166, 208, 1),
        rgba(2, 116, 150, 1));

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

    /deep/ .mint-tab-container-wrap {
      width: 100%;
      height: 100%;
    }
  }
}

.top-search {
  padding: 0.2rem;

  .top-search-btn {
    background-color: #16171d;
    padding: 0.1rem 0.2rem;
    width: 1.6rem;
    text-align: center;
    border-radius: 0.2rem;
    color: #fff;
    border: 1px solid rgb(96, 125, 139);
    margin: 0 auto;
  }
}

.red-theme {
  .top-search-btn {
    border-color: #000;
    color: #000;
    background-color: #fff;
  }

  .top-navbar {
    /deep/ .mint-tab-item {
      background-color: #cbcbcb;

      .mint-tab-item-label {
        color: #000;
      }

      &.is-selected {
        background: #bb1715;

        .mint-tab-item-label {
          color: #fff;
        }
      }
    }
  }
}
</style>
