<template>
  <div class="wrapper">
    <div class="register-form">
      <div class="register-avatar">
        <img src="../assets/ico/wogerenziliao.png"/>
      </div>
      <div class="register-form-item input-model" style="margin-top: 1.11rem">
        <img v-if="theme" src="../assets/ico/loginuser-red.png"/>
        <img v-else src="../assets/ico/loginuser.png"/>
        <select v-model="select">
          <option v-for="item in options" :key="item" :label="item" :value="item">{{ item }}</option>
        </select>
        <input class="login-input" :placeholder="$t('register.inputAccount')" type="tel" pattern="[0-9]*"
               v-model="phone"/>
      </div>
      <div class="register-form-item input-model">
        <img v-if="theme" src="../assets/ico/vertify-red.png"/>
        <img v-else src="../assets/ico/vertify.png"/>
        <input class="register-input" style="width: 1.4rem" :placeholder="$t('register.verCode')" pattern="[a-zA-Z0-9]+"
               type="text"
               v-model="code"/>
        <div v-if="codeshow" class="getcode" @click="checkCodeBox">
          {{ $t('register.getCode') }}
        </div>
        <div v-if="!codeshow" class="getcode">{{ count }}s</div>
      </div>
      <div class="register-form-item input-model">
        <img v-if="theme" src="../assets/ico/loginpwd-pwd.png"/>
        <img v-else src="../assets/ico/loginpwd.png"/>
        <input
          class="register-input"
          :placeholder="$t('change.limit')"
          type="password"
          pattern="[a-zA-Z0-9]+"
          v-model="psd"
        />
      </div>
      <div class="register-form-item input-model">
        <img v-if="theme" src="../assets/ico/loginpwd-pwd.png"/>
        <img v-else src="../assets/ico/loginpwd.png"/>
        <input
          class="register-input"
          :placeholder="$t('register.confirm')"
          type="password"
          pattern="[a-zA-Z0-9]+"
          v-model="psd2"
        />
      </div>
      <div class="register-form-item input-model">
        <img v-if="theme" src="../assets/ico/organization-red.png"/>
        <img v-else src="../assets/ico/organization.png"/>
        <input
          class="register-input"
          :placeholder="$t('register.invCode')"
          type="text"
          pattern="[a-zA-Z0-9]+"
          v-model="invitecode"
        />
      </div>
      <div class="register-form-item agree-model">
        <i
          @click="isAgree"
          :class="
            agree
              ? 'glyphicon glyphicon glyphicon-ok-sign red'
              : 'glyphicon glyphicon-ok-circle'
          "
        ></i>
        {{ $t('register.agree') }}
        <a @click="toAgree" style="color: #fff">{{ $t('register.agree2') }}</a>
      </div>
      <div class="register-form-item submit-model" @click="gook">{{ $t('register.now') }}</div>
      <div
        class="register-form-item"
        style="margin-top: 0.23rem; display: flex; justify-content: flex-end"
      >
        <div
          :style="{
            'font-size': '.2rem',
            color: $state.theme == 'red' ? '#000' : '#86CBD1'
          }"
        >
          {{ $t('register.already1') }}<span
          :style="{ color: $state.theme == 'red' ? '#BB1815' : '#fff' }"
          @click="goLogin"
        >{{ $t('register.already2') }}</span>
        </div>
      </div>
    </div>
    <mt-popup
      v-model="dialogShow"
      :closeOnClickModal="false"
      class="mint-popup-box mint-popup-white"
    >
      <div class="clearfix">
        <a @click="dialogShow = false" class="pull-right"
        ><i class="iconfont icon-weitongguo"></i
        ></a>
      </div>
      <div class="">
        <div class="row check-box">
          <div class="title">{{ $t('register.imgCode') }}</div>
          <mt-field :label="$t('register.verCode')" :placeholder="$t('register.inputCode')" v-model="code2">
            <img
              @click="refreshImg"
              :src="adminUrl + '/code/getCode.do?time=' + imgCodeTime"
              height="45px"
              width="100px"
            />
          </mt-field>
          <p class="red" v-if="!checkCodeState">
            {{ $t('register.msgCode') }}
          </p>
          <div class="text-center">
            <mt-button type="primary" @click="checkImg">{{ $t('register.confirm2') }}</mt-button>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import {Toast} from 'mint-ui'
import {isNull, pwdReg2} from '@/utils/utils'
import * as api from '@/axios/api'

