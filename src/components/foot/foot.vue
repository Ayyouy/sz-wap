<template>
  <div style="position: fixed;
    bottom: 0;
    width: 100%;"
       :class="`footer ${$state.theme === 'red' ? 'red-theme' : 'black-theme'}`">
    <mt-tabbar v-model="select">
      <mt-tab-item id="list" :class="$store.state.select == '/list' || $store.state.select == '/indexlist'? 'on' : ''">
        <img
          class="foot-icon"
          v-if="$store.state.select == '/list'"
          :src="require(`../../../static/img/foot/${$state.theme}/hangqing-active.png`)" alt="">
        <img
          class="foot-icon"
          v-else
          :src="require(`../../../static/img/foot/${$state.theme}/hangqing.png`)" alt="">
        <p v-if="$store.state.select == '/list'" :style="{color: $state.theme === 'black' ? '#138DB3' : '#C11815'}">
          {{$t('foot.quote')}}</p>
        <p v-else :style="{color: $state.theme === 'black' ? '#FFFFFF' : '#656565'}">{{$t('foot.quote')}}</p>
      </mt-tab-item>
      <mt-tab-item id="orderlist" :class="$store.state.select == '/orderlist' ? 'on' : ''">
        <img
          class="foot-icon"
          v-if="$store.state.select == '/orderlist'"
          :src="require(`../../../static/img/foot/${$state.theme}/chicang-active.png`)" alt="">
        <img
          class="foot-icon"
          v-else
          :src="require(`../../../static/img/foot/${$state.theme}/chicang.png`)" alt="">
        <p v-if="$store.state.select == '/orderlist'"
           :style="{color: $state.theme === 'black' ? '#138DB3' : '#C11815'}">{{$t('foot.position')}}</p>
        <p v-else :style="{color: $state.theme === 'black' ? '#FFFFFF' : '#656565'}">{{$t('foot.position')}}</p>
      </mt-tab-item>
      <mt-tab-item id="mylist" :class="$store.state.select == '/mylist' ? 'on' : ''">
        <img
          class="foot-icon"
          v-if="$store.state.select == '/mylist'"
          :src="require(`../../../static/img/foot/${$state.theme}/zixuan-active.png`)" alt="">
        <img
          class="foot-icon"
          v-else
          :src="require(`../../../static/img/foot/${$state.theme}/zixuan.png`)" alt="">
        <p v-if="$store.state.select == '/mylist'" :style="{color: $state.theme === 'black' ? '#138DB3' : '#C11815'}">
          {{$t('foot.choice')}}</p>
        <p v-else :style="{color: $state.theme === 'black' ? '#FFFFFF' : '#656565'}">{{$t('foot.choice')}}</p>

      </mt-tab-item>
      <mt-tab-item id="fundsnew" :class="$store.state.select == '/fundsnew' ? 'on' : ''">
        <img
          class="foot-icon"
          v-if="$store.state.select == '/fundsnew'"
          :src="require(`../../../static/img/foot/${$state.theme}/fund-active.png`)" alt="">
        <img
          class="foot-icon"
          v-else
          :src="require(`../../../static/img/foot/${$state.theme}/fund.png`)" alt="">
        <p v-if="$store.state.select == '/fundsnew'" :style="{color: $state.theme === 'black' ? '#138DB3' : '#C11815'}">
          {{$t('foot.fund')}}</p>
        <p v-else :style="{color: $state.theme === 'black' ? '#FFFFFF' : '#656565'}">{{$t('foot.fund')}}</p>
      </mt-tab-item>
      <mt-tab-item id="user" :class="$store.state.select == '/user' ? 'on' : ''">
        <img
          class="foot-icon"
          v-if="$store.state.select == '/user'"
          :src="require(`../../../static/img/foot/${$state.theme}/user-active.png`)" alt="">
        <img
          class="foot-icon"
          v-else
          :src="require(`../../../static/img/foot/${$state.theme}/user.png`)" alt="">
        <p v-if="$store.state.select == '/user'" :style="{color: $state.theme === 'black' ? '#138DB3' : '#C11815'}">
          {{$t('foot.my')}}</p>
        <p v-else :style="{color: $state.theme === 'black' ? '#FFFFFF' : '#656565'}">{{$t('foot.my')}}</p>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
// import eventBus from '@/event.js'

export default {
  data() {
    return {
      select: '',
      theme: 'black'
    }
  },
  mounted: function () {
    this.select = this.$store.state.select
  },
  watch: {
    select: {
      handler: function (newval, oldval) {
        // let tabList = ['home', 'list', 'orderlist', 'mylist', 'user']
        let tabList = ['list', 'orderlist', 'mylist', 'fundsnew', 'user']
        if (tabList.includes(newval)) {
          this.$store.state.select = newval
          this.select = newval
          this.$router.push(newval)
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
.black-theme {
  background-color: #040506;
}

.red-theme {
  background-color: #ffffff;
}

.foot-icon {
  width: 0.4rem;
  margin-top: 0.1rem;
  margin-bottom: 0.02rem;
}

/* .mint-tabbar > .mint-tab-item,
.mint-tabbar > .mint-tab-item.is-selected {
  color: #ff9600;
} */
.mint-tabbar {
  /* background: #ffffff; */
  height: 0.97rem;
}

.footer .mint-tabbar {
  /* background: #13161b; */
  background: none;
  box-shadow: 0px 0px 10px #c7c7c7;
  box-shadow: 0px 0px 4px rgba(6, 0, 1, 0.2);
}

.mint-tab-item-label .iconfont {
  display: block;
  font-size: 0.5rem;
  margin-top: 0.05rem;
  height: 0.5rem;
}

.mint-tab-item-label .icon-recharge,
.mint-tab-item-label .icon-rechargefill {
  font-size: 0.46rem;
}

.mint-tab-item-label .icon-xuanze,
.mint-tab-item-label .icon-xuanze2 {
  font-size: 0.38rem;
  padding-top: 0.02rem;
}

.mint-tab-item-label .icon-chicang {
  font-size: 0.36rem;
  margin-top: 0.1rem;
}

.red-theme .mint-tabbar {
  background-color: #ffffff !important;
}

.black-theme .mint-tabbar {
  background-color: #040506 !important;
}

</style>
