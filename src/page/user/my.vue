<template>
  <div class="wrapper">
    <div class="form-block">
      <mt-field :label="$t('change.phone')" type="text" disabled v-model="phone"></mt-field>
    </div>
    <div class="form-block">
      <!--      :placeholder="$t('change.modify')"-->
      <mt-field :label="$t('change.pwd')" @click.native="changeLogin" autocomplete="new-password"
                type="password" disabled>
        <span @click="changeLogin"><i class="iconfont icon-xiugai"></i>{{ $t('change.update') }}</span>
      </mt-field>
    </div>
    <!-- 修改密码 -->
    <mt-popup v-model="changeLoginPsdBox" position="bottom" class="mint-popup-wrap">
      <div class="clearfix">
        <a @click="changeLoginPsdBox = false" class="pull-right"><i class="iconfont icon-weitongguo"></i></a>
      </div>
      <div class="form-block">
        <mt-field :label="$t('change.old')" type="password" :placeholder="$t('change.input')"
                  v-model="nextPsd"></mt-field>
        <mt-field :label="$t('change.new')" :placeholder="$t('change.limit')" type="password"
                  v-model="newPsd"></mt-field>
      </div>
      <div class="text-center">
        <mt-button class="btn-sure" type="default" @click="changeLoginPsd">{{ $t('change.confirm') }}</mt-button>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import * as api from '@/axios/api'
import {Toast} from 'mint-ui'
import {isNull, pwdReg2} from '@/utils/utils'

export default {
  components: {},
  props: {},
  data () {
    return {
      username: '',
      changeLoginPsdBox: false,
      nextPsd: '',
      newPsd: '',
      phone: this.$store.state.userInfo.phone
    }
  },
  mounted () {
    if (this.phone === undefined || this.phone == null || this.phone.length === 0) {
      this.phone = localStorage.getItem('wap-phone')
    }
  },
  methods: {
    changeLogin () {
      this.changeLoginPsdBox = true
    },
    async changeLoginPsd () {
      if (isNull(this.nextPsd)) {
        Toast(this.$t('change.input'))
        return
      }
      if (isNull(this.newPsd)) {
        Toast(this.$t('pwd.inputPwd'))
        return
      }
      if (!pwdReg2(this.newPsd)) {
        Toast(this.$t('register.limit'))
        return
      }
      // 修改密码
      let opts = {
        oldPwd: this.nextPsd,
        newPwd: this.newPsd
      }
      let data = await api.changePassword(opts)
      if (data.status === 0) {
        Toast(this.$t('change.success'))
        localStorage.clear()
        await api.logout()
        await this.$router.push('/login')
      } else {
        Toast(data.msg)
      }
      this.changeLoginPsdBox = false
    }
  }
}
</script>
<style lang="less" scoped>
.loginout {
  color: #999;
  border: 0.015rem solid #606060;
  font-size: 0.3rem;
  background: none;
}

.login {
  border: 0.015rem solid #f8b936;
  font-size: 0.3rem;
  background: #f8b936;
}

.mint-popup-wrap {
  width: 100%;
  padding: 0.3rem 0.3rem 0.6rem;

  .btn-sure {
    margin-top: 0.5rem;
    width: 80%;
    color: #fff;
    border: none;
  }
}

.btnbox .btnok {
  background: none;
}
</style>
