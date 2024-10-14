<template>
  <div class="wrapper">
    <mt-navbar class="top-navbar" v-model="selected" fixed>
      <mt-tab-item class="top-nav-item" id="1">基金列表</mt-tab-item>
      <mt-tab-item class="top-nav-item" id="2">我的基金</mt-tab-item>
      <mt-tab-item class="top-nav-item" id="3">资金明细</mt-tab-item>
      <mt-tab-item class="top-nav-item" id="4">我的邀请</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item id="1">
        <FundsList ref="indexList1" :selectedNumber='selected'/>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <PositionsList ref="indexList2" :selectedNumber='selected'/>
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        <FinancialList ref="indexList3" :selectedNumber='selected'/>
      </mt-tab-container-item>
      <mt-tab-container-item id="4">
        <InviteView ref="indexList4" :selectedNumber='selected'/>
      </mt-tab-container-item>
    </mt-tab-container>
    <Foot></Foot>
  </div>
</template>

<script>
import Foot from '@/components/foot/foot'
import FundsList from './funds-list.vue'
import PositionsList from './positions-list.vue'
import FinancialList from './financial-list.vue'
import InviteView from './invite-index.vue'

export default {
  components: {
    Foot,
    FundsList,
    PositionsList,
    FinancialList,
    InviteView
  },
  props: {},
  data () {
    return {
      selected: '1' // 选中
    }
  },
  watch: {
    selected: {
      handler (val) {
        this.$nextTick(() => {
          this.$refs[`indexList${val}`].pageNum = 1
          this.$refs[`indexList${val}`].getList()
        })
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  background-color: #16171d;
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
  top: 1rem !important;
  background-color: #16171D !important;
  justify-content: center;

  .mint-tab-item {
    padding: 0.3rem 0;
    background-color: #16171D;

  }

  .top-nav-item {
    position: relative;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    width: 1.5rem;

    /deep/ .mint-tab-item-label {
      font-size: .24rem;
    }
  }

  .top-nav-item.is-selected {
    color: #fff;
  }

  .top-nav-item.is-selected :after {
    display: block;
    content: '';
    position: absolute;
    width: .7rem;
    height: .06rem;
    background-color: #138EB4;
    left: .4rem;
    bottom: 0.05rem;
  }
}

/deep/ .order-info-box {
  background-color: #08080D;

  .main {
    font-size: .3rem;
  }

  .order-title {
    border-bottom: none;
    height: 0.7rem;

    .space {
      font-size: .24rem;
    }

    .type-up {
      color: #fff;
      border: none;
      background-image: url(../../assets/ico/zhang.png);
      background-size: cover;
      padding-left: .2rem;
    }

    .type-down {
      color: #fff;
      border: none;
      background-image: url(../../assets/ico/die.png);
      background-size: cover;
      padding-left: .2rem;
    }
  }

  .code {
    margin-bottom: .3rem;
  }

  .table-title {
    font-size: .24rem;

  }

  .table-value {
    font-size: .24rem;
    color: #ccc;
  }

  .order-foot {
    padding: 0;

    .foot-btn {
      border-color: #B12525;
      background-color: #B12525;
      color: #fff;
      padding: 0 0.1rem;
      height: .34rem;
      line-height: .34rem;
      font-size: .2rem;
    }
  }
}

#app.red-theme {
  .top-navbar {
    background-color: #E9E9E9 !important;

    .mint-tab-item {
      background-color: #E9E9E9;
    }

    .top-nav-item.is-selected {
      color: #000;
    }

    .top-nav-item.is-selected :after {
      background-color: #BB1815;
    }
  }

  .sub-navbar {
    background-color: #E9E9E9;
  }

  .wrapper {
    background-color: #E9E9E9;
  }

  .load-all {
    background: #fff !important;
  }

}

/deep/ .red-theme .order-info-box {
  background-color: #fff;
}
</style>