export default {
  data () {
    return {
      phone: '',
      code: '',
      code2: '',
      psd: '',
      psd2: '',
      invitecode: '',
      codeshow: true,
      count: '', // 倒计时
      clickFalg: 0, //  点击次数
      imgCode: '',
      adminUrl: '',
      dialogShow: false, // 显示弹窗
      ischeckImg: false,
      checkCodeState: true,
      dialogImgShow: false, // 图片显示
      logo: '',
      agree: false,
      logindialogShow: false, // 注册协议
      agreeUrl: '', // 注册协议地址
      siteInfo: {},
      imgCodeTime: 0,
      countryId: 0,
      select: '+1',
      options: ['+1', '+852', '+91', '+81', '+86', '+88', '+00', '+99'],
      theme: this.$state.theme === 'red',
      flagNextRegister: false // 防止重复点击
    }
  },
  mounted: function () {
    if (this.$route.query.code) {
      this.invitecode = this.$route.query.code
    }
    this.getInfoSite()
  },
  methods: {
    async getInfoSite () {
      let data = await api.getInfoSite()
      if (data.status === 0) {
        this.logo = data.data.siteLogoSm
        this.agreeUrl = data.data.regAgree
        this.siteInfo = data.data
        if (this.siteInfo.smsDisplay === false) {
          this.code = ''
        }
        this.$store.state.siteInfo = this.siteInfo
      } else {
        Toast(data.msg)
      }
    },
    checkCodeBox () {
      if (isNull(this.phone) || this.phone.length < 7) {
        Toast(this.$t('register.msgAccount'))
      } else {
        this.checkPhone()
      }
    },
    async checkCode () {
      let data = await api.checkCode({code: this.code2})
      this.ischeckImg = data
    },
    async checkImg () {
      if (!this.code2) {
        // Toast('您输入的验证码有误,请重新输入')
        Toast(this.$t('register.msgCode'))
        this.checkCodeState = false
        return
      }
      let data = await api.checkCode({code: this.code2})
      if (data === 'true' || data === true) {
        await this.getcode()
        this.dialogShow = false
        this.checkCodeState = true
      } else {
        // Toast('您输入的验证码有误,请重新输入')
        Toast(this.$t('register.msgCode'))
        this.checkCodeState = false
        this.adminUrl = process.env.API_HOST + '1'
        this.adminUrl = process.env.API_HOST
        if (this.adminUrl === undefined) {
          this.adminUrl = ''
        }
      }
    },
    async getcode () {
      // 获取验证码
      if (this.clickFalg !== 0) {
        this.clickFalg = 0
        return
      }
      this.clickFalg++
      if (isNull(this.phone) || this.phone.length < 7) {
        // Toast('请输入正确的手机号码')
        Toast(this.$t('register.msgAccount'))
      } else {
        let result = await api.getCode({phoneNum: this.phone})
        if (result.status === 0) {
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.codeshow = false
            this.clickFalg = 0
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.codeshow = true
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          } else {
            Toast(result.msg)
          }
        } else {
          Toast(result.msg)
        }
      }
    },
    async checkPhone () {
      // 先验证是否已经注册
      let data = await api.checkPhone({phoneNum: this.select + this.phone})
      if (data.status === 0) {
        // 如果用户已存在返回 0
        // Toast('用户已注册,请登录')
        Toast(this.$t('register.msgHave'))
        await this.$router.push('/login')
      } else {
        this.dialogShow = false
        this.adminUrl = process.env.API_HOST
        if (this.adminUrl === undefined) {
          this.adminUrl = ''
        }
        await this.getcode()
      }
    },
    async gook () {
      if (this.flagNextRegister) {
        return
      }
      this.flagNextRegister = true
      // 注册
      if (!this.agree) {
        // Toast('需同意注册协议才能注册!')
        Toast(this.$t('register.registration'))
        this.flagNextRegister = false
        return
      }
      if (isNull(this.phone) || this.phone.length < 7) {
        // Toast('请输入正确的手机号码')
        Toast(this.$t('register.msgAccount'))
        this.flagNextRegister = false
        return
      }
      if (isNull(this.psd)) {
        // Toast('请输入密码')
        Toast(this.$t('register.limit'))
        this.flagNextRegister = false
        return
      }
      if (isNull(this.psd2)) {
        // Toast('请确认密码')
        Toast(this.$t('register.confirm'))
        this.flagNextRegister = false
        return
      }
      if (isNull(this.code)) {
        // Toast('请输入验证码')
        Toast(this.$t('register.inputCode'))
        this.flagNextRegister = false
        return
      }
      if (this.psd !== this.psd2) {
        // Toast('两次输入的密码不一致')
        Toast(this.$t('register.msgPwd'))
        this.password = 0
        this.password2 = 0
        this.flagNextRegister = false
        return
      }
      if (!pwdReg2(this.psd)) {
        // Toast('密码为6~12位，数字、字母或符号')
        Toast(this.$t('register.limit'))
        this.flagNextRegister = false
        return
      }
      // if (isNull(this.invitecode)) {
      //   Toast('请输入邀请码')
      //   Toast(this.$t('register.msgAccount'))
      //   this.flagNextRegister = false
      // } else {
      // }
      let opts = {
        phone: this.select + this.phone,
        yzmCode: this.code,
        userPwd: this.psd,
        agentCode: this.invitecode,
        countryId: this.countryId
      }
      let data = await api.register(opts)
      if (data.status === 0) {
        // Toast('注册成功，请登录')
        Toast(this.$t('register.msgSuccess'))
        await this.$router.push('/login')
      } else {
        Toast(data.msg)
      }
      this.flagNextRegister = false
    },
    goLogin: function () {
      this.$router.push('/login')
    },
    refreshImg () {
      this.adminUrl = ''
      this.imgCodeTime = Date.now()
      this.dialogImgShow = false
      let this_ = this
      setTimeout(function () {
        this_.adminUrl = process.env.API_HOST
        if (this_.adminUrl === undefined) {
          this_.adminUrl = ''
        }
        this_.dialogImgShow = true
      }, 500)
    },
    isAgree () {
      let i = false
      let j = true
      this.agree = this.agree ? i : j
    },
    toAgree () {
      this.$router.push('/agree')
    }
  }
}
</script>
<style lang="less" scoped>
body {
  background-color: #fff;
}

