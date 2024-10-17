<template>
  <div id="app" :class="`${$state.theme === 'red' ? 'red-theme' : 'black-theme'}`">
    <div :class="`header-box`">
      <mt-header :title="title">
        <template>
          <mt-button v-show="iconLeft" icon="back" slot="left" @click="$router.back()"></mt-button>
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
    this.title = this.$route.meta.title
    this.iconLeft = this.$route.meta.iconLeft
  },
  watch: {
    $route (val) {
      this.title = val.meta.title
      this.iconLeft = val.meta.iconLeft
    }
  },
  data () {
    return {
      title: '',
      iconLeft: true
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
