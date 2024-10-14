<template>
  <div class="wrapper">

    <div class="funds-list">
      <div style="display: flex;width: 80%;justify-content: space-between;margin: 0 auto;">
        <div class="funds-list-title" @click="shengouuu">
          申购
        </div>
        <div class="funds-list-title" @click="shengoulist">
          申购列表
        </div>
      </div>
      <div class="funds-list-item" v-for="(i, k) in shengou" :key="k" v-if="aaa == 'aaa' && i.zt == 1">
        <div class="funds-list-item__account clearfix" style="display: flex;align-items: center;">
          <div class="col-xs-3 account">
            <!-- 配资资金：17.63 股票可用金额：17.63 配资管理费：已结束 -->
            <div class="order-title">新股名称</div>
            <div class="order-money">{{ i.names || 0 }}</div>
          </div>
          <div class="col-xs-3 account">

            <div class="order-title">发行价格</div>
            <div class="order-money">{{ i.price || 0 }}</div>
          </div>
          <div class="col-xs-3 account">
            <!-- 保证金：100 股票市值：0 股票盈亏：0  -->
            <div class="order-title">申购代码</div>
            <div class="order-money">{{ i.code || 0 }}</div>
          </div>
          <div class="col-xs-3 account">
            <!-- <div class="order-title">状态</div>
            <div class="order-money">
                <span v-if="i.zt==0">已关闭</span>
                <span v-if="i.zt==1">已开启</span>
            </div> -->
            <div class="peizi" @click="shengouclik(i)">
              申购
            </div>
          </div>
        </div>
      </div>
      <div class="funds-list-item" v-for="(item,index) in sgList" :key="index" v-if="aaa == 'bbb'">
        <div class="funds-list-item__account clearfix">
          <div class="col-xs-4 account">
            <!-- 配资资金：17.63 股票可用金额：17.63 配资管理费：已结束 -->
            <div class="order-title">新股名称</div>
            <div class="order-money">{{ item.xgname || 0 }}</div>
            <div class="order-title">保证金</div>
            <div class="order-money">{{ item.bzj || 0 }}</div>

          </div>
          <div class="col-xs-4 account">
            <!-- 保证金：100 股票市值：0 股票盈亏：0  -->
            <div class="order-title">申购代码</div>
            <div class="order-money">{{ item.codes || 0 }}</div>
            <div class="order-title">买入数量</div>
            <div class="order-money">{{ item.nums || 0 }}</div>
          </div>
          <!-- <div class="col-xs-4 account">
              <div class="order-title">状态</div>
              <div class="order-money">
                  <span v-if="item.zts==3">未审核</span>
                  <span v-if="item.zts==1">已中签</span>
                  <span v-if="item.zts==2">未中签</span>
              </div>
          </div> -->
        </div>
      </div>
      <!-- <div class="funds-list-loadmore">
          点击加载更多内容
      </div> -->
      <el-dialog show-close :visible.sync="dialogCommunity" width="80%">
        <div class="storeinformation_popup">
          <el-form :model="haoForm" ref="haoForm" class="demo-form">
            <div class="storeinformation_popup_top">
              <el-form-item>
                <el-input type="text" v-model="haoForm.shehao" placeholder="请填写申购数量"
                          show-word-limit oninput="value=value.replace(/[^\d]/g,'')">
                </el-input>
              </el-form-item>
            </div>
            <el-form-item style="text-align:center;">
              <el-button @click="dialogCommunity = false">取 消</el-button>
              <el-button type="primary" @click="shengData()"
                         style="background-color: #fff !important;color:#333 !important;border-color:#DCDFE6 !important;">
                确 定
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as api from '../../axios/api'

