<template>
  <div class="wrapper">
    <div class="login-form">
      <div class="login-avatar">
        <img class="login-ico" src="../assets/ico/wogerenziliao.png" alt=""/>
      </div>
      <div class="login-form-item input-model" style="margin-top: 1.32rem">
        <img v-show="$state.theme != 'red'" class="login-ico" src="../assets/ico/loginuser.png" alt=""/>
        <img v-show="$state.theme == 'red'" class="login-ico" src="../assets/ico/loginuser-red.png" alt=""/>
        <el-select v-model="select" slot="prepend" placeholder="请选择" class="select" size="mini">
          <el-option label="+1" class="option" value="+1"></el-option>
          <el-option label="+852" class="option" value="+852"></el-option>
          <el-option label="+91" class="option" value="+91"></el-option>
          <el-option label="+81" class="option" value="+81"></el-option>
        </el-select>
        <input class="login-input" placeholder="用户名" type="tel" pattern="[0-9]*" v-model="phone"/>
      </div>
      <div class="login-form-item input-model">
        <img v-show="$state.theme != 'red'" class="login-ico" src="../assets/ico/loginpwd.png" alt=""/>
        <img v-show="$state.theme == 'red'" class="login-ico" src="../assets/ico/loginpwd-pwd.png" alt=""/>
        <input class="login-input" type="password" placeholder="密码" v-model="psd"/>
      </div>
      <div class="login-form-item submit-model" @click="gook">
        立即登录 <i v-show="isloading" style="color: #fff" class="iconfont icon-jiazaizhong"></i>
      </div>
      <div class="login-form-item extra-model">
        <div style="color: #0e6580">
          <span @click="toForget">忘记密码？</span>
        </div>
        <div :style="{ color: $state.theme == 'red' ? '#BB1815' : '#86CBD1' }">
          <span style="color: #0e6580">还没有账号？</span>
          <span @click="toRegister">立即注册</span>
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
      isloading: false,
      phone: '',
      code: '',
      psd: '',
      isChecked: true, // 自动登录
      isDisabled: false,
      codeshow: true,
      count: '', // 倒计时
      clickFalg: 0, //  点击次数
      logo: '', // 设置信息
      options: [
        {
          value: '+1',
          label: '+1'
        },
        {
          value: '+852',
          label: '+852'
        },
        {
          value: '+91',
          label: '+91'
        },
        {
          value: '+81',
          label: '+81'
        }
      ],
      select: '+1'
    }
  },
  created: function () {
    this.$setgoindex()
  },
  mounted: function () {
    this.getInfoSite()
    let tmpPhone = this.$store.state.userInfo.phone
    let len = tmpPhone.length
    if (len === 11) {
      this.phone = tmpPhone
    } else if (len === 13) {
      this.phone = tmpPhone.substring(2, 13)
    } else if (len === 14) {
      this.phone = tmpPhone.substring(3, 14)
    } else if (len === 15) {
      this.phone = tmpPhone.substring(4, 15)
    } else {
      this.phone = this.$store.state.userInfo.phone
    }
  },
  methods: {
    async getInfoSite () {
      // 获取 logo
      let data = await api.getInfoSite()
      if (data.status === 0) {
        this.logo = data.data.siteLogoSm
      } else {
        Toast(data.msg)
      }
    },
    async checkPhone () {
      // 先验证是否已经注册
      let data = await api.checkPhone({phoneNum: this.select + this.phone})
      if (data.status === 0) {
        // 如果用户已存在返回 0
        await this.loginIN()
      } else {
        Toast('用户还未注册,请先注册')
        // this.$router.push('/register')
      }
    },
    gook () {
      // 登录
      if (this.clickFalg !== 0) {
        this.clickFalg = 0
        return
      }
      this.clickFalg++
      if (isNull(this.phone) || this.phone.length < 7) {
        Toast('请输入正确的手机号码')
      } else if (isNull(this.psd) || !pwdReg2(this.psd)) {
        Toast('密码为6~12位，数字、字母或符号')
      } else {
        this.checkPhone()
      }
    },
    async loginIN () {
      let opts = {
        phone: this.select + this.phone,
        userPwd: this.psd
      }
      this.isloading = true
      let data = await api.login(opts)
      this.clickFalg = 0
      if (data.status === 0) {
        this.$store.state.userInfo.phone = this.phone
        this.$store.state.userInfo.id = data.data.id
        this.clickFalg = 0
        localStorage.setItem('wap-token', data.data.token)
        localStorage.setItem('wap-id', data.data.id)
        // this.clearCookie()
        // this.setCookie(data.data.key,data.data.token,0)
        // this.$router.push('/home')
        await this.$router.push('/list')
      } else {
        Toast(data.msg)
      }
      this.isloading = false
    },
    toForget () {
      // 忘记密码
      this.$router.push('/forget')
    },
    toRegister () {
      // 注册
      this.$router.push('/register')
    },
    goBack () {
      if (this.$route.query.goindex === 'true') {
        this.$router.push('/')
      } else {
        this.$router.back()
      }
    }
  }
}
</script>
<style lang="less" scoped>
body {
  background-color: #16171d;
}

.wrapper {
  color: #888;
  height: 100%;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.1rem;
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
      padding: 0 0.33rem;
      display: flex;
      align-items: center;

      img.login-ico {
        width: 0.2rem;
        height: 0.23rem;
      }

      .login-input {
        flex: 1;
        padding: 0 0.2rem;

        &::-webkit-input-placeholder {
          color: #363636;
        }

        -webkit-text-fill-color: #fff !important;
        transition: background-color 5000s ease-in-out 0s !important;
        // &:-webkit-autofill {
        //   box-shadow: 0 0 0px 1000px #121319 inset !important;
        // }
        // &:-webkit-autofill:focus {
        //   box-shadow: 0 0 0px 1000px #121319 inset !important;
        // }
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
    }
  }

  /deep/ .select {
    input {
      width: 1.3rem;
      background: #121319;
      border: 1px solid #121319;
    }
  }

  //
  ///deep/ .option {
  //  li {
  //    width: 1.3rem;
  //    font-size: 13px;
  //  }
  //}
}

//
//.selected {
//  height: 38px;
//  overflow: hidden;
//  //text-align: center;
//  //float:left;
//}

.red-theme {
  .login-avatar {
    background-color: #222222;
  }

  .login-form {
    background-color: #fff;
  }

  .login-form-item.input-model {
    background-color: #fff;
    border: 1px solid #c9c9c9;
  }

  .login-form-item.submit-model {
    background-color: #bb1815;
  }
}
</style>
