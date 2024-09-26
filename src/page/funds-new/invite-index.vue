<template>
  <div class="wrapper">
    <div class="mint-navbar top-navbar is-fixed" style="top: 1.84rem !important;background-color: #16171d">
      <div class="header-bg">
        <el-row class="self-el-row">
          <el-col :span="4" class="text-left">
            <span>邀请链接</span>
          </el-col>
          <el-col :span="20" class="text-right">
            <span>http://www.baidu.com</span>
          </el-col>
        </el-row>
        <el-row class="self-el-row">
          <el-col :span="4" class="text-left">
            <span>邀请码</span>
          </el-col>
          <el-col :span="20" class="text-right">
            <span style="color: #1b8e5d"> XDk869</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <mt-tab-container class="order-list" v-model="selected" style="margin-top: 1.9rem !important;">
      <mt-tab-container-item id="4">
        <div v-if="list.length<=0 && !getStatus" class="empty text-center">
          暂无邀请信息!
        </div>
        <div v-if="list.length<=0 && getStatus" class="empty text-center">
          <mt-spinner type="fading-circle"></mt-spinner>
          加载中...
        </div>
        <div v-if="list.length>0">
          <ul class="order-info-box-wrap"
              v-infinite-scroll="loadMore"
              :infinite-scroll-disabled="loading"
              infinite-scroll-distance="0">
            <li v-for="(item) in list" :key="item.id">
              <div class="order-info-box">
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>被邀请人姓名</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> 张三</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>邀请人账号</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span>+86 130000000000</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>直推奖</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> $1000</span>
                  </el-col>
                </el-row>
              </div>
            </li>
          </ul>
          <div v-show="loading" class="load-all text-center">
            <mt-spinner type="fading-circle"></mt-spinner>
            加载中...
          </div>
          <div v-show="!loading" class="load-all text-center">
            已全部加载
          </div>
          <el-dialog center top="25vh" title="筛选" width="80%" :visible.sync="dialogVisible" :show-close="false">
            <div>
              <el-form :inline="false" :model="form" size="mini">
                <el-form-item label="来源" prop="xxx">
                  <el-select v-model="form.xxx" placeholder="所有" style="width: 100%">
                    <el-option label="xxx" value="xxx"></el-option>
                    <el-option label="xxx" value="xxx"></el-option>
                    <el-option label="xxx" value="xxx"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="buyTime">
                  <el-input v-model="form.buyTime" placeholder="请输入" type="date"></el-input>
                </el-form-item>
                <el-form-item label="订单编号" prop="orderNum">
                  <el-input v-model="form.orderNum" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
          </el-dialog>
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

export default {
  components: {
    Foot
  },
  data() {
    return {
      loading: false, // 是否正在加载更多
      isRefresh: false, // 是否正在刷新
      getStatus: false, // 是否正在数据
      pageNum: 1,
      pageSize: 10,
      currentNum: 10,
      dialogVisible: false,
      form: {
        orderNum: '',
        buyTime: '',
        xxx: ''// todo 来源
      },
      list: [],
      total: 0, // 记录总值,
      selected: '4' // 选中
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submit() {
      this.pageNum = 1
      this.getList()
      this.dialogVisible = false
    },
    async getList() {
      let opts = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      this.getStatus = true
      if (this.pageNum === 1) {
        this.list = []
      }
      let data = await api.getFundsNewList(opts)
      if (data.status === 0) {
        this.getStatus = false
        this.total = data.data.total
        data.data.list.forEach(item => {
          this.list.push(item)
        })
      } else {
        Toast(data.msg)
      }
    },
    async loadMore() {
      if (this.list.length < this.pageSize || this.loading || this.total <= this.currentNum) {
        return
      }
      this.loading = true
      this.pageNum++
      await this.getList()
      this.currentNum = this.pageNum * this.pageSize
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
