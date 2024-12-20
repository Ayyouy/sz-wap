<template>
  <div class="wrapper">
    <mt-navbar class="top-navbar" v-model="selected">
      <mt-tab-item class="long" id="1">{{ $t('to.deposit') }}</mt-tab-item>
      <mt-tab-item class="long" id="2">{{ $t('to.report') }}</mt-tab-item>
      <mt-tab-item class="long" id="3">{{ $t('to.inter') }}</mt-tab-item>
      <mt-tab-item class="long" id="4">{{ $t('to.other') }}</mt-tab-item>
    </mt-navbar>
    <div class="listContainer">
      <div class="topBtn">
      <span class="screen" @click="open">
        {{ $t('capital.screen') }}
      </span>
      </div>
      <div>
        <ul
          v-infinite-scroll="loadMore"
          :infinite-scroll-disabled="loading"
          infinite-scroll-distance="20">
          <li class="item" v-for="item in list" :key="item.key">
            <div class="title">
              <div class="left">{{ item.orderSn }}</div>
              <div class="right" v-show="selected==='1'||selected==='2'">
                <el-tag :type="tagTypeArr[item.orderStatus]">{{ tagTextArr[item.orderStatus] }}</el-tag>
              </div>
              <div class="right" v-show="selected==='4'">
                <el-tag :type="tagTypeArr[item.withStatus]">{{ tagTextArr[item.withStatus] }}</el-tag>
              </div>
            </div>
            <div class="content" v-show="selected==='1'">
              <div class="left">{{ $t('to.in') }}</div>
              <div class="right">${{ Number(item.realAmt).toFixed(2) }}</div>
            </div>
            <div class="content" v-show="selected==='2'||selected==='4'">
              <div class="left">{{ $t('to.out') }}</div>
              <div class="right">${{ Number(item.realAmt).toFixed(2) }}</div>
            </div>
            <div class="content" v-show="selected==='3'">
              <div class="left">{{ $t('transfer.amount1') }}</div>
              <div class="right">${{ Number(item.transferAmp).toFixed(2) }}</div>
            </div>
            <div class="content" v-show="selected==='1'">
              <div class="left">{{ $t('to.inType') }}</div>
              <div class="right">{{ payTypeArr[item.payChannel] }}</div>
            </div>
            <div class="content" v-show="selected==='2'">
              <div class="left">{{ $t('to.outType') }}</div>
              <div class="right">{{ payTypeArr[item.payChannel] }}</div>
            </div>
            <div class="content" v-show="selected==='3'">
              <div class="left">{{ $t('type6') }}</div>
              <div class="right">{{ typeArr[item.transferType] }}</div>
            </div>
            <div class="content" v-show="selected==='4'">
              <div class="left">{{ $t('to.outType') }}</div>
              <div class="right" v-if="item.countryId == 5">{{ $t('withdraw.tether1') }}</div>
              <div class="right" v-else>{{ $t('withdraw.bank1') }}</div>
            </div>
            <div class="content" v-show="selected!=='3'">
              <div class="left">{{ $t('to.rate') }}</div>
              <div class="right">1:
                {{ Number(item.rate).toFixed(2) }}
              </div>
            </div>
            <div class="content" v-show="selected==='1'">
              <div class="left">{{ $t('to.in') }}</div>
              <div class="right">{{ item.symbol }}{{ Number(item.payAmt).toFixed(2) }}</div>
            </div>
            <div class="content" v-show="selected==='2'">
              <div class="left">{{ $t('to.out') }}</div>
              <div class="right">{{ item.symbol }}{{ Number(item.payAmt).toFixed(2) }}</div>
            </div>
            <div class="content" v-show="selected==='3'">
              <div class="left">
                {{ item.transferType === 0 ? $t('type3') : $t('type4') }}
              </div>
              <div class="right">
                {{ item.transferType === 0 ? item.userNameZ : item.userNameA }}
              </div>
            </div>
            <div class="content" v-show="selected==='4'">
              <div class="left">{{ $t('to.out') }}</div>
              <div class="right">{{ item.symbol }}{{ Number(item.withAmt).toFixed(2) }}</div>
            </div>
            <div class="content" v-show="selected!=='3'">
              <div class="left">{{ $t('to.balance') }}</div>
              <div class="right">${{ Number(item.nowEnableAmt).toFixed(2) }}</div>
            </div>
            <div class="content" v-show="selected==='3'">
              <div class="left">{{ item.transferType === 0 ? $t('type3') : $t('type4') }}{{ $t('type5') }}</div>
              <div class="right">{{ item.transferType === 0 ? item.phoneZ : item.phoneA }}</div>
            </div>
            <div class="content" v-show="selected==='3'">
              <div class="left">{{ $t('to.balance') }}</div>
              <div class="right">$
                {{
                  item.transferType === 0 ?
                    Number(item.userCurrEnableAmtA).toFixed(2) :
                    Number(item.userCurrEnableAmtZ).toFixed(2)
                }}
              </div>
            </div>
            <div class="content" v-show="selected!=='3'">
              <div class="left">{{ $t('to.explain') }}</div>
              <div class="right"></div>
            </div>
            <div class="footer">
              <span v-show="selected==='1'||selected==='2'">
                {{ new Date(item.addTime) | timeFormat }}
              </span>
              <span v-show="selected==='3'">
                {{ new Date(item.transferTime) | timeFormat }}
              </span>
              <span v-show="selected==='4'">
                {{ new Date(item.applyTime) | timeFormat }}
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div v-show="loading" class="load-all text-center">
        <mt-spinner type="fading-circle"></mt-spinner>
      </div>
      <div v-show="loaded && list.length>0" class="load-all text-center">
        {{ $t('market.loaded') }}
      </div>
      <div v-show="loaded && list.length==0" class="load-all text-center">
        {{ $t('market.empty') }}
      </div>
      <el-drawer
        :size="selected==='3'?'72%':'50%'"
        :title="$t('capital.screen')"
        direction="btt"
        :visible.sync="dialogVisible">
        <el-form
          :model="form"
          size="small"
          label-width="80px"
          label-position="top">
          <el-form-item v-show="selected!=='3'" :label="$t('capital.state')">
            <el-radio-group v-model="form.status">
              <el-radio label="" border style="border: none">{{ $t('capital.total') }}</el-radio>
              <el-radio label="1" border style="border: none">{{ $t('capital.success') }}</el-radio>
              <el-radio label="2" border style="border: none">{{ $t('capital.failed') }}</el-radio>
              <el-radio label="3" border style="border: none">{{ $t('capital.wait') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="selected==='3'" :label="$t('type')">
            <el-radio-group v-model="form.type">
              <el-radio label="" style="border: none" border>{{ $t('capital.total') }}</el-radio>
              <el-radio label="1" style="border: none" border>{{ $t('type1') }}</el-radio>
              <el-radio label="0" style="border: none" border>{{ $t('type2') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('capital.time')">
            <el-date-picker
              v-model="form.date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              :start-placeholder="$t('msg8')"
              :end-placeholder="$t('msg9')"
              value-format="yyyy-MM-dd"
              style="border:none">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('capital.order')">
            <input v-model="form.order" class="el-input__inner" :placeholder="$t('capital.input')"/>
          </el-form-item>
          <el-form-item v-show="selected==='3'" :label="$t('withdraw.name')">
            <input v-model="form.name" class="el-input__inner" :placeholder="$t('capital.input')"/>
          </el-form-item>
          <el-form-item v-show="selected==='3'" :label="$t('change.phone')">
            <input v-model="form.phone" class="el-input__inner" :placeholder="$t('capital.input')"/>
          </el-form-item>
          <el-form-item class="footer">
            <el-button @click="clear">{{ $t('capital.cancel') }}</el-button>
            <el-button type="primary" @click="initial">{{ $t('capital.confirm') }}</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'

export default {
  data () {
    return {
      selected: '1',
      loading: false,
      loaded: false,
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      typeArr: [this.$t('type2'), this.$t('type1')],
      tagTypeArr: ['primary', 'success', 'danger'],
      tagTextArr: [this.$t('to.wait'), this.$t('to.success'), this.$t('to.failed')],
      payTypeArr: [this.$t('to.ali'), this.$t('withdraw.bank1'), this.$t('withdraw.tether1')],
      dialogVisible: false,
      form: {
        status: '',
        date: '',
        order: '',
        type: '',
        phone: '',
        name: ''
      }
    }
  },
  watch: {
    selected (val) {
      this.clear()
      this.initial()
    }
  },
  mounted () {
    if (this.$route.query.index) {
      this.selected = this.$route.query.index
    }
    this.clear()
    this.initial()
  },
  methods: {
    async loadMore () {
      if (this.loaded) {
        return
      }
      this.pageNum++
      await this.getList()
    },
    async getList () {
      this.loading = true
      let opt = {
        orderSn: this.form.order,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.form.date) {
        opt.beginTime = new Date(this.form.date[0])
        opt.endTime = new Date(this.form.date[1])
      }
      let data = {}
      if (this.selected === '1' || this.selected === '2') {
        opt.orderStatus = this.form.status
        data = await api.rechargeList(opt)
      }
      if (this.selected === '3') {
        opt.phoneNum = this.form.phone
        opt.name = this.form.name
        opt.transferType = this.form.type
        data = await api.transferMoneyList(opt)
      }
      if (this.selected === '4') {
        opt.withStatus = this.form.status
        data = await api.withdrawList(opt)
      }
      if (data.status === 0) {
        if (data.data.list !== undefined && data.data.list.length > 0) {
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
      this.clear()
    },
    open () {
      this.clear()
      this.dialogVisible = true
    },
    clear () {
      this.dialogVisible = false
      this.form.status = ''
      this.form.order = ''
      this.form.date = ''
      this.form.type = ''
      this.form.phone = ''
      this.form.name = ''
    },
    initial () {
      this.loaded = false
      this.dialogVisible = false
      this.list = []
      this.pageNum = 1
      this.total = 0
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background-color: #16171d;

  .top-navbar {
    background: none;
    box-shadow: none;

    /deep/ .mint-tab-item {
      .mint-tab-item-label {
        font-size: 0.28rem;
        font-family: MicrosoftYaHeiLight;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }

      &.is-selected {
        position: relative;
        background: linear-gradient(0deg,
        rgba(27, 166, 208, 1),
        rgba(2, 116, 150, 1));

        &::after {
          position: absolute;
          content: "";
          display: block;
          width: 0.67rem;
          height: 0.06rem;
          background-color: #138eb4;
          bottom: 0;
          left: 50%;
          margin-left: -0.335rem;
          display: none;
        }
      }
    }
  }

  .order-list {
    width: 100%;
    height: 100%;

    /deep/ .mint-tab-container-wrap {
      width: 100%;
      height: 100%;
    }
  }
}

.is-selected .mint-tab-item-label:hover {
  text-decoration: none;
}

.wrapper /deep/ .mint-tab-item-label {
  font-size: 0.264rem;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 2px solid #d50000;
  text-decoration: none;
  box-shadow: none;
}

.mint-tab-container-item {
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
  .mint-tab-item {
    padding: 0.2rem 0;

    &.is-selected {
      border: none;
      margin-bottom: 0;
    }

    .mint-tab-item-label {
      font-size: 0.22rem;
    }

    .iconfont {
      display: block;
      font-size: 0.46rem;
      margin-bottom: 0.12rem;
    }
  }
}

.top-navbar {
  .mint-tab-item {
    padding: 0.2rem 0;
    margin: 0.3rem 0.1rem 0 0.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.01rem;

    &.long {
      flex: 2;
    }
  }
}

/deep/ .order-info-box {
  background-color: #08080d;

  .main {
    font-size: 0.3rem;
  }

  .order-title {
    border-bottom: none;
    height: 0.7rem;

    .space {
      font-size: 0.24rem;
    }

    .type-up {
      color: #fff;
      border: none;
      background-image: url(../../assets/ico/zhang.png);
      background-size: cover;
      padding-left: 0.2rem;
    }

    .type-down {
      color: #fff;
      border: none;
      background-image: url(../../assets/ico/die.png);
      background-size: cover;
      padding-left: 0.2rem;
    }
  }

  .code {
    margin-bottom: 0.3rem;
  }

  .table-title {
    font-size: 0.24rem;
  }

  .table-value {
    font-size: 0.24rem;
    color: #ccc;
  }

  .order-foot {
    padding: 0;

    .foot-btn {
      border-color: #b12525;
      background-color: #b12525;
      color: #fff;
      padding: 0 0.1rem;
      height: 0.34rem;
      line-height: 0.34rem;
      font-size: 0.2rem;
    }
  }
}

#app.red-theme {
  .top-navbar {
    background-color: #e9e9e9 !important;

    .mint-tab-item {
      background-color: #e9e9e9;
    }

    .top-nav-item.is-selected {
      color: #000;
    }

    .top-nav-item.is-selected :after {
      background-color: #bb1815;
    }
  }

  .sub-navbar {
    background-color: #e9e9e9;
  }

  .wrapper {
    background-color: #e9e9e9;
  }

  .load-all {
    background: #fff !important;
  }
}

/deep/ .red-theme .order-info-box {
  background-color: #fff;
}

.el-input__inner {
  border: none !important;
  box-shadow: none !important;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
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

.load-all {
  margin-top: .1rem;
}

.listContainer {
  font-size: 0.28rem;
  margin: 0 0.1rem;

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
    background-color: #1f2636;
    padding: 0.2rem;
    margin-bottom: 0.2rem;
    border-radius: 0.1rem;
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
        width: auto;
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

.el-radio__label {
  padding-left: 2px;
}
</style>
