<template>
  <div class="wrapper">
    <mt-navbar class="top-navbar" v-model="selected">
      <mt-tab-item class="long" id="1">{{ $t('to.deposit') }}</mt-tab-item>
      <mt-tab-item class="long" id="2">{{ $t('to.report') }}</mt-tab-item>
      <mt-tab-item class="long" id="3">{{ $t('to.inter') }}</mt-tab-item>
      <mt-tab-item class="long" id="4">{{ $t('to.other') }}</mt-tab-item>
    </mt-navbar>
    <div class="topBtn">
      <span class="screen" @click="dialogVisible=true">
        {{ $t('capital.screen') }}
      </span>
    </div>
    <div v-show="loading" class="load-all text-center">
      <mt-spinner type="fading-circle"></mt-spinner>
    </div>
    <div v-show="loaded && list.length>0" class="load-all text-center">
      {{ $t('market.loaded') }}
    </div>
    <div v-show="loaded && list.length==0" class="load-all text-center">
      {{ $t('market.empty') }}
    </div>
    <el-drawer
      size="46%"
      :title="$t('capital.screen')"
      direction="btt"
      :visible.sync="drawerShow">
      <el-form
        :model="searchForm"
        size="small"
        label-width="80px"
        label-position="top">
        <el-form-item :label="$t('capital.state')">
          <el-radio-group v-model="searchForm.orderStatus">
            <el-radio label="" border style="border: none">{{ $t('capital.total') }}</el-radio>
            <el-radio label="1" border style="border: none">{{ $t('capital.success') }}</el-radio>
            <el-radio label="2" border style="border: none">{{ $t('capital.failed') }}</el-radio>
            <el-radio label="3" border style="border: none">{{ $t('capital.wait') }}222</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('capital.time')">
          <el-date-picker
            v-model="searchForm.orderDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            :start-placeholder="$t('msg8')"
            :end-placeholder="$t('msg9')"
            value-format="yyyy-MM-dd"
            style="border:none">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('capital.order')">
          <input v-model="searchForm.orderSn" class="el-input__inner" :placeholder="$t('capital.input')"/>
        </el-form-item>
        <el-form-item class="footer">
          <el-button @click="clearForm">{{ $t('capital.cancel') }}</el-button>
          <el-button type="primary" @click="searchSubmit">{{ $t('capital.confirm') }}</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!--    <mt-tab-container class="order-list" v-model="selected">-->
    <!--      <mt-tab-container-item id="1">-->
    <!--        <MoneyList1 :selectedNumber="selected"/>-->
    <!--      </mt-tab-container-item>-->
    <!--      <mt-tab-container-item id="2">-->
    <!--        <MoneyList2 :selectedNumber="selected"/>-->
    <!--      </mt-tab-container-item>-->
    <!--      <mt-tab-container-item id="3">-->
    <!--        <MoneyList3 :selectedNumber="selected"/>-->
    <!--      </mt-tab-container-item>-->
    <!--      <mt-tab-container-item id="4">-->
    <!--        <MoneyList4 :selectedNumber="selected"/>-->
    <!--      </mt-tab-container-item>-->
    <!--    </mt-tab-container>-->
  </div>
</template>

<script>
import MoneyList1 from './moneyList1'
import MoneyList2 from './moneyList2'
import MoneyList3 from './moneyList3'
import MoneyList4 from './moneyList4'

export default {
  components: {
    MoneyList1,
    MoneyList2,
    MoneyList3,
    MoneyList4
  },
  data () {
    return {
      selected: '1' // 选中
    }
  },
  mounted () {
    if (this.$route.query.index) {
      this.selected = this.$route.query.index
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  background-color: #16171d;

  .top-navbar {
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

/deep/ .order-info-box {
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

/deep/ .red-theme .order-info-box {
  background-color: #fff;
}

.el-input__inner {
  border: none !important;
  box-shadow: none !important;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  width: 100%
}

</style>
