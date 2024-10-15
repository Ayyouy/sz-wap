<template>
  <div class="wrapper">
    <div class="box transaction">
      <div class="box-contain clearfix">
        <div class="empty text-center">
          <!-- 您已通过实名认证 -->
          <i v-show="this.$store.state.userInfo.isActive == 1" style="color:red;font-size: 1.5rem;"
             class="iconfont icon-shenhezhong"></i>
          <i v-show="!showBtn && this.$store.state.userInfo.isActive != 1" style="color:red;font-size: 1.5rem;"
             class="iconfont icon-tongguo1"></i>
          <i v-show="showBtn" style="color:red;font-size: 1.5rem;" class="iconfont icon-icon-test"></i>
        </div>
      </div>
    </div>
    <div class="form-block">
      <div class="auth-msg" v-if="this.$store.state.userInfo.isActive == 3">
        <p>认证失败，请重新认证</p>
        <div>
          失败原因：{{ this.$store.state.userInfo.authMsg }}
        </div>
      </div>
      <mt-field label="真实姓名" placeholder="请输入您的真实姓名" type="text" v-model="form.name"></mt-field>
      <mt-field label="身份证号" placeholder="请输入您的身份证号" type="text" v-model="form.idCard"></mt-field>
    </div>
    <div class="upload-box clearfix">
      <div class="upload-btn">
        <el-upload
          name="upload_file"
          list-type="picture-card"
          :with-credentials='true'
          action="#"
          multiple
          :limit="1"
          :file-list="fileList1"
          :show-file-list="false"
          :auto-upload="false"
          :on-exceed="limitCheck1()"
          :on-remove='removeFile1'
          :on-change="handleChange1"
          class="avatar-uploader">
          <img v-if="form.img1key" :src="form.img1key" class="id-img avatar">
          <i v-else class="iconfont icon-zhaopian"></i>
          <span v-if="!form.img1key && !imgStatus" class="btn-title">身份证正面</span>
          <span v-if="imgStatus" class="btn-title">正在上传中...</span>
        </el-upload>
      </div>
      <div class="upload-btn">
        <el-upload
          name="upload_file"
          list-type="picture-card"
          :with-credentials='true'
          action="#"
          multiple
          :limit="1"
          :file-list="fileList2"
          :show-file-list="false"
          :auto-upload="false"
          :on-exceed="limitCheck2()"
          :on-remove="removeFile2"
          :on-change="handleChange2"
          class="avatar-uploader">
          <img v-if="form.img2key" :src="form.img2key" class="id-img avatar">
          <i v-else class="iconfont icon-zhaopian"></i>
          <span v-if="!form.img2key && !imgStatus2" class="btn-title">身份证背面</span>
          <span v-if="imgStatus2" class="btn-title">正在上传中...</span>
        </el-upload>
      </div>
    </div>
    <div class="rule-box">
      <div class="title">认证规则：</div>
      <ul>
        <li>1、新用户注册后必须通过实名认证审核。</li>
        <li>2、姓名和身份证号码一经认证不予修改，修改请联系客服。</li>
        <li>3、真实姓名必须和出金银行卡户名一致。</li>
      </ul>
    </div>
    <div v-show="showBtn" class="btnbox">
      <span class="text-center btnok" @click="toSure">确定</span>
    </div>

  </div>
</template>

<script>
import * as api from '@/axios/api'
import {Toast} from 'mint-ui'
import {isNull} from '@/utils/utils'
import axios from 'axios'
import APIUrl from '@/axios/api.url'