export default {
  data () {
    return {
      list: {
        list: []
      },
      aaa: 'aaa',
      shengou: '',
      dialogCommunity: false,
      haoForm: {
        shehao: ''
      },
      tijiao: '',
      sgList: ''
    }
  },
  computed: {
    // progress() {
    //     let per = this.$store.state.userInfo.userAmt/(this.$store.state.userInfo.userAmt+this.$store.state.userInfo.userIndexAmt) * 100 > 100?100:this.$store.state.userInfo.userAmt/(this.$store.state.userInfo.userAmt+this.$store.state.userInfo.userIndexAmt) * 100 > 100?this.$store.state.userInfo.userAmt/(this.$store.state.userInfo.userAmt+this.$store.state.userInfo.userIndexAmt) * 100 > 100?100:this.$store.state.userInfo.userAmt/(this.$store.state.userInfo.userAmt+this.$store.state.userInfo.userIndexAmt) * 100:100
    //     return per
    // }
  },
  created () {
    this.getlist()
    this.xxxx()
  },
  methods: {
    async shengouclik (i) {
      this.dialogCommunity = true
      this.tijiao = i
    },
    async shengouuu () {
      this.aaa = 'aaa'
    },
    async shengoulist () {
      this.aaa = 'bbb'
      this.shengouList()
    },
    async getlist () {
      // 获取持仓列表
      let opt = {
        userId: 0,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await api.getUserApplyList(opt)
      if (data.status === 0) {
        this.list = data.data
      }
    },
    async xxxx () {
      // 获取持仓列表
      let opt = {}
      let data = await api.xingusg(opt)
      this.shengou = data.data.list
    },
    async shengData () {
      // 获取持仓列表
      var timestamps = (new Date()).getTime()
      let opt = {
        sgname: this.tijiao.names,
        sgdaima: this.tijiao.code,
        sgprice: this.tijiao.price,
        sgsumber: this.haoForm.shehao,
        tmes: timestamps
      }
      let data = await api.xingusgs(opt)
      this.shengoutijiao = data.data.list
      this.dialogCommunity = false
      if (data.status == 200) {
        this.$message({
          message: data.msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: data.msg,
          type: 'warning'
        })
      }
    },
    async shengouList () {
      let opt = {}
      let data = await api.xingusgsList(opt)
      this.sgList = data.data.list
      // this.timestampToTime()
    }
  }
}
</script>

<style lang="less" scoped>
.funds-list-item {
  padding: 0.2rem 0.16rem 0.45rem !important;
}

body {
  background-color: #16171d;
}

.wrapper {
  padding-bottom: 0;
}

.funds-info {
  display: block;
  width: 6.9rem;
  margin: .3rem;
  padding: .6rem .2rem .12rem .2rem;
  background-color: #1F2636;
  border-radius: .1rem;

  .money-info {
    padding-bottom: .42rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #fff2;

    &_left {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .money-info_total {
        height: .4rem;
        display: flex;
        align-items: center;

        .ino-ico {
          width: .38rem;
          height: .38rem;
          margin-right: .15rem;
        }

        .ino-title {
          font-size: .24rem;
          margin-right: .15rem;
        }

        .ino-money {
          font-size: .4rem;
          color: #009C46;
          letter-spacing: 0;
          font-family: lightnumber;
        }
      }

      .money-info_progress {
        width: 100%;
        height: .1rem;
        border-radius: .05rem;
        background-color: #4E5A73;

        &__inner {
          background-color: #E6003E;
          height: .1rem;
          border-radius: .05rem;
        }
      }
    }

    &_right {
      margin-left: .3rem;
      width: 1.4rem;
      height: 1.14rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .money-info_botton {
        width: 1.4rem;
        height: .42rem;
        line-height: .42rem;
        font-size: .24rem;
        color: #fff;
        text-align: center;

        &.redBtn {
          background-color: #E6003E;
          border-radius: .21rem;
        }

        &.blueBtn {
          background-color: #024DA1;
          border-radius: .21rem;
        }
      }
    }
  }

  .money-detail {
    position: relative;

    &_title {
      padding: .3rem 0;
      display: flex;
      justify-content: space-between;
    }

    &_acc {
      display: flex;
      flex-wrap: wrap;

      .acc {
        padding: 0;
        display: flex;
        width: 50%;

        .acc-item {
          margin-left: .2rem;
          margin-bottom: .3rem;
        }

        .acc-item_title {
          font-size: .24rem;
          color: #fff;
          line-height: .3rem;
          margin-bottom: .2rem;
        }

        .acc-item_num {
          font-size: .3rem;
          color: #E6003E;
          font-family: lightnumber;
        }
      }
    }
  }

}

.funds-list {
  display: block;
  width: 6.9rem;
  margin: .3rem;
  padding: .12rem .2rem .12rem .2rem;
  background-color: #1F2636;
  border-radius: .1rem;

  &-title {
    text-align: center;
    padding: .26rem 0;
    color: #fff;
    font-size: .25rem;
    font-weight: bold;
  }

  &-item {
    padding: .45rem .16rem;
    border-top: 1px solid #fff2;

    &__title {
      display: flex;
      justify-content: space-between;
      margin-bottom: .35rem;

      &-left {
        font-size: .3rem;

        .zhishu {
          font-size: .2rem;
          color: #fff;
          padding: .05rem .15rem;
          background-image: url(../../assets/ico/zhishu.png);
          background-size: 100% 100%;
        }
      }

      &-right {
        font-size: .24rem;
      }
    }

    .account {
      padding: 0;

      .order-title {
        color: #AAAAAA;
        font-size: .24rem;
        margin-bottom: .1rem;
        margin-top: .4rem;
        text-align: center;
      }

      .order-money {
        color: #fff;
        font-size: .24rem;
        margin-bottom: .13rem;
        text-align: center;
      }

      .peizi {
        height: .34rem;
        background-color: #138EB4;
        border-radius: .17rem;
        text-align: center;
        width: 1.26rem;
        line-height: .35rem;
      }
    }
  }

  &-loadmore {
    height: .67rem;
    line-height: .67rem;
    text-align: center;
    font-size: .27rem;
    color: #fff;
    background-color: #494951;
    border-radius: 3px;
    margin-bottom: .4rem;
  }
}

.red-theme {
  .funds-info {
    background-color: #fff;

    .ino-title {
      color: #000;
    }

    .acc-item_title {
      color: #000 !important;
    }
  }

  .funds-list {
    background-color: #fff;

    &-title {
      color: #000;
    }

    &-item {
      border-top-color: #2222;

      &__title-left {
        color: #222;
      }

      .account .order-title {
        color: #666666;
      }

      .account .order-money {
        color: #000;
      }

      .account .peizi {
        background-color: #BC1816;
        color: #fff;
      }
    }
  }

  .funds-list-loadmore {
    background-color: #BC1816;
  }
}
</style>
