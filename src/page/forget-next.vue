<template>
  <div class="wrapper">
    <div class="title">
      输入您的手机号
    </div>
    <div class="forget-form">
      <div class="form-item input-model">
        <select v-model="select">
          <option v-for="item in options" :key="item" :label="item" :value="item">{{item}}</option>
        </select>
        <input placeholder="请输入手机号" type="tel" pattern="[0-9]*" v-model="phone"/>
      </div>
      <div class="form-item input-model">
        <span>验证码</span>
        <input placeholder="请输入验证码" style="width: 1.4rem;" type="text" pattern="[a-zA-Z0-9]+" v-model="code"/>
        <span v-if="codeshow" @click="checkCodeBox">获取验证码</span>
        <span v-if="!codeshow">{{ count }}s</span>
      </div>
      <div class="form-item input-model">
        <span>新密码</span>
        <input placeholder="请输入新密码" type="password" pattern="[a-zA-Z0-9]+" v-model="password"/>
      </div>
      <div class="form-item input-model">
        <span>新密码</span>
        <input placeholder="请再次输入新密码" type="password" pattern="[a-zA-Z0-9]+" v-model="password2"/>
      </div>
      <div class="form-item submit-model" @click="gook">确定</div>
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
        <div class="check-box row">
          <div class="title">
            输入图片上的验证码
          </div>
          <mt-field label="验证码" placeholder="请输入验证码" v-model="code2">
            <img
              @click="refreshImg"
              :src="adminUrl + '/code/getCode.do?time=' + imgCodeTime"
              height="45px"
              width="100px"
            />
          </mt-field>
          <p class="red" v-if="!checkCodeState">
            您输入的验证码有误,请重新输入
          </p>
          <div class="text-center" style="width: 100%; padding: 0.2rem;">
            <mt-button type="primary" @click="checkImg">确定</mt-button>
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
  components: {},
  props: {},
  data () {
    return {
      options: ['+1', '+852', '+91', '+81', '+86', '+88', '+00', '+99'],
      phone: '',
      password: '',
      password2: '',
      code: '',
      code2: '',
      codeshow: true,
      count: '', // 倒计时
      clickFalg: 0, //  点击次数
      imgCode: '',
      adminUrl: '',
      dialogShow: false, // 显示弹窗
      ischeckImg: false,
      checkCodeState: true, // 验证码的状态
      dialogImgShow: false, // 图片显示
      imgCodeTime: 0,
      select: '+1',
      logging: false
    }
  },
  watch: {
    code2 (newval) {
      if (newval) {
        this.checkCodeState = true
      }
    }
  },
  computed: {},
  methods: {
    checkCodeBox () {
      if (isNull(this.phone) || this.phone.length < 7) {
        Toast('请输入正确的手机号')
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
        this.checkCodeState = false
        Toast('您输入的验证码有误,请重新输入')
        return
      }
      let data = await api.checkCode({code: this.code2})
      if (data === 'true' || data === true) {
        this.getcode()
        this.dialogShow = false
        this.checkCodeState = true
      } else {
        this.checkCodeState = false
        Toast('您输入的验证码有误,请重新输入')
        this.adminUrl = process.env.API_HOST + '1'
        this.adminUrl = process.env.API_HOST
        if (this.adminUrl === undefined) {
          this.adminUrl = ''
        }
      }
    },
    async getcode () {
      if (this.clickFalg !== 0) {
        this.clickFalg = 0
        return
      }
      this.clickFalg++
      if (isNull(this.phone) || this.phone.length < 7) {
        Toast('请输入正确的手机号码')
      } else {
        let result = await api.sendForgetSms({phoneNum: this.select + this.phone})
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
        }
      }
    },
    async checkPhone () {
      // 先验证是否已经注册
      let data = await api.checkPhone({phoneNum: this.select + this.phone})
      if (data.status === 0) {
        // 如果用户已存在返回 0
        this.dialogShow = true
        this.adminUrl = process.env.API_HOST
        if (this.adminUrl === undefined) {
          this.adminUrl = ''
        }
        // this.gook()
      } else {
        Toast('用户还未注册,请注册')
        this.$router.push('/register')
      }
    },
    async gook () {
      if (this.logging) {
        return
      }
      this.logging = true
      if (isNull(this.phone) || this.phone.length < 7) {
        Toast('请输入正确的手机号码')
        this.logging = false
      } else if (isNull(this.password)) {
        Toast('请输入密码')
        this.logging = false
      } else if (isNull(this.password2)) {
        Toast('请确认确认密码')
        this.logging = false
      } else if (isNull(this.code)) {
        Toast('请输入验证码')
        this.logging = false
      } else if (this.password !== this.password2) {
        Toast('两次输入的密码不一致')
        this.logging = false
        this.password = 0
        this.password2 = 0
      } else if (!pwdReg2(this.password)) {
        Toast('密码为6~12位，数字、字母或符号')
        this.logging = false
      } else {
        let opts = {
          phoneNum: this.select + this.phone,
          code: this.code,
          newPwd: this.password
        }
        let data = await api.forgetPas(opts)
        if (data.status === 0) {
          Toast('修改成功,请登录!')
          await this.$router.push('/login')
        } else {
          Toast(data.msg ? data.msg : '修改失败,请重新修改')
        }
        this.logging = false
      }
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

.title {
  width: 6.13rem;
  font-size: 0.43rem;
  margin-bottom: 0.34rem;
}

.forget-form {
  display: block;
  width: 6.13rem;
  height: 5.98rem;
  background-color: #1b1c25;
  position: relative;
  box-shadow: 0 0 0.1rem 0.1rem #0002;

  .form-item {
    width: 4.95rem;
    height: 0.66rem;
    border-radius: 0.33rem;
    margin: 0.45rem auto 0;

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
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        font-size: 13px;
        flex: 1;
        margin-left: 0.1rem;
        background-color: #121319;
        border: none;
        option {
          font-size: 13px;
          padding-right: 5px;
          padding-left: 5px;
        }
      }

      select:after {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        font-size: 13px;
        border: none;
      }

      input {
        flex: 1;
        margin: 0 0.2rem;
        font-size: 0.24rem;

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


.form-group {
  padding: 0rem 0.97rem;
  font-size: 0.29rem;

  //.title {
  //  font-size: 0.43rem;
  //  margin-bottom: 0.34rem;
  //  margin-top: 1.4rem;
  //}

  .mint-cell {
    padding: 0;
  }

  /deep/ .mint-cell-title {
    text-align: left;
  }

  /deep/ .mint-cell-wrapper {
    height: 1.19rem;
    line-height: 1.19rem;
  }
}

.btnbox {
  width: 35%;
  padding-top: 0.28rem;
}

.mint-popup-box {
  // width: 100%;
  // height: 100%;
  // background:#fff;
  .title {
    font-size: 0.43rem;
    margin-bottom: 0.34rem;
    // margin-top: 1.40rem;
    padding: 0.1rem 0.4rem;
    color: #333;
  }

  .mint-cell {
    background: none;
    color: #000;
    width: 100%;
  }

  /deep/ .mint-cell-text {
    color: #000;
  }

  .mint-cell-wrapper {
    border: 0.02rem solid #ddd;
  }

  .mint-button {
    margin-top: 0.2rem;
    width: 60%;
  }

  .check-box {
    p {
      padding: 0.2rem 0.4rem;
    }

    padding-bottom: 0.3rem;
  }
}

/deep/ .select {
  width: 1.5rem;
  margin-right: 0.5rem;
  background: #121319;

  input {
    background: #121319;
  }
}
</style>
