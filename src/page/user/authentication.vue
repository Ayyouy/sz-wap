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
      <!-- <mt-field label="手机号" placeholder="请输入您的手机号" v-model="form.phone"></mt-field> -->
      <mt-field label="真实姓名" placeholder="请输入您的真实姓名" type="text" v-model="form.name"></mt-field>
      <mt-field label="身份证号" placeholder="请输入您的身份证号" type="text" v-model="form.idCard"></mt-field>
    </div>
    <div class="upload-box clearfix">
      <!-- <form action=""> -->
      <div class="upload-btn">
        <el-upload
          :with-credentials='true'
          class="avatar-uploader"
          :action="admin+'/user/upload.do'"
          list-type="picture-card"
          name="upload_file"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error='handleError'
          :before-upload="beforeAvatarUpload">
          <img v-if="form.img1key" :src="form.img1key" class="id-img avatar">
          <i v-else class="iconfont icon-zhaopian"></i>
          <span v-if="!form.img1key && !imgStatus" class="btn-title">身份证正面</span>
          <span v-if="imgStatus" class="btn-title">正在上传中...</span>
        </el-upload>
        <!-- <i class="iconfont icon-tupian"></i> -->
        <!-- <span class="btn-title">身份证正面</span> -->
        <!-- <input class="btn-hidden" type="file" accept="image/jpeg, image/png, image/jpg" @change="handleFile"/> -->
        <!-- <img class="id-img" :src="this.form.img2Key" alt=""> -->
      </div>
      <div class="upload-btn">
        <el-upload
          :with-credentials='true'
          class="avatar-uploader"
          :action="admin+'/user/upload.do'"
          list-type="picture-card"
          name="upload_file"
          :show-file-list="false"
          :on-success="handleAvatarSuccess2"
          :on-error='handleError2'
          :before-upload="beforeAvatarUpload2">
          <img v-if="form.img2key" :src="form.img2key" class="id-img avatar">
          <i v-else class="iconfont icon-zhaopian"></i>
          <span v-if="!form.img2key && !imgStatus2" class="btn-title">身份证背面</span>
          <span v-if="imgStatus2" class="btn-title">正在上传中...</span>
        </el-upload>
        <!--
            :auto-upload="false"
            身份证背面 -->
      </div>
      <!-- <div class="upload-btn">
          <el-upload
              :with-credentials='true'
              class="avatar-uploader"
              :action="admin+'/user/upload.do'"
              list-type="picture-card"
              name="upload_file"
              :show-file-list="false"
              :on-success="handleAvatarSuccess3"
              :before-upload="beforeAvatarUpload3">
              <img v-if="form.img3key" :src="form.img3key" class="id-img avatar">
              <i v-else class="iconfont icon-zhaopian"></i>
              <span v-if="!form.img3key"  class="btn-title">手持身份证</span>
          </el-upload>
      </div> -->
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
import {compress} from '@/utils/imgupload'

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
      admin: '',
      imgStatus: false,
      imgStatus2: false
    }
  },
  watch: {},
  computed: {},
  created () {
    if (this.$store.state.userInfo.isActive === 1 || this.$store.state.userInfo.isActive === 2) {
      this.form.idCard = this.$store.state.userInfo.idCard
      this.form.name = this.$store.state.userInfo.realName
      this.form.img1key = this.$store.state.userInfo.img1Key
      this.form.img2key = this.$store.state.userInfo.img2Key
      //   this.form.img3key = this.$store.state.userInfo.img3Key
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
    if (this.$state.theme === 'red') {
      document.body.classList.remove('black-bg')
      document.body.classList.add('red-bg')
    }
    this.admin = process.env.API_HOST
    if (this.admin === undefined) {
      this.admin = ''
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imgStatus = false
      this.form.img1key = res.data.url
    },
    beforeAvatarUpload (file) {
      this.imgStatus = true
      //     const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
      //     const isLt2M = file.size / 1024 / 1024 < 20;
      //     if (!isJPG) {
      //         Toast('请选择jpg或者png的图片格式!');
      //     }
      // // if (!isLt2M) {
      // //     Toast('上传头像图片大小不能超过 2MB!');
      // // }
      //     return isJPG && isLt2M;
    },
    handleError () {
      this.imgStatus = false
    },
    handleAvatarSuccess2 (res, file) {
      this.imgStatus2 = false
      this.form.img2key = res.data.url // URL.createObjectURL(file.raw);
    },
    // 自动义图片上传 uploadFileFun2
    // async uploadFileFun2 (params) {
    //   const _that = this
    //   const isLt10M = file.size / 1024 / 1024 < 10
    //   if (!isLt10M) {
    //     this.$message.error('上传图片大小不能超过 10M!')
    //     return false
    //   } else {
    //     this.form.img2key = URL.createObjectURL(file.raw)
    //     compress(file.raw, function (val) {
    //       _that.form.img2key = val
    //     })
    //   }
    //   // 通过 FormData 对象上传文件
    //   const _file = params.file
    //   var formData = new FormData()
    //   formData.append('upload_file', _file)
    //   let data = await api.uploadimg(formData)
    //   if (data.status === 0) {
    //     this.form.img2key = data.data
    //   } else {
    //     Toast(data.msg)
    //   }
    // },
    beforeAvatarUpload2 (file) {
      this.imgStatus2 = true
      // const _that = this
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10M!')
        return false
      } else {
        this.form.img2key = URL.createObjectURL(file)
        compress(file, function (val) {
          // _that.theForm.picUrl = val
          // _that.imgFile = val
          // _that.showDelete = true
          // _that.$refs['addBuildingForm'].validateField('picUrl')
        })
      }
      // const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      // const isLt2M = file.size / 1024 / 1024 < 20;

      // return isJPG && isLt2M;
    },
    handleError2 () {
      this.imgStatus2 = false
    },
    handleAvatarSuccess3 (res, file) {
      this.form.img3key = res.data.url // URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload3 (file) {
      // const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpeg' || file.type === 'image/png';
      // const isLt2M = file.size / 1024 / 1024 < 20;
      // if (!isJPG) {
      //     Toast('请选择jpg或者png的图片格式!');
      // }
      // return isJPG && isLt2M;
    },
    // 上传
    handleFile: function (e) {
      // var that = this
      let $target = e.target || e.srcElement
      let file = $target.files[0]
      // if(file.size > 1024 * 1024 *20){
      let i = false
      if (i) {
        Toast('您上传的照片过大，请选择20M以下的图片')
      } else {
        // Indicator.open('Loading...')
        this.img1Key = file
        // this.$refs.formDate.submit()
        // this.uploadIdImg({upload_file:file})
        var reader = new FileReader()
        reader.onload = (data) => {
          let res = data.target || data.srcElement
          this.form.img1Key = res.result
          // Indicator.close()
        }
        // reader.onloadend = () => {
        //   Indicator.close()
        // }
        reader.readAsDataURL(file)
      }
    },
    // async uploadIdImg(){
    //      let imgformData = new FormData()

    //         imgformData.append('upload_file', this.img1Key)
    //     let data = await api.uploadFile({upload_file:this.img1Key})
    //     if(data.status == 0){
    //         Toast('认证成功!')
    //     }else{
    //         Toast(data.msg)
    //     }
    // },
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
      this.$router.back(-1)
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
