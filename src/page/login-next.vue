<template>
  <div class="wrapper">
    <div class="login-form">
      <div class="login-avatar">
        <img src="../assets/ico/wogerenziliao.png">
      </div>
      <div class="login-form-item input-model" style="margin-top: 1.32rem;">
        <img v-if="theme" src="../assets/ico/loginuser-red.png"/>
        <img v-else src="../assets/ico/loginuser.png"/>
        <select v-model="form.select">
          <option v-for="item in options" :key="item" :label="item" :value="item">{{ item }}</option>
        </select>
        <input :placeholder="$t('register.inputAccount')" type="tel" pattern="[0-9]*" v-model="form.phone"/>
      </div>
      <div class="login-form-item input-model">
        <img v-if="theme" src="../assets/ico/loginpwd-pwd.png"/>
        <img v-else src="../assets/ico/loginpwd.png"/>
        <input type="password" pattern="[a-zA-Z0-9]+" :placeholder="$t('login.input')" v-model="form.psd"/>
      </div>
      <div class="login-form-item submit-model" @click="btnSubmit">
        {{ $t('login.now') }} <i v-show="logging" style="color: #fff" class="iconfont icon-jiazaizhong"></i>
      </div>
      <div class="login-form-item extra-model">
        <div>
          <span class="extra-span" @click="btnJump(1)"> {{ $t('login.forgot') }}</span>
        </div>
        <div>
          <span class="extra-span" :style="theme?'color:#BB1815':''"> {{ $t('login.not') }}</span>
          <span style="color:#86CBD1" @click="btnJump(2)"> {{ $t('login.not1') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {Toast} from 'mint-ui'
import {isNull, pwdReg2} from '@/utils/utils'
import * as api from '@/axios/api'

export default {
  data () {
    return {
      form: {
        phone: '',
        psd: '',
        select: '+1'
      },
      options: ['+1', '+852', '+91', '+81', '+86', '+88', '+00', '+99'],
      theme: this.$state.theme === 'red',
      logging: false
    }
  },
  created: function () {
    this.$setgoindex()
  },
  mounted: function () {
    this.getLocalPhone()
  },
  methods: {
    getLocalPhone () {
      let selectPhone = String(this.$store.state.userInfo.phone)
      this.form.select = this.options[0]
      this.form.phone = selectPhone
      this.options.forEach((item) => {
        if (selectPhone.includes(item)) {
          this.form.select = item
          this.form.phone = selectPhone.replace(item, '')
        }
      })
    },
    btnJump (val) {
      switch (val) {
        case 1:
          this.$router.push('/forget')
          break
        case 2:
          this.$router.push('/register')
          break
        default:
          break
      }
    },
    async btnSubmit () {
      if (this.logging) {
        return
      }
      this.logging = true
      if (isNull(this.form.phone) || this.form.phone.length < 7) {
        // Toast('请输入正确的手机号码')
        Toast(this.$t('login.account'))
        this.logging = false
        return
      }
      if (isNull(this.form.psd) || !pwdReg2(this.form.psd)) {
        // Toast('密码为6~12位，数字、字母或符号')
        Toast(this.$t('login.limit'))
        this.logging = false
        return
      }
      let opts = {
        phone: this.form.select + this.form.phone,
        userPwd: this.form.psd
      }
      let data = await api.login(opts)
      if (data.status === 0) {
        this.$store.state.userInfo.phone = this.form.select + this.form.phone
        this.$store.state.userInfo.id = data.data.id
        this.clickFalg = 0
        localStorage.setItem('wap-token', data.data.token)
        localStorage.setItem('wap-phone', (this.form.select + this.form.phone))
        localStorage.setItem('wap-id', data.data.id)
        await this.$router.push('/list')
      } else {
        Toast(data.msg)
      }
      this.logging = false
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-color: #16171d;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-form {
  display: block;
  width: 6.13rem;
  height: 5.58rem;
  background-color: #1b1c25;
  position: relative;
  box-shadow: 0 0 0.1rem 0.1rem #0002;

  .login-avatar {
    width: 1.2rem;
    height: 1.2rem;
    background-color: #444656;
    border-radius: 50%;
    position: absolute;
    top: -0.6rem;
    left: 2.46rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0.1rem 0.1rem #0002;

    img {
      width: 0.55rem;
      height: 0.58rem;
    }
  }

  .login-form-item {
    width: 4.95rem;
    height: 0.66rem;
    border-radius: 0.33rem;
    margin: 0.45rem auto 0;

    &.input-model {
      background-color: #121319;
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        margin-left: 0.3rem;
        width: 0.2rem;
        height: 0.23rem;
      }

      select {
        margin-left: 0.2rem;
        background-color: #121319;
        border: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        font-size: 13px;
        padding-top: 1px;
        flex: 1;
      }

      option {
        padding-left: 0.1rem;
        padding-right: 0.1rem;
        font-size: 13px;
      }

      input {
        flex: 1;
        margin: 0 0.2rem;
        font-size: 13px;

        &::-webkit-input-placeholder {
          color: #363636;
        }

        -webkit-text-fill-color: #fff !important;
        transition: background-color 5000s ease-in-out 0s !important;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px #121319 inset !important;
        }

        &:-webkit-autofill:focus {
          box-shadow: 0 0 0px 1000px #121319 inset !important;
        }
      }
    }

    &.submit-model {
      background-color: #024da1;
      line-height: 0.66rem;
      text-align: center;
      color: #ffffff;
    }

    &.extra-model {
      margin-top: 0.24rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.2rem;

      .extra-span {
        color: #0e6580
      }
    }
  }

}
</style>
