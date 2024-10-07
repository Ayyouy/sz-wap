<template>
  <div class="wrapper">
    <div class="mint-navbar top-navbar is-fixed" style="top: 1.84rem !important;background-color: #16171d">
      <div class="header-bg">
        <span class="header-title">资金明细</span>
        <el-image class="header-btn" src="../../static/img/search.png" @click="showDialog"></el-image>
      </div>
    </div>
    <mt-tab-container class="order-list" v-model="selected" style="margin-top: 1rem !important;">
      <mt-tab-container-item id="3">
        <div v-if="list.length<=0 && !getStatus" class="empty text-center">
          暂无资金信息!
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
                    <span>订单编号</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span style="color: #1b8e5d"> {{ item.orderNum }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>姓名/ID</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.realName }}/{{ item.userId }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>归属代理/ID</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.agentRealName }}/{{ item.agentId }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>代理等级</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.agentLevel + 1 }}级</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>变动金额</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span>  {{ item.amount }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>基金账户余额</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.balance }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>时间</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ new Date(item.addTime) | timeFormat }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>类型</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.type }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>说明</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.remark }}</span>
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

        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <el-dialog center top="25vh" title="筛选" width="80%" :visible.sync="dialogVisible" :show-close="false">
      <div>
        <el-form :inline="false" :model="form" size="mini">
          <el-form-item label="来源" prop="type">
            <el-select clearable filterable placeholder="所有" value-key="type"
                       style="width: 100%" v-model="form.type">
              <el-option v-for="item in types" :key="item.type" :label="item.value"
                         :value="item.type"></el-option>
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
  data () {
    return {
      loading: false, // 是否正在加载更多
      isRefresh: false, // 是否正在刷新
      getStatus: false, // 是否正在数据
      pageNum: 1,
      pageSize: 10,
      currentNum: 10,
      dialogVisible: false,
      types: [],
      form: {
        orderNum: '',
        buyTime: '',
        type: ''
      },
      list: [],
      total: 0, // 记录总值,
      selected: '3' // 选中
    }
  },
  mounted () {
    this.getTypes()
    this.getList()
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    submit () {
      this.pageNum = 1
      this.dialogVisible = false
      this.getList()
    },
    async getTypes () {
      let data = await api.getFinancialTypes()
      if (data.status === 0) {
        this.types = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    async getList () {
      console.log('financial:', this.pageNum)
      let opts = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderNum: this.form.orderNum,
        buyTime: this.form.buyTime,
        type: this.form.type
      }
      this.getStatus = true
      if (this.pageNum === 1) {
        this.list = []
      }
      let data = await api.financial(opts)
      if (data.status === 0) {
        this.getStatus = false
        this.total = data.data.total
        data.data.records.forEach(item => {
          this.list.push(item)
        })
      } else {
        Toast(data.msg)
      }
    },
    async loadMore () {
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
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.header-bg .header-title {
  color: #fff2f4;
}

.header-bg .header-btn {
  position: absolute;
  right: 0.3rem;
  width: 16px;
  height: 16px;
}
</style>
