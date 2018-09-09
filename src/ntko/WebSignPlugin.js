/**
 * WebSign插件，用于自定义表单。
 *
 * 1.WebSignPlugin.init();
 *    加载WebSign控件。
 *
 * 2.WebSignPlugin.submit();
 *    保存WebSign Info文档。
 */
WebSignPlugin = {
  //当前登陆用户相关信息件对象
  user: {id: "0", name: "开发用户", groupId: "0", groupName: "开发部"},
  //WebSign控件对象
  webSignObj: null,
  //附件对象
  fileObj: null,
  //判断当前表单页面是否有WebSign控件。
  hasWebSignField: false,
  //初始化
  //所做的操作如下：
  //1.检查当前表单中是否有webSign控件。
  //2.如果存在webSign控件
  // 	获取文件id，将webSign控件添加到容器中。
  init: function () {
    // this.user = getSignUserData();
    this.fileObj = $("input[controltype='webSign']");
    if (this.fileObj.length > 0) {
      var name = this.fileObj.attr("name");
      var fileId = this.fileObj.val();
      //容器的ID
      var divId = "div_" + name;
      var right = this.fileObj.attr("right");
      //没有权限，删除div容器。
      if (right == "no") {
        $("#" + divId).remove();
      } else {             //有读和写的权限，加载控件。
        //加载控件。
        this.webSignObj = new NtkoWebSign();
        //加载office控件。
        if (right == "r" || right == "rp") {   //只读时，没有按钮操作
          this.webSignObj.loadWebSign(divId, "ntkoocx" + divId, fileId, {
            user: this.user,
            imgStyle: 'display: none;',
            buttonStyle: "display: none;"
          });
        } else {   //可编辑 有按钮操作
          this.webSignObj.loadWebSign(divId, "ntkoocx" + divId, fileId, {
            user: this.user,
            imgStyle: 'display: none;',
            buttonStyle: "display: block;"
          });
        }
        $("#" + divId).removeClass("webSign-div");   //去掉背景图片 webSign-div为Web签章的样式自定样式
        //是否有office控件。
        this.hasWebSignField = true;
      }
    }
  },
  //提交文件保存。
  //如果有WebSign控件。则保存后将返回的附件id放到隐藏域。
  submit: function () {
    // if (!this.hasWebSignField) return;
    var right = this.fileObj.attr("right");
    var fileId = this.fileObj.val();
    //可写，保存office内容并上传。
    if (right != "no") {
      //保存到服务器。
      if (right == "w" || right == "b") {
        fileId = this.webSignObj.SaveToServer(right);   //返回保存对象的ID
      }
      //将结果放到隐藏域。
      this.fileObj.val(fileId);
    } else {
      $.ligerDialog.error("没有权限修改Web印章内容!", '提示信息');
    }
  }
};


//获取用户
function getSignUserData() {
  var user = OfficePlugin.user;
  var path = __ctx + '/platform/system/sysFile/getUserData.ht';
  $.ajaxSetup({async: false});  //同步
  $.post(path, {}, function (data) {
    if (data != "") {
      var obj = eval('(' + data + ')');
      if (obj.success) {
        user = obj.user;
      }
    }
  });
  $.ajaxSetup({async: true}); //异步
  return user;
};


//获取WebSign控件对象
function getntkoWebSignObjX() {

  if (WebSignPlugin.fileObj == null || 'undefined' == typeof (WebSignPlugin.fileObj) || WebSignPlugin.fileObj.length < 1) {
    $.ligerDialog.error("请添加Web印章控件,再进行操作!(控件只支持IE内核的浏览器)", '提示信息');
    return null;
  }
  var right = WebSignPlugin.fileObj.attr("right");  //权限
  if (right == "no") {
    $.ligerDialog.error("没有权限修改Web印章内容!", '提示信息');
    return null;
  }
  var ntkoWebSignObj = WebSignPlugin.webSignObj;
  if ((ntkoWebSignObj != "") && (ntkoWebSignObj != null) && ('undefined' != typeof (ntkoWebSignObj))) {
    return ntkoWebSignObj;
  } else {
    return null;
  }
}


//增加没有提示的手写WEB批注（自动对正大小）
function AddSecHandSignNoPromptX() {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.AddSecHandSignNoPrompt();
  }
}

//增加有提示的手写WEB批注（没有自动对正大小）
function AddSecHandSignX() {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.AddSecHandSign();
  }
}

//增加有提示的手写WEB批注（自动对正大小）
function AddSecHandSignAdjustX() {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.AddSecHandSignAdjust();
  }
}

