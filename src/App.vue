<template>
  <div id="app" :class="`${$state.theme === 'red' ? 'red-theme' : 'black-theme'}`">
    <div :class="`header-box`" v-if="hasHeader">
      <mt-header :title="title">
        <template v-if="iconLeft == 'default'">
          <mt-button icon="back" slot="left" @click="$router.go(-1)"></mt-button>
        </template>
        <template v-else>
        </template>
        <template v-if="iconRight == 'search'">
          <img slot="right" class="search-right" src="./assets/ico/fangdajing.png" alt="">
        </template>
        <template v-else-if="iconRight == 'default'">
          <mt-button icon="more" slot="right"></mt-button>
        </template>
        <template v-else>
        </template>
      </mt-header>
    </div>
    <div class="body-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.title = this.$route.meta.title || '首页'
    if (this.$route.meta.hasHeader) {
      this.hasHeader = true
    } else {
      this.hasHeader = false
    }
    if (this.$route.meta.iconRight) {
      this.iconRight = this.$route.meta.iconRight
    } else {
      this.iconRight = 'default'
    }
    if (this.$route.meta.iconLeft) {
      this.iconLeft = this.$route.meta.iconLeft
    } else {
      this.iconLeft = 'default'
    }
  },
  watch: {
    $route (val) {
      let title = val.meta.title || '首页'
      this.title = title

      if (val.meta.iconRight) {
        this.iconRight = val.meta.iconRight
      } else {
        this.iconRight = 'default'
      }
      if (val.meta.hasHeader) {
        this.hasHeader = true
      } else {
        this.hasHeader = false
      }
    }
  },
  data () {
    return {
      title: '首页',
      hasHeader: false,
      iconRight: 'default',
      iconLeft: 'default'
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .header-box {
    width: 100%;
    height: 1rem;

    /deep/ .mint-header {
      height: 100%;
      background-color: rgba(20, 45, 55, 0.3);

      .is-left {
        .mintui {
          font-size: 20px;
        }
      }

      .mint-header-title {
        font-size: 0.36rem;
        color: rgba(255, 255, 255, 1);
      }

    }

    button {
      outline: none;
    }
  }

  .body-box {
    width: 100%;
    height: calc(100% - 1rem);
    box-sizing: border-box;
    overflow-y: auto;
  }

  &.red-theme {
    background: #E9E9E9;

    /deep/ .mint-header {
      background: none;

      .mint-header-title {
        font-size: 0.36rem;
        color: #212121;
      }

      .mintui {
        color: #212121;
      }
    }
  }

  &.black-theme {
    background: #16171d;
  }
}

.search-right {
  width: .3rem;
  height: .3rem;
}

.mint-search-list {
  position: relative !important;
}
</style>
