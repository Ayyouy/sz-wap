<template>
  <div class="wrapper">
    <mt-tab-container class="order-list" v-model="selected">
      <mt-tab-container-item id="3">
        <div class="header-bg">
          <span class="header-title">{{ $t('fundList.report') }}</span>
          <div class="header-btn-bg" @click="showDialog">
            <el-image class="header-btn" src="../../static/img/search.png"></el-image>
          </div>
        </div>
        <div v-if="list.length<=0 && !getStatus" class="empty text-center">
          {{ $t('msg2') }}
        </div>
        <div v-if="list.length<=0 && getStatus" class="empty text-center">
          <mt-spinner type="fading-circle"></mt-spinner>
          {{ $t('market.loading') }}
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
                    <span>{{ $t('capital.amount') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span :style="item.amount>=0?'color:green':'color:red'"> ${{
                        Number(item.amount).toFixed(2)
                      }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.item') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.type }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===5">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('msg3') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.buyUserName }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===5">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('msg4') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.buyUserPhone }}</span>
                  </el-col>
                </el-row>
                <!-- 备注：时间又改为全部显示 v-show="item.typeFlagValue===1||item.typeFlagValue===6" -->
                <el-row class="self-el-row">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.time') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ new Date(item.addTime)|timeFormat }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue>1&&item.typeFlagValue<7">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.name') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.fundName }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===4">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.period') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.day }}{{ $t('capital.day') }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===2||item.typeFlagValue===4">
                  <el-col :span="8" class="text-left">
                    <span v-show="item.typeId==='bug_fund'">{{ $t('capital.number') }}</span>
                    <span
                      v-show="item.typeId==='back_fund'||item.typeId==='shuhui_income'">{{
                        $t('capital.amount1')
                      }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.portion }}{{ $t('capital.units') }}<span
                      v-show="item.typeId==='shuhui_income'">（{{ item.period }}{{ $t('capital.periods') }}）</span>
                    </span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeId==='shuhui_income'">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.rate') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.rates }}%</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===6">
                  <el-col :span="8" class="text-left">
                    <span v-show="item.typeId==='shengou'">{{ $t('capital.rate1') }}</span>
                    <span v-show="item.typeId==='shuhui'">{{ $t('capital.rate2') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.rates }}%</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===6">
                  <el-col :span="8" class="text-left">
                    <span v-show="item.typeId==='shengou'">{{ $t('capital.amount2') }}</span>
                    <span v-show="item.typeId==='shuhui'">{{ $t('capital.amount1') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.money }}（{{ item.portion }}{{ $t('capital.units') }}）</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===3">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.used') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.money }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===5">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('msg5') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.money }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===5">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('msg6') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.rates }}%</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===5">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('msg7') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ item.money }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===3">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.posNum') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.period }}{{ $t('capital.units') }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue===3">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.rate') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.rates }}%</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue!=5">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.balance') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> ${{ Number(item.balance).toFixed(2) }}</span>
                  </el-col>
                </el-row>
                <el-row class="self-el-row" v-show="item.typeFlagValue!=5">
                  <el-col :span="8" class="text-left">
                    <span>{{ $t('capital.order') }}</span>
                  </el-col>
                  <el-col :span="16" class="text-right">
                    <span> {{ item.orderNum }}</span>
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
    <el-dialog center top="25vh" :title="$t('capital.screen')" width="80%" :visible.sync="dialogVisible"
               :show-close="false">
      <div>
        <el-form :inline="false" :model="form" size="mini">
          <el-form-item :label="$t('capital.item')" prop="type">
            <el-select clearable filterable :placeholder="$t('capital.all')" value-key="type"
                       v-model="form.type" style="width: 100%;">
              <el-option v-for="item in types" style="width: 100%;" :label="item.value" :value="item.type"
                         :key="item.type">{{ item.value }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('msg8')" prop="buyTimeStart">
            <el-input v-model="form.buyTimeStart" :placeholder="$t('capital.input')" type="date"
                      :max="form.buyTimeEnd"></el-input>
          </el-form-item>
          <el-form-item :label="$t('msg9')" prop="buyTimeEnd">
            <el-input v-model="form.buyTimeEnd" :placeholder="$t('capital.input')" type="date"
                      :min="form.buyTimeStart"></el-input>
          </el-form-item>
          <el-form-item :label="$t('capital.order')" prop="orderNum">
            <el-input v-model="form.orderNum" :placeholder="$t('capital.input')"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="cancelAndClearForm">{{ $t('capital.cancel') }}</el-button>
         <el-button type="primary" @click="submit()">{{ $t('capital.confirm') }}</el-button>
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
      pageSize: 100,
      currentNum: 10,
      dialogVisible: false,
      types: [],
      form: {
        orderNum: '',
        buyTimeStart: '',
        buyTimeEnd: '',
        type: ''
      },
      list: [],
      total: 0, // 记录总值,
      selected: '3' // 选中
    }
  },
  mounted () {
    this.getTypes()
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
    cancelAndClearForm () {
      this.dialogVisible = false
      this.form.orderNum = ''
      this.form.buyTimeStart = ''
      this.form.buyTimeEnd = ''
      this.form.type = ''
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
      let opts = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderNum: this.form.orderNum,
        buyTimeStart: this.form.buyTimeStart,
        buyTimeEnd: this.form.buyTimeEnd,
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
          switch (item.typeId) {
            case 'zhuan_ru_zijin':
            case 'zhuan_chu_jinyi':
              // "转入资金账户"
              // "转出至交易账户"
              item.typeFlagValue = 1
              break
            case 'bug_fund':
            case 'back_fund':
              // "购买基金"
              // "赎回基金"
              item.typeFlagValue = 2
              break
            case 'one_income':
            case 'two_income':
            case 'three_income':
            case 'four_income':
            case 'always_income':
              // "一期收益"
              // "二期收益"
              // "三期收益"
              // "四期收益"
              // "持续收益"
              item.typeFlagValue = 3
              break
            case 'shuhui_income':
              // "赎回收益"
              item.typeFlagValue = 4
              break
            case 'tuijian_jiang':
              // "推荐奖"
              item.typeFlagValue = 5
              break
            case 'shengou':
            case 'shuhui':
              // "申购手续费"
              // "赎回手续费"
              item.typeFlagValue = 6
              break
            case 'zhike_jiang':
            case 'daili_jiang':
              // 一般没有这两个
              // "直客奖"
              // "代理奖"
              item.typeFlagValue = 7
              break
            default:
              item.typeFlagValue = 8
          }
          this.list.push(item)
        })
      } else {
        Toast(data.msg)
      }
      this.cancelAndClearForm()
    },
    async loadMore () {
      if (this.list.length < this.pageSize || this.loading || this.total <= this.currentNum) {
        return
      }
      this.loading = true
      this.pageNum = this.pageNum + 1
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
  padding-top: 10px;
  padding-bottom: 10px;
}

.select-dropdown .el-scrollbar__view {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.select-dropdown .el-select-dropdown__item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.header-bg .header-btn-bg {
  position: absolute;
  right: 0.3rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-btn-bg .header-btn {
  width: 16px;
  height: 16px;
}
</style>
