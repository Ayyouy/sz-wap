<template>
  <div :class="`list-content-wrapper ${      $state.theme === 'red' ? 'red-theme' : 'black-theme'    }`">
    <ul class="table-list list-table-title">
      <li class="title">
        <div>
          <ul class="clearfix">
            <li class="li-title">名称<img :src="sortIcon" alt=""/></li>
            <li class="li-base">最新<img :src="sortIcon" alt=""/></li>
            <li class="li-base">涨幅<img :src="sortIcon" alt=""/></li>
            <li class="li-base">涨跌<img :src="sortIcon" alt=""/></li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="list-table-body">
      <ul
        class="table-list table-list-body"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <li class="list-body" v-for="item in list" :key="item.code">
          <div>
            <ul class="clearfix"
                :class="item.floatPoint < 0? 'green': item.floatPoint == 0? '': 'red'"
                @click="toDetail(item)">
              <li class="li-title">
                <div class="titleContainer">
                  <img
                    @click.stop="toDeleteMy(item)"
                    v-if="item.isOption == '1'"
                    :src="
                      require(`../../../static/img/list/${
                        $state.theme === 'red' ? 'red-' : ''
                      }loved-icon.png`)
                    "
                    alt=""
                  />
                  <img
                    v-else
                    @click.stop="addOptions(item)"
                    :src="
                      require(`../../../static/img/list/${
                        $state.theme === 'red' ? 'red-' : ''
                      }love-icon.png`)
                    "
                    alt=""
                  />
                  <!-- 无折扣,code放下面, 名字放上面 -->
                  <div class="content" v-if="+item.discount <= 0">
                    <p class="name name1">
                      {{
                        item.code
                      }}
                    </p>
                    <p class="code code-wra" style="padding-left: 0px">
                      <span class="futures-code code1">{{ item.name }}</span>
                    </p>
                  </div>
                  <!-- 有折扣,code放上面, 名字放下面 -->
                  <div class="content" v-else>
                    <p class="code code-wra" style="padding-left: 0px">
                      <span class="futures-code code2">{{
                          item.code
                        }}</span>
                      <span class="discount">%{{ (item.discount * 100).toFixed(0) }}</span>
                    </p>
                    <p class="name name2">
                      {{ item.name }}
                    </p>
                  </div>
                </div>
              </li>
              <li class="li-base">
                <span :style="item.nowPrice>0?'color:green;':'color:red;'">{{
                    item.nowPrice ? Number(item.nowPrice).toFixed(2) : '-'
                  }}</span>
              </li>
              <li class="li-base">
                <span :style="item.nowPrice>0?'color:green;':'color:red;'" v-if="item.nowPrice == 0">-</span>
                <span :style="(item.nowPrice-item.preclose_px)>0?'color:green;':'color:red;'"
                      v-else-if="item.nowPrice-item.preclose_px>0">{{ item.hcrate ? item.hcrate : '0' }}%</span>
                <span :style="(item.nowPrice-item.preclose_px)<0?'color:red;':'color:green;'"
                      v-else-if="item.nowPrice-item.preclose_px <0">{{ item.hcrate ? item.hcrate : '0' }}%</span>
              </li>
              <li class="li-base no-bold">
                <span :style="item.nowPrice>0?'color:green;':'color:red;'" v-if="item.nowPrice == 0">-</span>
                <span :style="(item.nowPrice-item.preclose_px)>0?'color:green;':'color:red;'"
                      v-else-if="item.nowPrice-item.preclose_px>0">{{
                    (item.nowPrice - item.preclose_px).toFixed(2)
                  }}</span>
                <span :style="(item.nowPrice-item.preclose_px)<0?'color:red;':'color:green;'"
                      v-else-if="item.nowPrice-item.preclose_px <0">{{
                    (item.nowPrice - item.preclose_px).toFixed(2)
                  }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-if="list.length <= 0" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
      </div>
      <div v-show="loading" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
        加载中...
      </div>
      <div v-show="!loading && list.length > 0" class="load-all text-center">
        已全部加载
      </div>
    </div>
    <foot></foot>
  </div>
</template>

<script>
import foot from '../../components/foot/foot'
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  components: {
    foot
  },
  props: {
    selectedNumber: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 15,
      currentNum: 15,
      list: [],
      timer: '',
      sortIcon: require('../../../static/img/list/sort-icon.png')
    }
  },
  watch: {
    selectedNumber (val) {
      if (val) {
        this.getStock()
        clearInterval(this.timer)
        this.timer = setInterval(this.refreshList, 5000)
      } else {
        clearInterval(this.timer)
      }
    }
  },
  mounted () {
    this.getStock()
  },
  methods: {
    async addOptions (val) {
      let data = await api.addOption({code: val.code})
      if (data.status === 0) {
        Toast('添加自选成功')
        await this.getStock()
      } else {
        Toast(data.msg)
      }
    },
    async toDeleteMy (val) {
      let data = await api.delOption({code: val.code})
      if (data.status === 0) {
        Toast('删除自选股成功')
        await this.getStock()
      } else {
        Toast(data.msg)
      }
    },
    async getStock () {
      let opt = {
        countryId: this.selectedNumber
      }
      // 获取股票列表
      let result = await api.getStock(opt)
      if (result) {
        if (result.status === 0) {
          this.list = result.data.list
        } else {
          Toast(result.msg)
        }
      }
    },
    async refreshList () {
      // 刷新指数
      if (this.loading) {
        return
      }
      let opt = {
        pageNum: 1,
        pageSize: this.currentNum,
        countryId: this.selectedNumber
      }
      let data = await api.getStock(opt)
      this.list = data.data
    },
    async loadMore () {
      if (this.list.length < 100) {
        return
      }
      this.loading = true
      // clearInterval(this.timer)
      // 加载下一页
      this.pageNum++
      this.currentNum = this.pageNum * this.pageSize
      await this.getStock()
      this.loading = false
    },
    async toDetail (val) {
      await this.$router.push({
        path: '/list4countryDetail',
        query: {
          code: val.code,
          areaId: this.selectedNumber
        }
      })
    },
    toSearch () {
      this.$router.push('/indexsearchlist')
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  padding-bottom: 1.6rem;
}

.table-list-body {
  // padding-top: 0.62rem;
  // margin-top: 26px;
}

.table-list {
  ul {
    .li-title {
      width: 28%;

      .name {
        .iconfont {
          background: none;
          color: #d50000;

          &.icon-jinzhi {
            color: #ff9800;
          }
        }
      }
    }
  }

  .li-base {
    width: 24%;
    text-align: center;

    &.no-bold {
      span {
        font-weight: 400;
      }
    }
  }
}

.footer-btn {
  position: fixed;
  z-index: 1;
  width: 100%;
  padding-right: 0;
  bottom: 0.94rem;
  padding: 0.2rem;
  // height: 1.1rem;
  // line-height: .1rem;
  box-shadow: 0px 0px 4px rgba(6, 0, 1, 0.2);

  .iconfont {
    margin: 0 0.1rem;
    font-size: 0.28rem;

    &.yellow {
      color: #ff9800;
    }
  }
}

.list-content-wrapper {
  width: 100%;
  height: 100%;
  position: relative;

  .list-table-title {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;

    .title {
      position: relative;
      top: 0;
      left: 0;

      ul {
        li {
          font-size: 0.28rem;
          font-family: MicrosoftYaHeiLight;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 0.15rem;
            margin-left: 0.06rem;
          }

          &.li-title {
            width: 40%;
          }

          &.li-base {
            width: 20%;
          }
        }
      }
    }
  }

  .list-table-body {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    padding-top: 0.6rem;

    ul {
      li.li-base {
        width: 20%;

        span {
          font-size: 0.26rem;
          font-family: MicrosoftYaHeiLight;
          font-weight: 400;
        }
      }

      .li-title {
        width: 40%;

        .titleContainer {
          height: 100%;
          display: flex;
          align-items: center;

          img {
            width: 0.5rem;
            height: 0.5rem;
            margin-right: 0.05rem;
          }

          .content {
            display: flex;
            flex-direction: column;

            .name {
              color: #fff;
              width: 100%;
              display: flex;
              align-items: center;
              margin-top: 0.05rem;

              &.name2 {
                font-size: 0.22rem;
              }
            }

            .code-wra {
              width: 1.35rem;
              height: 0.38rem;
              display: block;
              // background-color: #138EB4;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              border-radius: 0.05rem;
              color: white;
              position: relative;

              span {
                color: white;
                border: 0;
              }

              &::before {
                content: "";
                display: block;
                width: 0;
                height: 0;
                border-top: 0.1rem solid transparent;
                border-right: 0.15rem solid #138eb4;
                border-bottom: 0.1rem solid transparent;
                position: absolute;
                left: 0;
                top: 50%;
                margin-top: -0.095rem;
                left: -0.1rem;
                display: none;
              }

              .futures-code {
                padding: 0;

                &.code2 {
                  font-size: 0.28rem;
                  margin-top: 0.05rem;
                }
              }

              .discount {
                color: red;
                border-radius: 0.08rem;
                border: 0.02rem solid red;
                padding: 0.02rem;
                margin-left: 0.1rem;
              }
            }
          }
        }
      }
    }
  }
}

.red-theme {
  background: white;

  .table-list {
    ul {
      li {
        border-color: #f7f7f7;
      }
    }
  }

  .list-table-title {
    .title {
      background: white;

      ul {
        li {
          color: #212121;
        }
      }
    }
  }

  .list-table-body {
    li.li-title {
      .name {
        color: #000;
      }

      .futures-code {
        color: #bb1715 !important;
      }
    }
  }

  .load-all {
    background-color: #e9e9e9;
    color: #000;
  }
}
</style>
