<template>
  <div class="listContainer">
    <div class="topBtn" @click="searchOpen">筛选</div>
    <div v-for="item in list" :key="item.id" class="item">
      <div class="title">
        <div class="left">{{ item.orderSn }}</div>
        <div class="right">
          <el-tag :type="tagTypeArr[item.orderStatus]">{{ tagTextArr[item.orderStatus] }}</el-tag>
        </div>
      </div>
      <div class="content">
        <div class="left">入金金额</div>
        <div class="right">{{ item.realAmt }}$</div>
      </div>
      <div class="content">
        <div class="left">入金金方式</div>
        <div class="right">{{ payTypeArr[item.payChannel] }}</div>
      </div>
      <div  class="content">
        <div class="left">汇率</div>
        <div class="right">1:
          {{ item.rate }}</div>
      </div>
      <div class="content">
        <div class="left">入金金额</div>
        <div class="right">{{ item.payAmt }}{{item.symbol}}</div>
      </div>
      <div class="content">
        <div class="left">现金账户余额</div>
        <div class="right">{{ item.nowEnableAmt }}$</div>
      </div>
      <div class="footer">
        {{new Date(item.addTime) | timeFormat}}
      </div>
    </div>

    <el-drawer
      size="46%"
      title="筛选"
      direction="btt"
      :visible.sync="drawerShow"
    >
      <el-form
        :model="searchForm"
        size="small"
        label-width="80px"
        label-position="top"
      >
        <el-form-item label="状态">
          <el-radio-group v-model="searchForm.orderStatus">
            <el-radio label="" border>全部</el-radio>
            <el-radio label="1" border>审核成功</el-radio>
            <el-radio label="2" border>审核失败</el-radio>
            <el-radio label="3" border>待审核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间"
          ><el-date-picker
            v-model="searchForm.bbb"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="searchForm.orderSn" placeholder="请输入" />
        </el-form-item>
        <el-form-item class="footer">
          <el-button @click="() => this.drawerShow = false">取消</el-button>
          <el-button type="primary" @click="searchSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import * as api from "@/axios/api";
export default {
  props: {
    selectedNumber: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      list: [],
      tagTypeArr: ["primary", "success", "danger"],
      tagTextArr: ["审核中", "审核通过", "审核失败"],
      payTypeArr: ["支付宝","银行卡", "泰达币"],
      drawerShow: false,
      searchForm: {
        aaa: "0",
        bbb: "",
        ccc: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.getListDetail();
  },
  methods: {
    async getListDetail () {
      console.log('time:',this.searchForm.bbb)
      let opt = {
        payChannel: '', // 支付方式
        orderStatus: this.searchForm.orderStatus, // 订单状态
        orderSn: this.searchForm.orderSn
      }
      if(this.searchForm.bbb){
        opt.beginTime = new Date(this.searchForm.bbb[0]);
        opt.endTime = new Date(this.searchForm.bbb[1]);
      }
      let data = await api.rechargeList(opt)
      if (data.status === 0) {
        data.data.list.forEach(element => {
          this.list.push(element)
        })
        this.total = data.data.total
      } else {
        Toast(data.msg)
      }
    },
    searchOpen() {
      this.drawerShow = true;
    },
    searchSubmit() {
      this.list = [];
      this.drawerShow = false;
      this.getListDetail();
    },
  },
};
</script>

<style lang="less" scoped>
.listContainer {
  font-size: 0.28rem;
  margin: 0 0.2rem;
  .topBtn {
    text-align: right;
    margin-bottom: 0.3rem;
  }
  .item {
    padding: 0.2rem;
    border: 1px solid #eee;
    border-radius: 0.1rem;
    margin-bottom: 0.2rem;
    background-color: #1f2636;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.1rem 0.2rem;
      color: rgba(255, 255, 255, 0.8);
      &.title {
        border-bottom: 1px solid #999;
        padding: 0.1rem 0;
        font-size: 0.35rem;
      }
      &.footer {
        border-top: 1px solid #999;
        font-size: 0.31rem;
        padding: 0.1rem 0;
      }
      &:first-of-type {
        margin-top: 0;
        padding-top: 0;
      }
      &:last-of-type {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      .left {
        width: 1.8rem;
      }
      .right {
        flex: 1;
        text-align: right;
      }
    }
  }
  /deep/ .el-drawer {
    background-color: #1f2636;
    .el-drawer__header {
      span {
        color: #fff;
      }
    }
    .el-drawer__body {
      margin: 0.2rem;
      .el-form {
        .el-form-item__label {
          color: #fff;
        }
        .el-date-editor {
          width: 100%;
          background: #21252a;
        }
        .el-radio-group {
          display: flex;
          justify-content: space-between;
          .el-radio {
            margin: 0;
            color: #fff;
          }
        }
        .el-input__inner {
          background: #21252a;
        }
        input {
          -webkit-text-fill-color: #fff;
        }
        .footer {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
