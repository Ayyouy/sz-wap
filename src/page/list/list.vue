<template>
  <div class="wrapper">
    <mt-navbar class="top-navbar" v-model="selected">
      <mt-tab-item class="long" id='2'>{{ $t('market.us') }}</mt-tab-item>
      <mt-tab-item class="long" id='3'>{{ $t('market.jp') }}</mt-tab-item>
      <mt-tab-item class="long" id='1'>{{ $t('market.hk') }}</mt-tab-item>
      <mt-tab-item class="long" id='4'>{{ $t('market.in') }}</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item id="1">
        <List1 :selectedNumber="selected"/>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <List2 :selectedNumber="selected"/>
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        <List3 :selectedNumber="selected"/>
      </mt-tab-container-item>
      <mt-tab-container-item id="4">
        <List4 :selectedNumber="selected"/>
      </mt-tab-container-item>
    </mt-tab-container>
    <Foot></Foot>
  </div>
</template>

<script>
import Foot from '@/components/foot/foot'
import List1 from './list-1country'
import List2 from './list-2country'
import List3 from './list-3country'
import List4 from './list-4country'
import * as api from '@/axios/api'

export default {
  components: {
    Foot,
    List1,
    List2,
    List3,
    List4
  },
  data () {
    return {
      selected: '1'
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
  background-color: #16171d;
  //width: 100%;
  //height: 100%;
  //position: relative;
  //box-sizing: border-box;
  //padding-top: 1rem;

  .top-navbar {
    //width: 100%;
    //position: absolute;
    //top: 0;
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