//增加输入WEB批注（自动对正大小）
function AddSecKeyBoardCommentX() {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.AddSecKeyBoardComment();
  }
}

//输入有提示的本地WEB签章批注
function AddSecSignFromLocalX(mark) {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.AddSecSignFromLocal(true);
  }
}

//远程（URL）WEB签章批注
function AddSecSignFromURLX() {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.AddSecSignFromURL();
  }
}


//输入有提示的服务器WEB签章批注
function AddSecSignFromServiceX() {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.AddSecSignFromService();
  }
}

//输入有提示的Ekey硬件WEB签章批注
function AddSecSignFromEkeyX() {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.AddSecSignFromEkey();
  }
}

//最后一个签章保存为本地图片并清除临时文件
function SavePicAsTempFileX(webSignImg) {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.SavePicAsTempFile(webSignImg);
  }
}

//清除所有WEB签章
function ClearAllSignsX() {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.ClearAllSigns();
  }
}

//保存签章到附件
function SaveToServerX() {
  var ntkoWebSignObj = getntkoWebSignObjX();
  if (ntkoWebSignObj != null) {
    ntkoWebSignObj.SaveToServer(WebSignPlugin.fileObj.attr("right"));
  }
}


//选择Web签章方法
function webSignSelectEvent(selectEvent) {
  var selectValue = $("#" + selectEvent).val();
//	alert(selectValue);
  if (selectValue == 1) {
    AddSecHandSignNoPromptX();
  } else if (selectValue == 2) {
    AddSecHandSignX();
  } else if (selectValue == 3) {
    AddSecHandSignAdjustX();
  } else if (selectValue == 4) {
    AddSecKeyBoardCommentX();
  } else if (selectValue == 5) {
    AddSecSignFromLocalX();
  } else if (selectValue == 6) {
    AddSecSignFromURLX();
  } else if (selectValue == 7) {
    AddSecSignFromEkeyX();
  } else if (selectValue == 8) {
    SaveToServerX();
  } else if (selectValue == 9) {
    ClearAllSignsX();
  } else if (selectValue == 10) {
    AddSecSignFromServiceX();
  } else {
    return;
  }

  /*tags+='<div class="group"><a class="link AddSecHandSignNoPrompt" onclick="AddSecHandSignNoPromptX()" >手写批注无口令（自动）</a></div>';
   tags+='<div class="group"><a class="link AddSecHandSign" onclick="AddSecHandSignX()" >手写批注</a></div>';
   tags+='<div class="group"><a class="link AddSecHandSignAdjust" onclick="AddSecHandSignAdjustX()" >手写批注有口令（自动）</a></div>';
   tags+='<div class="group"><a class="link AddSecKeyBoardComment" onclick="AddSecKeyBoardCommentX()" >输入批注</a></div>';
   tags+='<div class="group"><a class="link AddSecSignFromLocal" onclick="AddSecSignFromLocalX(true)" >本地签章</a></div>';
   tags+='<div class="group"><a class="link AddSecSignFromURL" onclick="AddSecSignFromURLX()" >URL签章</a></div>';
   tags+='<div class="group"><a class="link AddSecSignFromEkey" onclick="AddSecSignFromEkeyX()" >Ekey签章</a></div>';
   tags+='<div class="group"><a class="link SavePicAsTempFile" onclick="SavePicAsTempFileX(\'webSignImg\')" >签章保存为本地图片并清除临时文件</a></div>';
   tags+='<div class="group"><a class="link ClearAllSigns" onclick="ClearAllSignsX()" >清除签章</a></div>';
   tags+='<div class="group"><a class="link SaveToServer" onclick="SaveToServerX()" >保存签章</a></div>';		*/
}


/** 鼠标获取位置 **/
//鼠标获取位置的方法
function mousePosition(ev) {
  if (ev.pageX || ev.pageY) {
    return {
      x: ev.pageX,
      y: ev.pageY
    };
  }
  return {
    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
    y: ev.clientY + document.body.scrollTop - document.body.clientTop
  };
}

//设置鼠标获取位置的对象
function mouseOndblclick(ev) {
  ev = ev || window.event;
  var mousePos = mousePosition(ev);
  var mousePosX = document.getElementById('mousePosX');
  var mousePosY = document.getElementById('mousePosY');
  if ((mousePosX != null) && ('undefined' != typeof (mousePosX))) {
    document.getElementById('mousePosX').value = mousePos.x;
  }
  if ((mousePosY != null) && ('undefined' != typeof (mousePosY))) {
    document.getElementById('mousePosY').value = mousePos.y;
  }
}

//设置鼠标获取位置的事件(双击)
document.ondblclick = mouseOndblclick;





