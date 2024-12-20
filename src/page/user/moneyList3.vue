<template>
  <div class="listContainer">
    <div class="topBtn">
      <span class="screen" @click="searchOpen">
        {{ $t('capital.screen') }}
      </span>
    </div>
    <div>
      <ul
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="loading"
        infinite-scroll-distance="200">
        <li class="item" v-for="item in list" :key="item.key">
<!--          <div class="title">-->
<!--            <div class="left">{{ item.orderSn }}</div>-->
<!--          </div>-->
<!--          <div class="content">-->
<!--            <div class="left">{{ $t('transfer.amount1') }}</div>-->
<!--            <div class="right">${{ Number(item.transferAmp).toFixed(2) }}</div>-->
<!--          </div>-->
<!--          <div class="content">-->
<!--            <div class="left">{{ $t('type6') }}</div>-->
<!--            <div class="right">{{ typeArr[item.transferType] }}</div>-->
<!--          </div>-->
<!--          <div class="content">-->
<!--            <div class="left">-->
<!--              {{ item.transferType === 0 ? $t('type3') : $t('type4') }}-->
<!--            </div>-->
<!--            <div class="right">-->
<!--              {{ item.transferType === 0 ? item.userNameZ : item.userNameA }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="content">-->
<!--            <div class="left">{{ item.transferType === 0 ? $t('type3') : $t('type4') }}{{ $t('type5') }}</div>-->
<!--            <div class="right">{{ item.transferType === 0 ? item.phoneZ : item.phoneA }}</div>-->
<!--          </div>-->
<!--          <div class="content">-->
<!--            <div class="left">{{ $t('to.balance') }}</div>-->
<!--            <div class="right">$-->
<!--              {{-->
<!--                item.transferType === 0 ?-->
<!--                  Number(item.userCurrEnableAmtA).toFixed(2) :-->
<!--                  Number(item.userCurrEnableAmtZ).toFixed(2)-->
<!--              }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="footer">-->
<!--            {{ new Date(item.transferTime) | timeFormat }}-->
<!--          </div>-->
        </li>
      </ul>
    </div>
    <el-drawer
      size="46%"
      :title="$t('capital.screen')"
      direction="btt"
      :visible.sync="drawerShow">
      <el-form
        :model="searchForm"
        size="small"
        label-width="80px"
        label-position="top">
        <el-form-item :label="$t('type')">
          <el-radio-group v-model="searchForm.transferType">
            <el-radio label="" style="border: none" border>{{ $t('capital.total') }}</el-radio>
            <el-radio label="1" style="border: none" border>{{ $t('type1') }}</el-radio>
            <el-radio label="0" style="border: none" border>{{ $t('type2') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('capital.time')">
          <el-date-picker
            v-model="searchForm.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            :start-placeholder="$t('msg8')"
            :end-placeholder="$t('msg9')"
            value-format="yyyy-MM-dd"
            style="border: none">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('capital.order')">
          <input v-model="searchForm.orderSn" class="el-input__inner" :placeholder="$t('capital.input')"/>
        </el-form-item>
        <el-form-item :label="$t('withdraw.name')">
          <input v-model="searchForm.name" class="el-input__inner" :placeholder="$t('capital.input')"/>
        </el-form-item>
        <el-form-item :label="$t('change.phone')">
          <input v-model="searchForm.phoneNum" class="el-input__inner" :placeholder="$t('capital.input')"/>
        </el-form-item>
        <el-form-item class="footer">
          <el-button @click="clearForm">{{ $t('capital.cancel') }}</el-button>
          <el-button type="primary" @click="searchSubmit">{{ $t('capital.confirm') }}</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  props: {
    selectedNumber: {
      type: String,
      default: '0'
    }
  },
  watch: {
    selectedNumber (val) {
      console.log('3selectedNumber', val)
      if (val === '3') {
        this.loaded = false
        this.list = []
        this.pageNum = 1
        this.total = 0
        this.clearForm()
        this.getList()
      }
    }
  },
  data () {
    return {
      loading: false,
      loaded: false,
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      typeArr: [this.$t('type2'), this.$t('type1')],
      drawerShow: false,
      searchForm: {
        transferType: '',
        phoneNum: '',
        name: '',
        orderSn: '',
        date: ''
      }
    }
  },
  mounted () {
    console.log('List3：什么时候执行呢？', this.selectedNumber, this.selectedNumber === '3', this.selectedNumber === 3)
    if (this.selectedNumber === '3') {
      console.log('List3-3：什么时候执行呢？', this.selectedNumber)
      this.loaded = false
      this.list = []
      this.pageNum = 1
      this.total = 0
      this.clearForm()
      this.getList()
    }
  },
  methods: {
    async loadMore () {
      console.log('3:',this.loaded)
      if (this.loaded) {
        return
      }
      this.pageNum++
      await this.getList()
    },
    async getList () {
      let opt = {
        phoneNum: this.searchForm.phoneNum,
        name: this.searchForm.name,
        orderSn: this.searchForm.orderSn,
        transferType: this.searchForm.transferType,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.searchForm.date) {
        opt.beginTime = new Date(this.searchForm.date[0])
        opt.endTime = new Date(this.searchForm.date[1])
      }
      this.loading = true
      let data = await api.transferMoneyList(opt)
      if (data.status === 0) {
        if (data.data.list.length > 0) {
          data.data.list.forEach(item => {
            this.list.push(item)
          })
        }
        this.total = data.data.total
        this.loaded = this.pageNum * this.pageSize >= this.total
      } else {
        Toast(data.msg)
      }
      this.loading = false
      this.clearForm()
    },
    clearForm () {
      this.drawerShow = false
      this.searchForm.transferType = ''
      this.searchForm.phoneNum = ''
      this.searchForm.name = ''
      this.searchForm.orderSn = ''
      this.searchForm.date = ''
    },
    searchOpen () {
      this.drawerShow = true
    },
    searchSubmit () {
      this.list = []
      this.total = 0
      this.pageNum = 1
      this.loaded = false
      this.loading = false
      this.drawerShow = false
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>

.el-input__inner {
  border: none !important;
  box-shadow: none !important;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  //border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  width: 100%
}


.listContainer {
  font-size: 0.28rem;
  margin: 0 0.2rem;

  .topBtn {
    line-height: 1rem;
    height: 1rem;
    text-align: right;
  }

  .screen {
    padding-left: 0.4rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }

  .item {
    padding: 0.2rem;
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
