<template>
  <div :class="`wrapper ${$state.theme === 'red' ? 'red-theme' : 'black-theme'}`">
    <div class="top-wrapper">
      <div class="title-wrapper">{{ $t('open.process') }}</div>
      <div class="content-box">
        <el-steps :active="0" class="steps-box" align-center>
          <el-step :title="$t('open.register')"></el-step>
          <el-step :title="$t('open.verification')"></el-step>
          <el-step :title="$t('open.deposit')"></el-step>
          <el-step :title="$t('open.trading')"></el-step>
        </el-steps>
        <ul class="ul-list">
          <li class="li-item animated fadeInLeft">
            <div class="div-icon">
              <div class="icon">
                <img :src="openIcon1" alt="">
              </div>
            </div>
            <div class="div-content">
              <div class="content">
                <h3>{{ $t('open.distribute') }}</h3>
                <p>{{ $t('open.line') }}</p>
              </div>
            </div>
          </li>
          <li class="li-item animated fadeInRight">
            <div class="div-icon">
              <div class="icon">
                <img :src="openIcon2" alt="">
              </div>
            </div>
            <div class="div-content">
              <div class="content">
                <h3>{{ $t('open.service') }}</h3>
                <p>{{ $t('open.flexible') }}</p>
              </div>
            </div>
          </li>
          <li class="li-item animated fadeInLeft">
            <div class="div-icon">
              <div class="icon">
                <img :src="openIcon3" alt="">
              </div>
            </div>
            <div class="div-content">
              <div class="content">
                <h3>{{ $t('open.instant') }}</h3>
                <p>{{ $t('open.capital') }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="btnbox animated fadeInUp text-center">
        <span class="login btnok" @click="toLogin">
           {{ $t('open.login') }}
        </span>
        <span class="register btnok" @click="toRegister">
         {{ $t('open.register') }}
        </span>
      </div>
    </div>
    <div class="bottom-prompt">
      <h2 class="text-center">{{ $t('open.prepare') }} </h2>
      <ul class="list list2 clearfix">
        <li>
          <div class="circle">
            <div class="icon">
              <img :src="dataIcon1" alt="">
            </div>
          </div>
          <h3>{{ $t('open.card') }} </h3>
          <p>{{ $t('open.identification') }} </p>
        </li>
        <li>
          <div class="icon">
            <img :src="dataIcon2" alt="">
          </div>
          <h3>{{ $t('open.bank') }} </h3>
          <p>{{ $t('open.bankName') }} </p>
        </li>
        <li>
          <div class="icon">
            <img :src="dataIcon3" alt="">
          </div>
          <h3>{{ $t('open.wifi') }}</h3>
          <p>{{ $t('open.network') }}</p>
        </li>
      </ul>
    </div>
    <foot></foot>
  </div>
</template>
<script>
import foot from '@/components/foot/foot'

export default {
  data () {
    return {
      openIcon1: require('../../static/img/openAccount/open-icon1.png'),
      openIcon2: require('../../static/img/openAccount/open-icon2.png'),
      openIcon3: require('../../static/img/openAccount/open-icon3.png'),
      dataIcon1: require('../../static/img/openAccount/data-icon1.png'),
      dataIcon2: require('../../static/img/openAccount/data-icon2.png'),
      dataIcon3: require('../../static/img/openAccount/data-icon3.png'),
    }
  },
  components: {
    foot
  },
  created () {
    this.$setgoindex()
  },
  methods: {
    toLogin () {
      // 登录
      this.$router.push('/login')
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
.wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0rem 0rem 1rem;

  .top-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 0 0.5rem;
    background: url('/static/img/openAccount/top-bg.png');
    background-size: cover;

    .title-wrapper {
      font-size: 0.3rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 1rem;
      text-align: center;
    }

  }

  .content-box {
    padding-top: 0.1rem;

    /deep/ .steps-box {
      .el-step__icon {
        background: rgba(255, 255, 255, 0.3);
        border: 0;
        position: relative;

        &::after {
          position: absolute;
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          background-color: #E6003E;
          border-radius: 10px;
          left: 50%;
          top: 50%;
          margin-left: -5px;
          margin-top: -5px;
        }
      }

      .el-step__line {
        background-color: #EDECEC;
        top: 9px;
      }

      .el-step__main {
        .el-step__title {
          font-size: 0.26rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 0.7rem;
        }
      }
    }

    .list-item {
      display: flex;
      align-items: center;
      padding: 0;
      margin: 0.38rem 0;

      .icon {
        width: 0.67rem;
        height: 0.67rem;
        background-color: #E6003E;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;

        img {
          width: 0.32rem;
        }
      }

      .content {
        margin-left: 0.25rem;

        h3 {
          font-size: 0.26rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 0.42rem;
          margin: 0;
        }

        p {
          font-size: 0.24rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #E6003E;
          line-height: 0.42rem;
        }
      }
    }
  }

  .btnbox {
    margin-top: 0.8rem;
    padding-bottom: 0.5rem;
    display: flex;

    .login {
      width: 3rem;
      height: 0.6rem;
      line-height: 0.6rem;
      background: #024EA2;
      margin: 0 0.2rem;
    }

    .register {
      width: 3rem;
      height: 0.6rem;
      line-height: 0.6rem;
      background: #024EA2;
      margin: 0 0.2rem;
    }
  }
}

.ul-list {
  width: 6rem;
  margin: 0 auto;
}

.li-item {
  width: 6rem;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0.38rem 0;

  .div-icon {
    width: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .div-content {
    width: 5rem;
  }

  .icon {
    width: 0.67rem;
    height: 0.67rem;
    background-color: #E6003E;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;

    img {
      width: 0.32rem;
    }
  }

  .content {
    margin-left: 0.25rem;

    h3 {
      font-size: 0.26rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 0.42rem;
      margin: 0;
    }

    p {
      font-size: 0.24rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #E6003E;
      line-height: 0.42rem;
    }
  }
}


.list {
  width: 5rem;
  margin: 0 auto;

  li {
    position: relative;
    padding: 0.25rem 0.1rem;
    padding-left: 1.1rem;
    padding-bottom: 0.3rem;

    h3 {
      font-size: 0.3rem;
      margin-bottom: 0.15rem;
    }

    p {
      line-height: 0.3rem;
      color: #999;
      font-size: 0.24rem;
    }
  }

  .iconfont {
    position: absolute;
    left: 0;
    font-size: 0.8rem;
    color: #ff6006;
    top: 0.22rem;
  }
}

.list2 {
  padding: 0.4rem 0.6rem;

  li {
    width: 48%;
    float: left;
    padding-left: 1rem;
  }

  li:nth-child(2) {
    margin-left: 2%;
  }
}

.bottom-prompt {
  width: 100%;
  box-sizing: border-box;
  padding: 0 0.2rem 1rem 0.2rem;

  h2 {
    font-size: 0.3rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 0.92rem;
  }

  ul {
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;

    li {
      padding: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon {
        width: 0.67rem;
        height: 0.67rem;
        background-color: #E6003E;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 0.32rem;
        }
      }

      h3 {
        font-size: 0.24rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 0.46rem;
      }

      p {
        font-size: 0.2rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(208, 208, 208, 1);
        line-height: 0.42rem;
        text-align: center;
      }
    }
  }
}

.btnbox {
  width: 100%;
}

.btnbox .btnok {
  width: 40%;
  /*height: 0.92rem;*/
  margin: 20px auto 0 auto;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  border-radius: 0.46rem;
  // background: #d50000;
  margin: 4.5%;
}

.red-theme {
  .top-wrapper {
    background: white;

    .btnbox {
      .login {
        background-color: #BB1715;
      }

      .register {
        background-color: #212121;
      }
    }

    .title-wrapper {
      color: #212121;
    }

    /deep/ .el-steps {
      .el-step__title {
        color: #212121 !important;
      }

      .el-step__icon {
        background: rgba(0, 0, 0, 0.1);

        &::after {
          background-color: #BB1815;
        }
      }
    }

    .list-item {
      .icon {
        background-color: #BB1815;
      }

      .content {
        h3 {
          color: #212121;
        }

        p {
          color: #BB1815;
        }
      }
    }
  }

  .bottom-prompt {
    .icon {
      background-color: #BB1815;
    }

    h2 {
      color: #212121;
    }

    h3 {
      color: #212121;
    }

    p {
      color: #212121;
    }
  }
}
</style>
