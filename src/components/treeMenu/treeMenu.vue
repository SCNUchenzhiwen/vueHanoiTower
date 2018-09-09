<script>
  export default {
    render (createElement) {
      let options = {
        'class': {
          'treeWrap': true
        }
      }
      let getVNode = (dataArr) => {
        let childLiArr = []
        let ulOptions = {
          'class': {
            itemWrap: true
          }
        }
        dataArr.forEach((item) => {
          let childTxt = null
          let childUl = null
          let childArr = []
          let childPOptions = {
            on: {
              click: this.showMenu
            },
            'class': {
              txtWrap: true
            },
            attrs: {}
          }
          let liOptions = {
            style: {
              'marginLeft': '2em'
            }
          }
          if (item.txt) {
            childTxt = createElement('p', childPOptions, item.txt)
            childArr.push(childTxt)
          }
          if (item.child) {
            childUl = getVNode(item.child)
            childArr.push(childUl)
          }
          childLiArr.push(createElement('li', liOptions, childArr))
        })
        return createElement('ul', ulOptions, childLiArr)
      }
      let vNode = getVNode(this.data)
      return createElement('div', {
        attrs: {
          id: 'treeWrap'
        }
      }, [vNode])
    },
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        vNodeArr: []
      }
    },
    methods: {
      showMenu (e) {
        e.stopPropagation()
        let el = e.target.nextSibling
        if (el) {
          let className = 'close'
          if (this.hasClass(el, className)) {
            this.delClass(el, className)
            this.dropDown(el)
          } else {
            this.dropUp(el)
//            this.addClass(el, className)
          }
        }
      },
      dropDown (el) {
        let className = 'drop-active'
        let elHeight = el.offsetHeight
        el.style.height = 0 + 'px'
        this.addClass(el, className)
        setTimeout(() => {
          el.style.height = elHeight + 'px'
          setTimeout(() => {
            this.delClass(el, className)
            el.style.height = ''
          }, 300)
        }, 10)
      },
      dropUp (el) {
        let className = 'drop-active'
        let elHeight = el.offsetHeight
        el.style.height = elHeight + 'px'
        this.addClass(el, className)
        setTimeout(() => {
          el.style.height = 0 + 'px'
          setTimeout(() => {
            this.delClass(el, className)
            this.addClass(el, 'close')
            el.style.height = ''
          }, 300)
        }, 10)
      },
      addClass (el, className) {
        if (!className || !el) return
        if (this.hasClass(el, className)) return
        el.className = el.className + ' ' + className
      },
      hasClass (el, className) {
        return el.className.indexOf(className) > -1 ? true : false
      },
      delClass (el, className) {
        if (!className || !el) return
        if (!this.hasClass(el, className)) return
        let classArr = el.className.split(' ')
        let index = classArr.indexOf(className)
        classArr.splice(index, 1)
        el.className = classArr.join(' ')
      },
      initHeight () {
        let treeWrap = document.getElementById('treeWrap')
        let items = treeWrap.querySelectorAll('.itemWrap')
        items.forEach((item) => {
//          let ulHeight = 0
//          item.childNodes.forEach((liItem) => {
//            let pItems = liItem.querySelector('.txtWrap')
//            ulHeight += pItems.offsetHeight
//          })
//          item.style.height = item.offsetHeight + 'px'
          this.addClass(item, 'close')
        })
        this.delClass(items[0], 'close')
      }
    },
    mounted () {
      this.initHeight()
    }
  }
</script>

<style scoped>
  ul, li, p {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .txtWrap {
    color: #3D8F8F;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    cursor: pointer;
    font-size: 14px;
    line-height: 28px;
    display: block;
    padding: 10px 15px;
    position: relative;
  }

  /*.txtWrap:hover {*/
    /*background-color: greenyellow;*/
  /*}*/

  li {
    text-align: start;
  }

  .foo {
    background: #233;
  }

  .treeWrap {
    background-color: #fff;
    color: #333333;
  }

  .itemWrap {
    overflow: hidden;
  }

  .itemWrap.drop-active {
    transition: all .3s;
  }

  .itemWrap.close {
    position: absolute;
    opacity: 0;
    z-index: -10;
  }

  #treeWrap {
    background-color: #ffffff;
  }

  #treeWrap>.itemWrap>li{
    margin-left: 0!important;
  }
</style>
