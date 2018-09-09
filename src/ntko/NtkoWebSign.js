/**
 * WebSign控件。
 * 使用方法：
 * var obj=new NtkoWebSign();
 * loadWebSign(targetId,attachmentId,espFileIdx,widthx,heightx);
 *  targetId： 文档容器id
 *  espFileIdx：附件id，如果指定那么根据该文件id加载签章。
 *
 *  saveRemote:保存文档到服务器
 *
 * @returns {OfficeControl}
 */
NtkoWebSign = function () {
  {
    var _self = this;
    this.user = {id: "0", name: "开发用户", groupId: "0", groupName: "开发部"};
    this.divId = "targetId";
    this.webSignId = "ntkoocx";
    this.webSignObj = null;
    this.espFileId = "";
    this.height = "0";    //隐藏
    this.width = "0";     //隐藏
    this.checkForm = "";
    this.configStyle = {user: {}, imgStyle: 'display: none;', buttonStyle: "display: none;"};
  }
  ;

  /**
   * 加载NTKO Web版电子印章控件
   * arg targetId 加载控件存放的目标Dom元素（Div）最好是唯一的。
   * arg attachmentId NTKO电子印章对象ID。如果不为空，加载对应的文件 最好是唯一的
   * espFileIdx 有没有对应的 NTKO电子印章文件(info文件)，加载时放入！espFileIdx唯一标识
   */
  this.loadWebSign = function (targetId, attachmentId, espFileIdx, conf) {
    this.divId = targetId;
    if ((attachmentId != "") && (attachmentId != null) && ('undefined' != typeof (attachmentId))) {
      this.webSignId = attachmentId;
    }
    this.espFileId = espFileIdx;
    this.configStyle = $.extend({}, this.configStyle, conf);
    this.user = conf.user;
    var cabPath = "./ntko/ntkoWebSign.cab";
    var tags = "";
    //图片 以后扩展有用...
    //	tags+='<div id="webSignImgSeal" style="'+this.configStyle.imgStyle+'" ><img id="webSignImg" name="webSignImg" src="" /></div>';
    //Web印章对象
    tags += '<div id="webSignSeal" style="display: block;">';
    tags += '<object id="' + this.webSignId + '" classid="clsid:DB5B521C-DA92-48e0-AE32-BDC944858D42"  codebase="' + cabPath + '"  ';
    tags += '  width="' + this.width + '" height="' + this.height + '">   ';
    tags += '<param name="BackColor" value="16744576">    ';
    tags += '<param name="ForeColor" value="16777215">    ';
      tags += '<param name="IsUseUTF8URL" value="-1">'
      tags += '<param name="IsUseUTF8Data" value="-1">'
      tags += '<param name="BorderStyle" value="1">'
      tags += '<param name="BorderColor" value="14402205">'
      tags += '<param name="TitlebarColor" value="15658734">'
      tags += '<param name="TitlebarTextColor" value="0">'
      tags += '<param name="MenubarColor" value="13158600">'
      tags += '<param name="MenuButtonColor" VALUE="16180947">'
      tags += '<param name="MenuBarStyle" value="3">'
      tags += '<param name="MenuButtonStyle" value="7">'
      tags += '<param name="WebUserName" value="NTKO">'
      tags += '<param name="UILangCode" value="AUTO">'
      tags += '<param name="Serverpage" value="paaa.asp">'
      tags += '<param name="Caption" value="测试">'
    tags += '<SPAN STYLE="color:red">不能装载NTKO WebSignHelper 控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>   ';
    tags += '</object>';
    tags += '</div> ';

    //用于默认要需要表单验证功能标记  （如果表单设计没有需要表单验证的字段(没有页面对象中没有validate="{'isWebSign':true}")时，这标签可以防止签单报错）
    tags += '<input type="hidden" id="isWebSignMark" name="isWebSignMark" lablename="验证功能标记" validate="{\'isWebSign\':true}" value="WebSignTrue" />';

    //用于获取鼠标的位置的对象
    tags += '<input type="hidden" id="mousePosX" name="mousePosX" value="50" />';
    tags += '<input type="hidden" id="mousePosY" name="mousePosY" value="50" />';

    //Web印章按钮的相关内容
    		tags+='<div id="webSignButtonSeal" style="'+this.configStyle.buttonStyle+'" >';
     tags+='<select name="webSignSelect" id="webSignSelect" value="0" onchange="webSignSelectEvent(\'webSignSelect\');" >';
     tags+='<option value="0" selected >Web印章选项</option>';
     tags+='<option value="1">手写批注无口令（自动）</option>';
     tags+='<option value="2">手写批注</option>';
     tags+='<option value="3">手写批注有口令（自动）</option>';
     tags+='<option value="4">输入批注</option>';
     tags+='<option value="5">本地签章</option>';
     tags+='<option value="6">URL签章</option>';
     tags+='<option value="7">Ekey签章</option>';
     tags+='<option value="8">保存签章</option>';
     tags+='<option value="9">清除签章</option>';
     tags+='<option value="10">服务器签章</option>';
     tags+='</select>';

     //用超链接
     tags+='<div class="group"><a class="link AddSecHandSignNoPrompt" onclick="AddSecHandSignNoPromptX()" >手写批注无口令（自动）</a></div>';
     tags+='<div class="group"><a class="link AddSecHandSign" onclick="AddSecHandSignX()" >手写批注</a></div>';
     tags+='<div class="group"><a class="link AddSecHandSignAdjust" onclick="AddSecHandSignAdjustX()" >手写批注有口令（自动）</a></div>';
     tags+='<div class="group"><a class="link AddSecKeyBoardComment" onclick="AddSecKeyBoardCommentX()" >输入批注</a></div>';
     tags+='<div class="group"><a class="link AddSecSignFromLocal" onclick="AddSecSignFromLocalX(true)" >本地签章</a></div>';
     tags+='<div class="group"><a class="link AddSecSignFromURL" onclick="AddSecSignFromURLX()" >URL签章</a></div>';
     tags+='<div class="group"><a class="link AddSecSignFromEkey" onclick="AddSecSignFromEkeyX()" >Ekey签章</a></div>';
     tags+='<div class="group"><a class="link SavePicAsTempFile" onclick="SavePicAsTempFileX(\'webSignImg\')" >签章保存为本地图片并清除临时文件</a></div>';
     tags+='<div class="group"><a class="link ClearAllSigns" onclick="ClearAllSignsX()" >清除签章</a></div>';
     tags+='<div class="group"><a class="link SaveToServer" onclick="SaveToServerX()" >保存签章</a></div>';

     tags+='</div>';

    document.getElementById("targetId").innerHTML = tags
    // $('#' + this.divId).html(tags);
    //	alert($('#'+this.divId).html());
    this.webSignObj = document.getElementById(this.webSignId);
    // if('undefined' == typeof (this.webSignObj.StatusCode)){
    // 	$.ligerDialog.warn("不能装载WEB印章控件，必须使用IE内核浏览器。可能需要在浏览器的Internet选项安全设置中修改ActiveX配置。",'提示信息',function(){
    // 		window.history.back();
    // 	});
    // 	return false;
    // }
    if ((this.espFileId != "") && (this.espFileId != null) && ('undefined' != typeof (this.espFileId))) {
      this.loadFileInfo();
    }
  };


  /**
   * 获取webSignObj，代表当前的电子印章对象
   */
  this.getntkoWebSignObj = function () {
    //	this.webSignObj.IsShowRect = false;
    return this.webSignObj;
  };


  //注意：以下四个方法是接管印章事件的内部方法。

  //NtkoReservedEvent_BeforeDoSecSign如果返回true,标识可以继续盖章，如果返回false，标识取消印章。
  //可以在这个函数中，调用Helper对象的DoWebExecute2方法查询服务器是否可以继续盖章并返回true或者false.
  this.NtkoReservedEvent_BeforeDoSecSign = function (UserName, SignName, SignUser, SignSN) {
    return true;
    //	alert("1NtkoReservedEvent_BeforeDoSecSign:UserName="+UserName+",SignName="+SignName+",SignUser="+SignUser+",SignSN="+SignSN);
    try {
      var retValue = this.webSignObj.DoWebExecute2("http://192.168.0.100/testchecksign/checksign.asp",
        "UserName=" + UserName + "&SignName=" + SignName + "&SignUser=" + SignUser + "&SignSN=" + SignSN);
      //	alert(retValue);
      return true;
    }
    catch (err) {
      alert("查询印章可用状态错误!" + err.number + ":" + err.description);
      return false;
    }
  };

  //NtkoReservedEvent_BeforeDoSecSignFromEkey如果返回true,标识可以继续盖章，如果返回false，标识取消印章。
  //可以在这个函数中，调用Helper对象的DoWebExecute2方法查询服务器是否可以继续盖章并返回true或者false.
  this.NtkoReservedEvent_BeforeDoSecSignFromEkey = function (UserName, SignName, SignUser, SignSN, EkeySN) {
    return true;
    //	alert("NtkoReservedEvent_BeforeDoSecSignFromEkey:UserName="+UserName+",SignName="+SignName+",SignUser="+SignUser+",SignSN="+SignSN+",EkeySN="+EkeySN);
    try {
      var retValue = this.webSignObj.DoWebExecute2("http://192.168.0.100/testchecksign/checksign.asp",
        "UserName=" + UserName + "&SignName=" + SignName + "&SignUser=" + SignUser + "&SignSN=" + SignSN + "&EkeySN=" + EkeySN);
      //	alert(retValue);
      return true;
    }
    catch (err) {
      alert("查询印章可用状态错误!" + err.number + ":" + err.description);
      return false;
    }
  };

  //该事件在印章被删除之后触发。
  this.NtkoReservedEvent_AfterSecSignDeleted = function (UserName, SignName, SignUser, SignSN, EkeySN, UserData) {
    //alert("3NtkoReservedEvent_AfterSecSignDeleted:UserName="+UserName+",SignName="+SignName+",SignUser="+SignUser+",SignSN="+SignSN+",EkeySN="+EkeySN+",UserData="+UserData);
  };

  //NtkoReservedEvent_BeforeSecSignCheckRight事件在印章需要验证权限之前被触发。
  /***************************************************************
   其中的SignType：印章类型.0标识印章.1标识手写签名,2标识键盘批注
   返回0,1,2.
   0:标识用户自定义权限验证成功,且不需要系统进一步验证。
   1:标识用户自定义权限验证失败，且不需要系统进一步验证。
   2:标识用户自定义权限不起作用，需要系统进一步验证（用自身方法）
   /***************************************************************/
  this.NtkoReservedEvent_BeforeSecSignCheckRight = function (UserName, SignName, SignUser, SignSN, EkeySN, SignType, UserData) {
    //	alert("BeforeSecSignCheckRight:UserName="+UserName+",SignName="+SignName+",SignUser="+SignUser+
    //		",SignSN="+SignSN+",EkeySN="+EkeySN+",SignType="+SignType+",UserData="+UserData);

    /***********************************************************************
     //以下可以通过调用Helper对象的DoWebExecute2方法查询服务器
     try
     {
             var retValue = ntkoobj.DoWebExecute2("http://192.168.0.100/testchecksign/checkright.asp",
                 "UserName="+UserName+"&SignName="+SignName+"&SignUser="+SignUser+"&SignSN="+SignSN+"&EkeySN="+EkeySN);
             alert(retValue);
             return 0; //0:标识用户自定义权限验证成功,且不需要系统进一步验证。
         }
     catch(err)
     {
             alert("查询印章权限错误!"+ err.number + ":" + err.description);
             return 1; //1:标识用户自定义权限验证失败，且不需要系统进一步验证。
         }
     *****************************************************************/

    return 2; //2:标识用户自定义权限不起作用，需要系统进一步验证（用自身方法）
  };


  /**
   * 增加有提示的手写WEB批注（没有自动对正大小）
   */
  this.AddSecHandSign = function () {
    var secSignObj = this.webSignObj.AddSecSignOcx("SecHandSignID", 20, 20);
    secSignObj.WebSignInfo = this.checkPrintForm();          //要Web签章验证的信息;
    secSignObj.HandSignPenColor = 14402205; // 此数值计算方式为：假设需要设定颜色值RGB,则value = (blue * 65536) + (green * 256) + red
    secSignObj.HandSignPenWidth = 5; //笔宽为5
    secSignObj.HandSignPenStyle = 0; //笔形为1
    //secSignObj.IsReadOnlyMode = true;
    this.webSignObj.AddSecHandSign(secSignObj, _self.user.name, 0, false, false, true, true, null, true);
  };


  /**
   * 增加没有提示的手写WEB批注（自动对正大小）
   */
  this.AddSecHandSignNoPrompt = function () {
    var strxy = this.getXy();
    if (strxy != "" && (strxy.split("&").length == 2)) {
      var arrys = strxy.split("&");
      var secSignObj = this.webSignObj.AddSecSignOcx("SecHandSignID", arrys[0], arrys[1]);
      if (secSignObj) {
        secSignObj.WebSignInfo = this.checkPrintForm();          //要Web签章验证的信息;
        //	secSignObj.HandSignPenColor = 0; // 此数值计算方式为：假设需要设定颜色值RGB,则value = (blue * 65536) + (green * 256) + red
        secSignObj.HandSignPenWidth = 3; //笔宽为5
        secSignObj.HandSignPenStyle = 0; //笔形为1
        secSignObj.UserData = "my user data";
        this.webSignObj.AddSecHandSign(secSignObj, _self.user.name, 2, false, false, true, false, null, false, 80);
      }
    }
  };

  /**
   * 增加有提示的手写WEB批注（自动对正大小）
   */
  this.AddSecHandSignAdjust = function () {
    var secSignObj = this.webSignObj.AddSecSignOcx("SecHandSignID", 20, 20);
    secSignObj.WebSignInfo = this.checkPrintForm();          //要Web签章验证的信息;
    this.webSignObj.AddSecHandSign(secSignObj, _self.user.name, 0, false, false, true, true, null, true, 50);
  };

  /**
   * 增加输入WEB批注（自动对正大小）
   */
  this.AddSecKeyBoardComment = function () {
    var secSignObj = this.webSignObj.AddSecSignOcx("SecKeyBoardCommentID", 20, 20);
    secSignObj.WebSignInfo = this.checkPrintForm();          //要Web签章验证的信息;
    this.webSignObj.AddSecKeyBoardComment(secSignObj, _self.user.name, 0, false, false, true, false);
  };

  /**
   * 输入有提示的本地WEB签章批注
   */
  this.AddSecSignFromLocal = function (isAddComment) {
    var secSignObj = this.webSignObj.AddSecSignOcx("SecSignFromLocalID", 20, 20);
    secSignObj.WebSignInfo = this.checkPrintForm();          //要Web签章验证的信息;
    this.webSignObj.AddSecSignFromLocal(secSignObj, _self.user.name, '', true, 1, false, false, true, true, null, isAddComment);
  };

  /**
   * 输入有提示的远程（URL）WEB签章批注
   */
  this.AddSecSignFromURL = function () {
    var secSignObj = this.webSignObj.AddSecSignOcx("SecSignFromURLID", 20, 20);
    secSignObj.WebSignInfo = this.checkPrintForm();          //要Web签章验证的信息;
    //secSignObj.PositionTagId = "JiaFanSpan";//定义印章加盖的位置 JiaFanSpan 一般为DIV
    this.webSignObj.AddSecSignFromURL(secSignObj, _self.user.name,
      'http://www.ntko.com/admin/ocv14_test.nsf/vwSigns/2C0B608DD5844CA848256E46000A4C3D/$file/zhang_hetong.gif.esp?openelement',
      2, false, false, true, false, "11111111", false);
  };


  /**
   * 从服务器中选印章对表单进行签章
   */
  this.AddSecSignFromService = function () {
    var strxy = this.getXy();
    if (strxy != "" && (strxy.split("&").length == 2)) {
      var arrys = strxy.split("&");
      //	alert("X:"+arrys[0]+"   Y:"+arrys[1]);
      var url = __ctx + "/platform/system/seal/dialog.ht";
      var winArgs = "dialogWidth=800px;dialogHeight=600px;help=0;status=0;scroll=1;center=0;resizable=1;";
      url = url.getNewUrl();
      //var retVal = window.showModalDialog(url, "", winArgs);

      /*if(typeof(retVal)==undefined){
       return false;
       }
       if(retVal.fileId.isEmpty()){
       return false;
       }
       var signUrl=__ctx + "/platform/system/sysFile/getFileById.ht?fileId=" + retVal.fileId;
       try{
       var secSignObj = this.webSignObj.AddSecSignOcx("SecSignFromURLID",arrys[0],arrys[1]);
       secSignObj.WebSignInfo = this.checkPrintForm();          //要Web签章验证的信息;
       //secSignObj.PositionTagId = "JiaFanSpan";//定义印章加盖的位置 JiaFanSpan 一般为DIV
       this.webSignObj.AddSecSignFromURL(secSignObj,_self.user.name,signUrl,2,false,false,true,false,"",false);
       }catch(err){
       alert("AddSecSignFromService:" +err.name + ": " + err.message);
       return -1;
       }*/

      var that = this;
      /*KILLDIALOG*/
      DialogUtil.open({
        height: 600,
        width: 800,
        title: '签章',
        url: url,
        //自定义参数
        sucCall: function (retVal) {
          if (typeof(retVal) == undefined) {
            return;
          }
          if (retVal.fileId.isEmpty()) {
            return;
          }
          var signUrl = __ctx + "/platform/system/sysFile/getFileById.ht?fileId=" + retVal.fileId;
          try {
            var secSignObj = that.webSignObj.AddSecSignOcx("SecSignFromURLID", arrys[0], arrys[1]);
            secSignObj.WebSignInfo = that.checkPrintForm();          //要Web签章验证的信息;
            //secSignObj.PositionTagId = "JiaFanSpan";//定义印章加盖的位置 JiaFanSpan 一般为DIV
            that.webSignObj.AddSecSignFromURL(secSignObj, _self.user.name, signUrl, 2, false, false, true, false, "", false);
          } catch (err) {
            alert("AddSecSignFromService:" + err.name + ": " + err.message);
            return -1;
          }
        }
      });
    }
  };


  /**
   * 输入有提示的Ekey硬件WEB签章批注
   */
  this.AddSecSignFromEkey = function () {
    if (this.webSignObj != null) {
      /*if(!this.webSignObj.IsEkeyConnected)
       {
       alert("没有检测到EKEY.请将EKEY插入到计算机!然后点击确定继续.");
       return false;
       }*/
      var secSignObj = this.webSignObj.AddSecSignOcx("SecSignFromEkeyID", 20, 20);
      secSignObj.WebSignInfo = this.checkPrintForm();          //要Web签章验证的信息;
      this.webSignObj.AddSecSignFromEkey(secSignObj, _self.user.name, 2, false, false, true, true);
    }
  };

  /**
   * 输入有提示的Ekey硬件WEB签章批注
   */
  this.AddSecSignFromEkeyWithSignIndex = function () {
    if (this.webSignObj != null) {
      /*if(!this.webSignObj.IsEkeyConnected)
       {
       alert("没有检测到EKEY.请将EKEY插入到计算机!然后点击确定继续.");
       return false;
       }*/
      var secSignObj = this.webSignObj.AddSecSignOcx("SecSignFromEkeyID", 20, 20);
      secSignObj.WebSignInfo = this.checkPrintForm();          //要Web签章验证的信息;
      this.webSignObj.AddSecSignFromEkey(secSignObj, _self.user.name, 2, false, false, true, true, null, true, 1/*SignIndex*/);
    }
  };

  /**
   * 获取所有签章的相关信息
   */
  this.ShowSignsInfo = function () {
    var objs = document.getElementsByTagName("object");
    for (var i = 0; i < objs.length; i++) {
      var obj = objs(i);
      if (obj.classid == "clsid:AA4B3728-B61C-4bcc-AEE7-0AA47D3C0DDA") {
        var info = "";
        info += "SignName=" + obj.SignName;
        info += ",Signer=" + obj.Signer;
        info += ",SignUser=" + obj.SignUser;
        info += ",SignSource=" + obj.SignSource;
        info += ",SignTime=" + obj.SignTime;
        info += ",SignSN=" + obj.SignSN;
        info += ",EkeySN=" + obj.EkeySN;
        info += ",PrintMode=" + obj.PrintMode;
        alert(info);
      }
    }
  };

  /**
   * 清除所有印章
   */
  this.ClearAllSigns = function () //清除所有印章
  {
    var objs = document.getElementsByTagName("object");
    for (var i = objs.length - 1; i >= 0; i--) {
      var obj = objs(i);
      if (obj.classid == "clsid:AA4B3728-B61C-4bcc-AEE7-0AA47D3C0DDA") {
        obj.Close();
        obj.removeNode();
      }
    }
  };

  /**
   * 是否支持印章对象对表单验证
   */
  this.AllCheckDocChange = function (mark) {
    var objs = document.getElementsByTagName("object");
    for (var i = 0; i < objs.length; i++) {
      var obj = objs(i);
      if (obj.classid == "clsid:AA4B3728-B61C-4bcc-AEE7-0AA47D3C0DDA") {
        obj.CheckDocChange(mark);
      }
    }
  };

  /**
   * 保存为本地图片并清除临时文件
   */
  this.SavePicAsTempFile = function (imgDivid) {
    var objs = document.getElementsByTagName("object");
    var signscount = 0;
    for (var i = 0; i < objs.length; i++) {
      var obj = objs(i);
      if (obj.classid == "clsid:AA4B3728-B61C-4bcc-AEE7-0AA47D3C0DDA") //找到一个印章
      {
        signscount++;
        var tempName = obj.SavePicAsTempFile();
        alert("第" + signscount + "个章的临时文件:" + tempName);
        document.getElementById(imgDivid).src = "";
        document.getElementById(imgDivid).src = tempName;
        //	document.all("tmpimg").src = "";
        //	document.all("tmpimg").src = tempName;
        alert(document.getElementById(imgDivid).src);
        //	alert("准备删除第"+signscount+"个章的临时文件");
        document.getElementById(imgDivid).style.display = 'block';
        obj.ClearTempFile();
      }
    }
  };

  /**
   * 设定所有印章只读
   */
  this.setAllsignsReadOnlyMode = function (isReadOnlyMode) {
    var objs = document.getElementsByTagName("object");
    for (var i = 0; i < objs.length; i++) {
      var obj = objs(i);
      if (obj.classid == "clsid:AA4B3728-B61C-4bcc-AEE7-0AA47D3C0DDA") {
        obj.IsReadOnlyMode = isReadOnlyMode;
      }
    }
  };

  /**
   * 获取要检验的表单数据
   */
  this.checkPrintForm = function () {
    var aryInput = $("input:text,input:hidden,textarea,select");
//		var aryInput = $("input:text,input:hidden,textarea,select,input:checkbox,input:radio,span");
    this.checkForm = '';
    for (var i = 0, len = aryInput.length; i < len; i++) {
      var tmp = aryInput.get(i);
      //	var validRule = tmp.validate;  //获取自定义属性时，IE8或以下才可以用，IE8以上的都不能稳定获取！
      var validRule = tmp.getAttribute("validate");   //获取自定义属性IE7、8、9通用
      if (validRule != null && validRule != '' && 'undefined' != validRule.toLowerCase()) {
        var json = eval('(' + validRule + ')');
        if (json.isWebSign) {
          var name = tmp.getAttribute("lablename");   //字段说明名称
          if ((name == "") || (name == null) || ('undefined' == typeof(name))) {
            var arrys = (tmp.name).split(":");   //tmp.name 固定属性IE7、8、9都可以获取！
            name = arrys[arrys.length - 1];
          }
          this.checkForm += name + '=' + tmp.getAttribute("name") + ';'
        }
      }
    }
    if (this.checkForm.length > 0) {
      this.checkForm = this.checkForm.substr(0, this.checkForm.length - 1)   //去年最后一个字符
    }
    return this.checkForm;
  };


  /**
   * 保存签章相关信息
   */
  this.SaveToServer = function (power) {
    if (power == "w" || right == "b") {
      var path = __ctx + "/platform/system/sysFile/saveFileInfo.ht";
      var uploadName = this.webSignId + "_pdf"
      var params = "fileId=" + this.espFileId + "&uploadName=" + uploadName;
      var curDate = new Date();
      var espName = Math.random() * curDate.getMilliseconds() * 10000;
      //保存数据到服务器。
      var retstr = this.webSignObj.SaveToURL(path, uploadName, params, espName + ".info", 0);
      if (retstr != "" && ('undefined' != typeof (retstr)) && retstr > 0) {
        this.espFileId = retstr;
        return retstr;
      } else {
        return "";
      }
    }
  };

  /**
   * 加载签章相关信息
   */
  this.loadFileInfo = function () {
    if ((this.espFileId != "") && (this.espFileId != null) && ('undefined' != typeof (this.espFileId))) {
      var path = __ctx + "/platform/system/sysFile/getFileById.ht?fileId=" + this.espFileId;
      this.webSignObj.LoadFromURL(path);
      if (0 != this.webSignObj.StatusCode) {
        return false;
      }
    }
  };


  /**
   * 鼠标获取位置
   */
  this.getXy = function () {
    var mousePosX = document.getElementById('mousePosX').value;
    var mousePosY = document.getElementById('mousePosY').value;
    var str = mousePosX + "&" + mousePosY;
    document.getElementById('mousePosX').value = '50';
    document.getElementById('mousePosY').value = '50';
    if (mousePosX == '50' && mousePosY == '50') {
      if (confirm("当前签章将保存位置:横坐标(" + mousePosX + "px),纵坐标(" + mousePosY + "px)!确认不需要更改吗?")) {
        return str;
      } else {
        alert("请通过双击鼠标左键确定将选择的印章位置,再进行签章!");
        return "";
      }
    } else {
      return str;
    }
  };


};