export default {
  components: {},
  props: {},
  data () {
    return {
      form: {
        phone: '',
        name: '',
        idCard: '',
        img1key: '',
        img2key: '',
        img3key: ''
      },
      img1Key: '',
      img2Key: '',
      img3Key: '',
      showBtn: true,
      imgStatus: false,
      imgStatus2: false,
      fileList1: [],
      fileList2: [],
      url: ''
    }
  },
  created () {
    if (this.$store.state.userInfo.isActive === 1 || this.$store.state.userInfo.isActive === 2) {
      this.form.idCard = this.$store.state.userInfo.idCard
      this.form.name = this.$store.state.userInfo.realName
      this.form.img1key = this.$store.state.userInfo.img1Key
      this.form.img2key = this.$store.state.userInfo.img2Key
      this.showBtn = false
    }
  },
  beforeDestroy () {
    if (this.$state.theme === 'red') {
      document.body.classList.remove('red-bg')
      document.body.classList.add('black-bg')
    }
  },
  mounted () {
    this.url = APIUrl.baseURL
    if (this.$state.theme === 'red') {
      document.body.classList.remove('black-bg')
      document.body.classList.add('red-bg')
    }
  },
  methods: {
    limitCheck1 (file, fileList) {
      Toast('每次最多上传一个文件')
      this.form.img1key = ''
      this.fileList1 = []
    },
    limitCheck2 (file, fileList) {
      Toast('每次最多上传一个文件')
      this.form.img2key = ''
      this.fileList2 = []
    },
    removeFile1 (file, fileList) {
      this.form.img1key = ''
      this.fileList1 = fileList
    },
    removeFile2 (file, fileList) {
      this.form.img2key = ''
      this.fileList2 = fileList
    },
    handleChange1 (file, fileList) {
      this.fileList1 = fileList
      const isLt10M = (file.size / 1024 / 1024 < 10)
      if (!isLt10M) {
        Toast('上传图片大小不能超过 10MB!')
        this.fileList1.pop()
      } else {
        this.imgStatus = true
        this.confirm(1)
      }
      return isLt10M
    },
    handleChange2 (file, fileList) {
      this.fileList2 = fileList
      const isLt10M = (file.size / 1024 / 1024 < 10)
      if (!isLt10M) {
        Toast('上传图片大小不能超过 10MB!')
        this.fileList2.pop()
      } else {
        this.imgStatus2 = true
        this.confirm(2)
      }
      return isLt10M
    },
    confirm (val) {
      const param = new FormData()
      if (val === 1) {
        param.append('upload_file', this.fileList1[0].raw)
      } else if (val === 2) {
        param.append('upload_file', this.fileList2[0].raw)
      }
      const url = this.url + '/user/upload.do'
      axios(url, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': localStorage.getItem('wap-token')
        },
        method: 'POST',
        data: param
      }).then(res => {
        if (val === 1) {
          this.imgStatus = false
          this.form.img1key = res.data.data.url
          this.fileList1 = []
        } else if (val === 2) {
          this.imgStatus2 = false
          this.form.img2key = res.data.data.url
          this.fileList2 = []
        }
      }).catch(res => {
        Toast(res.data.msg)
        if (val === 1) {
          this.imgStatus = false
          this.form.img1key = ''
          this.fileList1 = []
        } else if (val === 2) {
          this.imgStatus2 = false
          this.form.img2key = ''
          this.fileList2 = []
        }
      })
    },
    toSure () {
      // 实名认证弹框
      if (isNull(this.form.name)) {
        Toast('请输入您的真实姓名')
        return
      }
      if (isNull(this.form.idCard)) {
        Toast('请输入您的身份证号')
        return
      }
      if (isNull(this.form.img1key) && isNull(this.form.img2key)) {
        Toast('请上传您的至少一张身份证照片')
        return
      }
      // 显示确认弹窗
      this.toAuthentication()
    },
    async toAuthentication () {
      let opts = {
        realName: this.form.name,
        idCard: this.form.idCard,
        img1key: this.form.img1key,
        img2key: this.form.img2key,
        img3key: this.form.img3key
      }
      let data = await api.userAuth(opts)
      if (data.status === 0) {
        Toast('提交成功!')
        this.goBack()
      } else {
        Toast(data.msg)
      }
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.transaction {
  color: rgba(100, 100, 100, 0.78);

  .empty {
    width: 100%;
    // height: 1.34rem;
    font-size: 0.43rem;
    color: #888888;
    text-align: center;
    line-height: 2rem;
    // background: url('../../assets/img/thingsOk.png') no-repeat center center;
    background-size: 70%;
  }
}

.rule-box {
  padding: 0.2rem 0.3rem;

  .title {
    font-size: 0.3rem;
    height: 0.5rem;
    line-height: 0.5rem;
    margin-bottom: 0.2rem;
  }

  ul {
    li {
      color: #999;
      line-height: 0.5rem;
    }
  }
}

.upload-box {
  padding: 0.5rem;

  .upload-btn {
    // border: 1px solid #ddd;
    border-radius: 4px;
    width: 40%;
    height: 1.6rem;
    margin-bottom: 10px;
    float: left;
    margin: 0.2rem 5%;
    text-align: center;
    position: relative;

    .btn-hidden {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      opacity: 0;
    }

    .id-img {
      max-width: 100%;
      max-height: 100%;
    }

    /deep/ .el-upload--picture-card {
      background: none;
      width: 100%;
      height: 1.6rem;
      line-height: 1.6rem;
    }

    .btn-title {
      position: absolute;
      top: 23px;
      left: 0;
      width: 100%;
    }

    /deep/ .el-upload__input {
      display: none;
    }

  }

}

.auth-msg {
  padding: 0.2rem 0.6rem;
  line-height: 0.4rem;

  p {
    color: red;
  }

  div {
    color: #ddd;
  }
}

</style>
