<template>
  <div class="ui-word-ntko">
    <ul class="button-wrap">
      <li class="item">
        <button v-for="(item, index) in ntkoEvent" class="btn btn-ntko" @click="ntkoClick(index)" :key="index">
          {{item.btnTxt}}

        </button>
      </li>
    </ul>
    <div class="ntko-wrap">
      <div class="ntko-ie ntko-item" v-if="sys['ie']">
        <object :id="ntkoConfig.controlId" :codeBase="ntkoConfig.codeBase" :classid="ntkoConfig.classid"
                :style="{height: ntkoConfig.height, width: ntkoConfig.width}">
          <param v-for="(item, key) in ntkoParams" :name="key" :value="item" :key="key">
        </object>
      </div>
    </div>
  </div>
</template>

<script>
  import {getBrowserType, signRed, setDocUser, setMarkModify, showRevisions, saveToServer, saveToLocal} from './apis'
  import {ntkoParams} from './config'
  export default {
    name: 'vWordNtko',
    data () {
      return {
        sys: {},
        ntkoConfig: {
          controlId: 'citicNtko', // 元素id
//          codeBase: location.origin + '/static/ntko/OfficeControl_back.cab#version=5,0,2,1', // 控件加载路径
//          codeBase: location.origin + '/static/ntko/OfficeControl.cab#version=5,0,3,1', // 控件加载路径
          codeBase: location.origin + '/static/ntko/OfficeControl.cab#version=5,0,2,1', // 控件加载路径
//          classid: 'clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404', // classid
//          classid: 'clsid:A39F1330-3322-4a1d-9BF0-0BA2BB90E970', // classid
          classid: 'clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404', // classid
          height: '100%',
          width: '100%'
        },
        // 控件对象
        ntkoCtrObj: null,
        ntkoEvent: [
          {
            btnTxt: '简单套红',
          },
          {
            btnTxt: '设置当前用户'
          },
          {
            btnTxt: '开启留痕'
          },
          {
            btnTxt: '关闭留痕'
          },
          {
            btnTxt: '显示留痕'
          },
          {
            btnTxt: '隐藏留痕'
          },
          {
            btnTxt: '保存到服务器'
          },
          {
            btnTxt: '保存到本地'
          }
        ]
      }
    },
    methods: {
      // 获取浏览器类型
      _getBrowserType () {
        let sys = getBrowserType()
        Object.keys(sys).forEach((key) => {
          this.$set(this.sys, key, sys[key])
        })
      },
      // 一些操作事件
      ntkoClick (index) {
        index = parseInt(index)
        switch (index) {
          // 套红
          case 0:
            signRed(this.ntkoCtrObj);
            break;
          // 设置当前用户
          case 1:
            setDocUser(this.ntkoCtrObj, '又呆又萌又可爱');
            break;
          // 开启留痕
          case 2:
            setMarkModify(this.ntkoCtrObj, true);
            break;
          // 关闭留痕
          case 3:
            setMarkModify(this.ntkoCtrObj, false);
            break;
          // 显示留痕
          case 4:
            showRevisions(this.ntkoCtrObj, true);
            break;
          // 隐藏留痕
          case 5:
            showRevisions(this.ntkoCtrObj, false);
            break;
          // 保存到服务器
          case 6:
            saveToServer(this.ntkoCtrObj);
            break;
          // 保存到本地
          case 7:
            saveToLocal(this.ntkoCtrObj);
            break;
        }
      },
      // 获取控件对象
      getNtkoCtrObj () {
        this.$nextTick(() => {
          this.ntkoCtrObj = document.getElementById(this.ntkoConfig.controlId)
        })
      }
    },
    computed: {
      ntkoParams () {
        return ntkoParams
      }
    },
    created () {
      this._getBrowserType()
    },
    mounted () {
      this.getNtkoCtrObj()
    }
  }
</script>

<style scoped>
  .ui-word-ntko {
    width: 100%;
    height: 100%;
  }

  .ntko-wrap {
    width: 100%;
    height: 100%;
  }

  .ntko-item {
    width: 100%;
    height: 100%;
  }
</style>
