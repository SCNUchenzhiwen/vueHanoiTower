<template>
    <transition name="fade">
        <div class="maskWrapper" v-show="isShow">
            <transition name="bord">
              <div class="keyWrapper" v-show="isShow">
                    <div class="title">
                        <div class="text">请输入您的支付密码</div>
                        <div class="cancel" @click="close"><span>取消</span></div>
                    </div>
                    <div class="boardContent">
                <div class="show">
                      <div class="item" v-for="(index,item) in itemArr" :class="{'active':index <= pwdStr.length}"></div>
                </div>
                <transition name="board">
                        <div class="keyboard">
                            <ul class="top">
                                <li>
                                    <div class="num" @click="clickItem('1')">1</div>
                                    <div class="text"></div>
                                </li>
                                <li>
                                    <div class="num" @click="clickItem('2')">2</div>
                                    <div class="text">ABC</div>
                                </li>
                                <li>
                                    <div class="num" @click="clickItem('3')">3</div>
                                    <div class="text">DEF</div>
                                </li>
                                <li>
                                    <div class="num" @click="clickItem('4')">4</div>
                                    <div class="text">GHI</div>
                                </li>
                                <li>
                                    <div class="num" @click="clickItem('5')">5</div>
                                    <div class="text">JKL</div>
                                </li>
                                <li>
                                    <div class="num" @click="clickItem('6')">6</div>
                                    <div class="text">MNO</div>
                                </li>
                                <li>
                                    <div class="num" @click="clickItem('7')">7</div>
                                    <div class="text">PQRS</div>
                                </li>
                                <li>
                                    <div class="num" @click="clickItem('8')">8</div>
                                    <div class="text">TUV</div>
                                </li>
                                <li>
                                    <div class="num" @click="clickItem('9')">9</div>
                                    <div class="text">WXYZ</div>
                                </li>
                                <li>
                                    <div class="num"></div>
                                    <div class="text"></div>
                                </li>

                                <li>
                                    <div class="num" @click="clickItem('0')">0</div>

                                </li>

                                <li>
                                    <div class="num" @click.stop="del">
                                        <i class="icon-delete" ></i>
                                    </div>

                                </li>


                            </ul>
                        </div>
                </transition>

            </div>


        </div>
            </transition>
        </div>
    </transition>
</template>
<script>
    export default {

        props:{
            isShow: {
                type: Boolean,
                default: true
            },


        },
        data() {
            return {
                itemArr:[1,2,3,4,5,6],
                pwdStr:'',
            }
        },

        methods: {
              clickItem(num){
                  this.pwdStr += this.pwdStr.length >= 6 ? '' : num
              },

            del(){
                    this.pwdStr =this.pwdStr.slice(0,this.pwdStr.length-1);
                    console.log(this.pwdStr)
              },

            close(){
                console.log('dsfdf')
                this.isShow = false
            },
        }

    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .maskWrapper {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, .35);
        z-index: 1000;
        .keyWrapper {
            position: absolute;
            height: t(740);
            left: 0;
            right: 0;
            bottom: 0;
            background: #FFFFFF;
            z-index: 5000;
            .title {
                height: t(120);
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                .text {
                    font-size: t(36);
                    line-height: t(50);
                    color: #333333;
                }
                .cancel {
                    span {
                        display: inline-block
                    }
                    position: absolute;
                    right: t(30);
                    display: flex;
                    align-items: center;
                    width: t(56);
                    padding-right: t(30);
                    color: #9B9B9B;
                    font-size: t(28);
                    font-family: PingFangSC-Regular;
                    color: rgba(155, 155, 155, 1);
                    line-height: t(40);

                }

            }
            .boardContent {
                height: t(620);
                .show {
                    height: t(188);
                    padding: t(82) t(88);
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    .item {
                        border-radius: 50%;
                        width: t(24);
                        height: t(24);
                        background: #E8E8E8;
                        transition:background 0.2s;
                        &.active{
                            background: #666666;

                        }
                    }
                }
                .keyboard {
                    height: t(432);
                    .top {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        li {
                            width: t(234);
                            height: t(104);
                            border-radius: 10px;
                            border: t(1) solid rgba(204, 204, 204, 0.5);
                            border-top: none;
                            border-right: none;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                            .num {
                                color: #333333;
                                font-size: t(50);
                                line-height: t(58);
                                height: t(60);
                                i{
                                    font-size: t(50)
                                }
                            }
                            .text {
                                flex: 1;
                                color:#333333;
                                line-height:t(24);
                                font-size:t(20);
                                font-family:AppleSystemUIFont;
                            }

                        }
                    }

                }

            }
        }

    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 10s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

    .bord-enter-active, .bord-leave-active{
        transition: all 10s;
    }
    .bord-enter, .bord-leave-to{
        transform: translate3d(0, 100%, 0);
    }
    .bord-enter-to, .bord-leave{
        transform: translate3d(0, 0, 0)
    }
</style>
