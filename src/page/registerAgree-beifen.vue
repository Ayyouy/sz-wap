<template>
  <div class="wrapper">
    <div class="content reg-agree">
      <p v-for="item in agreecontent.split('。')" :key="item">{{ item }}。</p>
    </div>
    <div class="iframe-box">
      <canvas v-for="page in pages" :id="'the-canvas'+page" :key="page"></canvas>
    </div>
  </div>
</template>
<script>
import {Toast} from 'mint-ui'
import * as api from '@/axios/api'
import PDFJS from 'pdfjs-dist'

export default {
  data () {
    return {
      agreeUrl: '', // 注册协议地址
      pdfDoc: null,
      agreecontent: '',
      pages: 0
    }
  },
  mounted: function () {
    this.getInfoSite()
  },
  created () {
    window.addEventListener('onload', this.setIframeContent)
  },
  methods: {
    async getInfoSite () {
      // 获取 logo
      let data = await api.getInfoSite()
      if (data.status === 0) {
        this.logo = data.data.siteLogoSm
        this.agreeUrl = data.data.regAgree
        this.agreecontent = data.data.tradeAgreeText
        this._loadFile(this.agreeUrl)
      } else {
        Toast(data.msg)
      }
    },
    setIframeContent () {
      // let width = this.$refs.iframeBox
    },
    _renderPage (num) {
      this.pdfDoc.getPage(num).then((page) => {
        let canvas = document.getElementById('the-canvas' + num)
        let ctx = canvas.getContext('2d')
        let dpr = window.devicePixelRatio || 1
        let bsr = ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio || 1
        let ratio = dpr / bsr
        let viewport = page.getViewport(screen.availWidth / page.getViewport(1).width)
        canvas.width = viewport.width * ratio
        canvas.height = viewport.height * ratio
        canvas.style.width = viewport.width + 'px'
        canvas.style.height = viewport.height + 'px'
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport
        }
        page.render(renderContext)
        if (this.pages > num) {
          this._renderPage(num + 1)
        }
      })
    },
    _loadFile (url) {
      PDFJS.getDocument(url).then((pdf) => {
        this.pdfDoc = pdf
        this.pages = this.pdfDoc.numPages
        this.$nextTick(() => {
          this._renderPage(1)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
body {
  background-color: #fff;
}

.wrapper {
  width: 100%;
  height: 100%;
  padding-bottom: 0;
  //overflow: hidden;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}

.reg-agree {
  margin: 15px;
  background: #1b1c25;
  border-radius: 5px;
  line-height: 200%;
  box-shadow: 0 0 0.1rem 0.1rem #0002;
}

.iframe-box {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  top: 0;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  width: 100%;
  height: 100%;

  overflow:scroll
  .iframe {
    overflow: scroll;
    width: 100%;
    height: 100%;

    body {
      overflow: auto;
    }
  }
}
</style>