#app .body-box {
  height: 100%;
}

.form-select-option-style {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding-left: 5px;
  padding-top: 3px;
  background-color: transparent;
  font-size: 12px;

  option {
    padding-left: 5px;
    padding-right: 5px;
    font-size: 12px;
  }
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

.register-form {
  width: 6.14rem;
  height: 6.9rem;
  background-color: #1b1c25;
  position: relative;
  box-shadow: 0 0 0.1rem 0.1rem #0002;

  .register-avatar {
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

  .register-form-item {
    width: 4.95rem;
    height: 0.53rem;
    border-radius: 0.265rem;
    margin: 0.15rem auto 0;

    &.input-model {
      background-color: #121319;
      padding: 0 0.33rem;
      display: flex;
      align-items: center;

      img {
        width: 0.2rem;
        height: 0.23rem;
      }

      select {
        margin-left: 0.1rem;
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

      .register-input {
        flex: 1;
        padding: 0 0.2rem;
        height: 100%;
        font-size: 0.24rem;

        &::-webkit-input-placeholder {
          color: #fff;
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

    &.agree-model {
      height: auto;
      margin-top: 0.3rem;
      font-size: 0.18rem;
      color: #86cbd1;
    }

    &.submit-model {
      height: 0.66rem;
      line-height: 0.66rem;
      margin-top: 0.3rem;
      background-color: #024da1;
      border-radius: 0.33rem;
      color: #ffffff;
      font-size: 0.24rem;
      text-align: center;
    }
  }
}

.glyphicon-ok-sign.red {
  color: #409eff;
}

.getcode {
  font-size: 0.24rem;
}

.red-theme {
  .register-avatar {
    background-color: #222;
  }

  .register-form {
    background-color: #fff;
  }

  .register-form-item.input-model {
    background-color: #fff;
    border-color: #c9c9c9;
    border: 0.01rem solid #c9c9c9;
  }

  .register-form-item.agree-model {
    color: #000;

    a {
      color: #bb1815 !important;
    }
  }

  .register-form-item.submit-model {
    background-color: #bb1815;
  }
}

/deep/ .select {
  //width: 1.3rem;
  //margin-left: 0.1rem;
  //background: #121319;
  //flex-shrink: 0;
  //
  //input {
  //  background: #121319;
  //}

  flex: 1;
  margin-left: 0.1rem;
  background-color: #121319;
  border: none;
}
</style>
