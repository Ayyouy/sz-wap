<template>
  <div class="wrapper">
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item id="4">
        <div class="header-bg" v-clipboard:copy="url + '#/register?code=' + code"
             v-clipboard:success="onCopySuccess"
             v-clipboard:error="onCopyError">
          <el-row class="self-el-row">
            <el-col :span="4" class="text-left">
              <span>{{ $t('invitation.link') }}</span>
            </el-col>
            <el-col :span="20" class="text-right">
              <span style="color: #1b8e5d">{{ url }}</span>
            </el-col>
          </el-row>
          <el-row class="self-el-row">
            <el-col :span="4" class="text-left">
              <span>{{ $t('invitation.code') }}</span>
            </el-col>
            <el-col :span="20" class="text-right">
              <span style="color: #1b8e5d">{{ code }}</span>
            </el-col>
          </el-row>
        </div>
        <div v-if="list.length<=0 && !loading" class="empty text-center">
          {{ $t('msg1') }}
        </div>
        <div v-if="list.length<=0 && loading" class="empty text-center">
          <mt-spinner type="fading-circle"></mt-spinner>
          {{ $t('market.loading') }}
        </div>
        <div v-if="list.length>0">
          <ul class="order-info-box-wrap"
              :infinite-scroll-disabled="loading"
              infinite-scroll-distance="0">
            <li v-for="(item) in list" :key="item.id">
              <div class="order-info-box">
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('invitation.name') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span>{{ item.realName }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('invitation.account') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span>{{ item.phone }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('invitation.bonus') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span>{{ item.recommendTotal }}</span>
                  </el-col>
                </el-row>
              </div>
            </li>
          </ul>
          <div v-show="loading" class="load-all text-center">
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div v-show="!loading" class="load-all text-center">
            {{ $t('market.loaded') }}
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <Foot></Foot>
  </div>
</template>

<script>
import Foot from '@/components/foot/foot'
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'
import APIUrl from '@/axios/api.url'

export default {
  components: {
    Foot
  },
  data () {
    return {
      loading: false,
      code: '',
      list: [],
      selected: '4', // 选中
      url: APIUrl.registerURL
    }
  },
  methods: {
    onCopySuccess () {
      // Toast('复制成功！')
      Toast(this.$t('recharge.success'))
    },
    onCopyError () {
      // Toast('复制失败，请重试！')
      Toast(this.$t('recharge.msgCopy'))
    },
    async getList () {
      this.loading = true
      let opts = {
        userId: this.$store.state.userInfo.id
      }
      let data = await api.invitations(opts)
      if (data.status === 0) {
        this.list = data.data.list
        this.code = data.data.code
      } else {
        Toast(data.msg)
      }
      this.loading = false
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
      // display: block;
      font-size: 0.46rem;
      margin-bottom: 0.12rem;
      vertical-align: middle;
      margin-right: 0.12rem;
    }
  }
}

.sub-navbar {
  background-color: #16171D !important;
  height: .7rem;
  justify-content: center;
  box-shadow: none;

  /deep/ .mint-tab-item-label {
    font-size: .24rem;
  }

  .mint-tab-item {
    position: relative;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    width: 1.4rem;
    height: .4rem;
    background-color: #3D4456;
    padding: 0;
    line-height: .4rem;
    margin: 0.3rem .2rem 0;

    /deep/ .mint-tab-item-label {
      line-height: .4rem;
      height: .4rem;
    }

    &.is-selected {
      color: #fff;
      background-color: #138EB4;
    }
  }
}

#app.red-theme {
  .sub-navbar {
    background-color: #E9E9E9 !important;

    .mint-tab-item {
      background-color: #CCCCCC;
      color: #000;

      &.is-selected {
        color: #fff;
        background-color: #BB1815;
      }
    }
  }
}

.self-el-row {
  padding-top: 20px;
  padding-bottom: 20px;
}

.btn-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding-bottom: 20px;
}

.header-bg {
  width: 100%;
  margin-left: 0.3rem;
  margin-right: 0.3rem;
}
</style>
