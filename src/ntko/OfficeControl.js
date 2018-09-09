/**
 * office控件。
 * 使用方法：
 * var obj=new OfficeControl();
 * obj.renderTo("divContainer",{fileId:123});
 *  divContainer： 文档容器id
 *  fileId：附件id，如果指定那么根据该文件id加载word文档。
 *
 *  saveRemote:保存文档到服务器
 *
 * @returns {OfficeControl}
 */
var FJRight = "";
var DY = ""; // 附件打印权限
var LCW = ""; // 附件另存为权限
var editPower = ""; // 编辑权限
var qsPower = "";  // 签收
OfficeControl = function () {
  {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : (s = ua
      .match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : (s = ua
      .match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : (s = ua
      .match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : (s = ua
      .match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    this.controlId = "";
    this.controlObj = null;
    this.height = "90%";
    this.width = "100%";
    var _self = this;
    this.isFileOpen = false;
    this.start = false;//是否新启动
    this.templatetype = 1;// 模板类型
    //这里发布给客户时，可以修改ProductCaption，ProductKey值。
    this.params = {
      Caption: "",
      MakerCaption: "中信网络科技股份有限公司",
      MakerKey: "B32197AD7DD79F179348C7CC24EB03A478237FEE",
      ProductCaption: "重庆农村商业银行股份有限公司",
      ProductKey: "5256389FB9310488D64D97242B58BE1EC6832C81",
      TitlebarColor: "14402205",
      IsCheckEkey: "0",
      IsUseUTF8URL: "-1",
      IsUseUTF8Data: "-1",
      BorderStyle: "1",
      BorderColor: "14402205",
      TitlebarTextColor: "0",
      MenubarColor: "14402205",
      MenuButtonColor: "16180947",
      MenuBarStyle: "3",
      ToolBars: "1",
      Menubar: '1',
      MenuButtonStyle: "7"
    };
    this.config = {doctype: 'doc', fileId: "", controlId: "officeObj", myNum: '0', right: 'w', user: {}, menuRight: ''};
  }
  ;
  /**
   * 处理文件菜单事件。
   */
  this.itemclick = function (item) {
    var txt = item.text;
    switch (txt) {
      case "新建":
        _self.newDoc();
        break;
      case "打开":
        _self.controlObj.showDialog(1);
        break;
      case "另存为":
        if (!_self.isFileOpen) return;
        _self.controlObj.showDialog(3);
        break;
      case "关闭":
        if (!_self.isFileOpen) return;
        _self.closeDoc();
        break;
      case "打印设置":
        if (!_self.isFileOpen) return;
        _self.controlObj.showdialog(5);
        break;
      case "打印预览":
        if (!_self.isFileOpen) return;
        _self.controlObj.PrintPreview();
        break;
      case "打印":
        if (!_self.isFileOpen) return;
        _self.controlObj.printout(true);
        break;
    }

  },
    /**
     * 获取文档类型。
     */
    this.getDocType = function () {
      var docType = "Word.Document";
      var type = this.config.doctype;
      switch (type) {
        case "doc":
          docType = "Word.Document";
          break;
        case "xls":
          docType = "Excel.Sheet";
          break;
        case "ppt":
          docType = "PowerPoint.Show";
          break;
      }
      return docType;
    },
    //click事件需要事先进行定义。
    this.memuItems = {
      width: 120, items: [{text: '新建', click: this.itemclick},
        {text: '打开', click: this.itemclick},
        {text: '另存为', click: this.itemclick},
        {text: '关闭', click: this.itemclick},
        {line: true},
        {text: '打印设置', click: this.itemclick},
        {text: '打印预览', click: this.itemclick},
        {text: '打印', click: this.itemclick}]
    };
  /**
   * 处理菜单点击事件。
   */
  this.buttonClick = function (item) {

    var txt = item.text;
    switch (txt) {
      case "显示痕迹":
        _self.isShowmark(true);
        break;
      case "隐藏痕迹":
        _self.isShowmark(false);
        break;
      case "合并正文":
        if (!confirm("合并正文后所有痕迹信息都将丢失，建议在合并之前保存副本"))return;
        _self.controlObj.ActiveDocument.AcceptAllRevisions();
        break;
      case "套红头":
        _self.insertContentTemplate();
        break;
      case "选择模版":
        _self.insertTemplate();
        break;
      case "手写签名":
        _self.insertHandSign();
        break;
      case "电子盖章":
        _self.signature();
        break;
      case "全屏":
        _self.controlObj.FullScreenMode = true;
        break;
      case "转成PDF":
        _self.officeToPdf();
        break;
      case "Ekey盖章":
        _self.signatureFromEkey();
        break;
      case "PDF盖章":
        _self.signaturePdfFromEkey();
        break;
      case "保存":
        OfficePlugin.submit(function () {
          alert("保存成功！");
        });
        break;
      case "保存并退出":
        OfficePlugin.submit(function () {
          alert("保存成功！");
          window.close();
        });
        break;
      case "保存副本":
        _self.saveFuBenRemote();
        break;
      case "下载副本":
        _self.downloadZwFuBen();
        break;
      case "关闭窗口":
        _self.closeDoc();
        break;
      case "锁定文档":
        _self.protectDoc();
        break;
      case "文档解锁":
        _self.unProtectDoc();
        break;
    }
  },
    /**
     * 是否显示痕迹
     */
    this.isShowmark = function (isShow) {
      _self.controlObj.ActiveDocument.Application.ActiveWindow.View.ShowRevisionsAndComments = isShow;
      _self.controlObj.ActiveDocument.Application.ActiveWindow.View.RevisionsView = 0;
    }
  //进入或退出痕迹保留状态，调用下面的两个函数
  this.setMarkModify = function (boolvalue) {
    this.setReviewMode(!boolvalue);
    this.enableReviewBar(boolvalue);
  }
  //允许或禁止显示修订工具栏和工具菜单（保护修订）
  this.enableReviewBar = function (boolvalue) {
    _self.controlObj.ActiveDocument.CommandBars("Reviewing").Enabled = boolvalue;
    _self.controlObj.ActiveDocument.CommandBars("Track Changes").Enabled = boolvalue;
    _self.controlObj.IsShowToolMenu = boolvalue; //关闭或打开工具菜单
  }
  //打开或者关闭修订模式
  this.setReviewMode = function (boolvalue) {
    try {
      _self.controlObj.ActiveDocument.TrackRevisions = boolvalue;
    } catch (err) {

    }
  }
  /**
   * 手写签名
   */
  this.insertHandSign = function () {
    try {
      _self.controlObj.DoHandSign2(
        _self.config.user.name,//手写签名用户名称
        "ntko",//signkey,DoCheckSign(检查印章函数)需要的验证密钥。
        0,//left
        0,//top
        0,//relative,设定签名位置的参照对象.0：表示按照屏幕位置插入，此时，Left,Top属性不起作用。1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落（为兼容以前版本默认方式）
        100);
    } catch (err) {
      alert("insertHandSign:" + err.name + ": " + err.message);
    }
  },
    /**
     * 可以设置文件用户
     */
    this.setDocUser = function () {
      with (_self.controlObj.ActiveDocument.Application) {
        UserName = _self.config.user.name;//设置用户信息
        if (_self.config.user.name.length > 6) {
          UserInitials = _self.config.user.name.substring(0, 5);
        } else {
          UserInitials = _self.config.user.name;//设置用户信息缩写
        }
      }
    },
    /**
     * 获取模版
     */
    this.getTemplate = function (callback) {
      var url = __ctx + "/platform/system/sysOfficeTemplate/dialog.ht?type=" + this.templatetype;
      var winArgs = "dialogWidth=600px;dialogHeight=400px;help=0;status=0;scroll=1;center=1";
      url = url.getNewUrl();
      DialogUtil.open({
        height: 630,
        width: 620,
        title: '获取模版',
        url: url,
        isResize: true,
        sucCall: callback
      });

    },
    /**
     * 模版套红。
     */
    this.insertContentTemplate = function () {
      try {
        var result = _self.saveRemote(0);
        if (result < 0) {
          alert("保存正文失败");
        }
        this.templatetype = 2;
        _self.getTemplate(function (rtn) {
          this.templatetype = 1;
          if (rtn == undefined || rtn == null) {
            return false;
          }
          var templateUrl = __ctx + "/platform/system/sysOfficeTemplate/getTemplateById.ht?templateId=" + rtn.templateId;
          var path = __ctx + "/platform/system/sysFile/getFileById.ht?fileId=" + _self.config.fileId;
          try {
            _self.controlObj.OpenFromURL(templateUrl);
            var curSel = _self.controlObj.ActiveDocument.Application.Selection;
            var searchStr = "[正文]"; //在文档中要查找的文字，如"name"
            curSel.Find.ClearFormatting();
            curSel.Find.text = searchStr;
            curSel.Find.Execute(searchStr);//
            _self.controlObj.AddTemplateFromURL(path);
            _self.setBookMark();
          }
          catch (err) {
            try {
              _self.controlObj.OpenFromURL(templateUrl);
              var curSel = _self.controlObj.ActiveDocument.Application.Selection;
              var searchStr = "[正文]"; //在文档中要查找的文字，如"name"
              curSel.Find.ClearFormatting();
              curSel.Find.text = searchStr;
              curSel.Find.Execute(searchStr);//
              _self.controlObj.AddTemplateFromURL(path);
              _self.setBookMark();
            }
            catch (err) {
              _self.newDoc();
            }
          }
        });
      } catch (err) {
        alert("insertTemplate:" + err.name + ": " + err.message);
      }
    },
    /**
     * 插入word模版。
     */
    this.insertTemplate = function () {
      try {
        _self.getTemplate(function (rtn) {
          if (rtn == undefined || rtn == null) {
            return;
          }
          var headFileURL = __ctx + "/platform/system/sysOfficeTemplate/getTemplateById.ht?templateId=" + rtn.templateId;
          //_self.controlObj.ActiveDocument.Application.Selection.HomeKey(6,0);//光标移动到文档开头
          _self.controlObj.OpenFromURL(headFileURL);//在光标位置插入红头文档
        });
      } catch (err) {
        //$.ligerDialog.error("insertTemplate:" +err.name + ": " + err.message);
        alert("insertTemplate:" + err.name + ": " + err.message);
      }
    },
    /**
     * 获取控件的html。
     */
    this.getControlHtml = function (controlId) {
      var cabPath = __ctx + "/media/office/OfficeControl_back.cab#version=5,0,2,1";
      var classid = "C9BC4DFF-4248-4a3c-8A49-63A7D317F404";
      var str = '';
      if (Sys.ie) {
        str = '<object  id="' + controlId + '" codeBase="' + cabPath + '" height="' + this.height + '" width="' + this.width + '" classid="clsid:' + classid + '" style="z-index:-1;">';
        for (var key in this.params) {
          str += '  <param name="' + key + '" value="' + this.params[key] + '">  ';
        }
        str += "</object>";
      } else if (Sys.firefox || Sys.chrome) {
        if (this.config.doctype == 'pdf') {
          str = '<object id="' + controlId + '" codeBase="' + cabPath + '" height="' + this.height + '" width="' + this.width + '"  type="application/ntko-plug" ForOnSaveToURL="saveMethodOnComplete" ForOndocumentopened="documentOpenedOnComplete' + this.config.myNum + '" ForOnAddTemplateFromURL="addTemplateOnComplete' + this.config.myNum + '" ';
        } else {
          str = '<object id="' + controlId + '" codeBase="' + cabPath + '" height="' + this.height + '" width="' + this.width + '"  type="application/ntko-plug" ForOnSaveAsOtherFormatToURL="saveMethodOnComplete" ForOndocumentopened="documentOpenedOnComplete' + this.config.myNum + '" ForOnAddTemplateFromURL="addTemplateOnComplete' + this.config.myNum + '" ';
        }
        for (var key in this.params) {
          str += '_' + key + '="' + this.params[key] + '"	';
        }
        str += 'clsid="{' + classid + '}" >';
        str += '</object>  ';
      }
      //是火狐和谷歌时 增加插入套红模版和只读设置的回调函数
      if (Sys.firefox || Sys.chrome) {
        str += ' <script type="text/javascript" > ';
        str += '		function addTemplateOnComplete' + this.config.myNum + '(){ ';
        str += '			addTemplateOnComplete("' + this.config.myNum + '"); ';
        str += '		} ';
        str += '	                 ';
        str += '		function documentOpenedOnComplete' + this.config.myNum + '(){ ';
        str += '			documentOpenedOnComplete("' + this.config.myNum + '"); ';
        str += '		} ';
        str += ' </script> ';
      }
      str += '<script language="JScript" for=' + controlId + '  event="OnDocumentOpened(str,obj)">';
      str += '		documentOpened();';
      str += ' </script> ';
      return str;
    },
    /**
     * 将控件添加到div容器中。
     * 第一个参数：
     * div的容器ID
     * 第二个参数:
     * conf:
     * doctype:文挡类型：可以为doc，xls，ppt
     * fileId:服务器保存的文件ID
     */
    this.renderTo = function (divContainerId, conf) {
      FJRight = conf.FJRight;
      DY = conf.DY;
      LCW = conf.LCW;
      editPower = conf.editRight;
      qsPower = conf.qsRight;
      employeeId = conf.employeeId;
      //alert("employeeId"+employeeId);
      this.config = $.extend({}, this.config, conf);
      //格式为空时默认设置为doc文件
      if (!this.config.doctype) {
        this.config.doctype = "doc";
      }
      if (!(Sys.firefox) && !(Sys.chrome)) {
        Sys.ie = true;
      }
      this.controlId = "office_" + divContainerId;
      //var html=this.getControlHtml(this.controlId);
      var menuBar = '<div name="menuBar" menuBarRight="w" ></div>';
      //$("#" +divContainerId).html("");
      if (this.config.right == 'r') {
        menuBar = '<div name="menuBar" style="display:none;" menuBarRight="r" ></div>';
      }
      //$("#office_menuBar").html(menuBar);
      $("#office_div0").html("");
      $("#office_div0").append(menuBar);
      var obj = document.getElementById(this.controlId);
      this.controlObj = obj;
      this.controlObj.MenuBar = true;
      this.controlObj.Titlebar = false;
      this.controlObj.ToolBars = true;
      var jqControlObj = $(this.controlObj);
      //修改控件的高度。
      //jqControlObj.height(jqControlObj.parent().height()+20);
      var docType = this.config.doctype;
      var menuRight = this.config.menuRight;
      var items = [];
      //2013-05-31 add
      if (docType == "pdf") {
        if (menuRight.pdfgzRight == 'y') {
          items.push({text: 'PDF盖章', click: this.buttonClick});
        }
      } else {
        if (menuRight.wjRight == 'y') {
          this.controlObj.MenuBar = true;
          this.controlObj.EnableFileCommand(0) = (menuRight.newRight == "y");
          this.controlObj.FileOpen = (menuRight.openRight == "y");
          this.controlObj.EnableFileCommand(2) = false;//关闭
          this.controlObj.FileSave = (menuRight.saveLocalRight == "y");

          if (FJRight == 'y') {
            if (DY == "y") {
              this.controlObj.FilePrint = true;
            } else {
              this.controlObj.FilePrint = false;
            }
            if (LCW == "y") {
              this.controlObj.FileSaveAs = true;
            } else {
              this.controlObj.FileSaveAs = false;
            }

          } else {
            this.controlObj.FileSaveAs = (menuRight.saveLocalRight == "y");
            this.controlObj.FilePrint = (menuRight.printRight == "y");
          }
        } else {
          this.controlObj.MenuBar = false;
          this.controlObj.ToolBars = false;
        }
        if (menuRight.saveRight == 'y') {
          items.push({text: '保存', click: this.buttonClick});
          items.push({text: '保存并退出', click: this.buttonClick});
        }
        if (docType == "doc") {
          if (menuRight.lhRight == 'y') {
            items.push({text: '显示痕迹', click: this.buttonClick});
          }
          if (menuRight.blhRight == 'y') {
            items.push({text: '隐藏痕迹', click: this.buttonClick});
          }
          if (menuRight.qchjRight == 'y') {
            items.push({text: '合并正文', click: this.buttonClick});
          }
        }
        if (menuRight.mbthRight == 'y') {
          items.push({text: '套红头', click: this.buttonClick});
        }
        if (menuRight.protectRight == 'y') {
          items.push({text: '锁定文档', click: this.buttonClick});
        }
        if (menuRight.unProtectRight == 'y') {
          items.push({text: '文档解锁', click: this.buttonClick});
        }

        if (menuRight.bcfbRight == 'y') {
          items.push({text: '保存副本', click: this.buttonClick});
        }
        if (menuRight.xzfbRight == 'y') {
          items.push({text: '下载副本', click: this.buttonClick});
        }
        if (menuRight.xzmbRight == 'y') {
          items.push({text: '选择模版', click: this.buttonClick});
        }
        if (menuRight.sxqmRight == 'y') {
          items.push({text: '手写签名', click: this.buttonClick});
        }
        if (menuRight.gzRight == 'y') {
          items.push({text: '电子盖章', click: this.buttonClick});
        }
        if (menuRight.zcpdfRight == 'y') {
          items.push({text: '转成PDF', click: this.buttonClick});
        }
        if (menuRight.ekeygzRight == 'y') {
          items.push({text: 'Ekey盖章', click: this.buttonClick});
        }
      }
      if (menuRight.qpRight == 'y') {
        items.push({text: '全屏', click: this.buttonClick});
      }
      items.push({text: '关闭窗口', click: this.buttonClick});
      if ($("#" + divContainerId + " div[name='menuBar']").ligerMenuBar) {//明细页面不需要
        $("#" + divContainerId + " div[name='menuBar']").ligerMenuBar({items: items});
      }
      if (Sys.ie || Sys.firefox || Sys.chrome) {
        if (docType == "pdf") {
          this.addPDFSupport();
          this.isFileOpen = true;
        } else {
          if ((this.config.right != 'w' && this.config.right != 'b') || editPower == 'n' || this.config.menuRight.notEditRight == 'y') {
            //打开文档，加水印
            this.initDocAddWaterMark(employeeId);
          } else {
            //直接打开文档
            this.initDoc();
          }


        }
      }
      else {
        alert('office控件只支持IE、Firefox和Chrome 32位版的浏览器!');
      }
      if (menuRight.bcfbRight == 'y') {
        var fileObjs = $("input[controltype='office']", window.opener.document);
        for (var i = 0; i < fileObjs.length; i++) {
          var fileObj = fileObjs.get(i);
          var zwfileId = fileObj.getAttribute("value");
          if (zwfileId != null && zwfileId != "") {
            var objs = $("input[lablename='正文副本']", window.opener.document);
            var fileId = "";
            if (objs.length > 0) {
              fileId = objs[0].value;
              if (fileId == "") {
                this.saveFuBenRemote();
              }
            }
          }

        }
      }
    };

  this.TANGER_OCX_AddWaterMark = function (obj, text) {
    //添加水印功能
    var app_1 = obj.activeDocument.Application; //obj是控件对象
    //第一个水印
    obj.ActiveDocument.Sections(1).Range.Select();
    app_1.ActiveWindow.ActivePane.View.SeekView = 9;
    app_1.Selection.HeaderFooter.Shapes.AddTextEffect(0, text, "宋体", 1, false, false, 0, 0).Select();
    app_1.Selection.ShapeRange.Name = "PowerPlusWaterMarkObject1";
    app_1.Selection.ShapeRange.TextEffect.NormalizedHeight = false;
    app_1.Selection.ShapeRange.Line.Visible = false;
    app_1.Selection.ShapeRange.Fill.Visible = true;
    app_1.Selection.ShapeRange.Fill.Solid();
    app_1.Selection.ShapeRange.Fill.ForeColor.RGB = 12345;
    app_1.Selection.ShapeRange.Fill.Transparency = 0.5;
    app_1.Selection.ShapeRange.Rotation = 315;
    app_1.Selection.ShapeRange.LockAspectRatio = true;
    app_1.Selection.ShapeRange.Height = app_1.CentimetersToPoints(3.5);
    app_1.Selection.ShapeRange.Width = app_1.CentimetersToPoints(3.5);
    app_1.Selection.ShapeRange.WrapFormat.AllowOverlap = true;
    app_1.Selection.ShapeRange.WrapFormat.Side = 3;
    app_1.Selection.ShapeRange.WrapFormat.Type = 3;
    app_1.Selection.ShapeRange.RelativeHorizontalPosition = 0;
    app_1.Selection.ShapeRange.RelativeVerticalPosition = 0;
    app_1.Selection.ShapeRange.Left = 20;
    app_1.Selection.ShapeRange.Top = 100;
    app_1.ActiveWindow.ActivePane.View.SeekView = 0;

    //第二个水印
    obj.ActiveDocument.Sections(1).Range.Select();
    app_1.ActiveWindow.ActivePane.View.SeekView = 9;
    app_1.Selection.HeaderFooter.Shapes.AddTextEffect(0, text + "             " + text, "宋体", 1, false, false, 0, 0).Select();
    app_1.Selection.ShapeRange.Name = "PowerPlusWaterMarkObject2";
    app_1.Selection.ShapeRange.TextEffect.NormalizedHeight = false;
    app_1.Selection.ShapeRange.Line.Visible = false;
    app_1.Selection.ShapeRange.Fill.Visible = true;
    app_1.Selection.ShapeRange.Fill.Solid();
    app_1.Selection.ShapeRange.Fill.ForeColor.RGB = 12345;
    app_1.Selection.ShapeRange.Fill.Transparency = 0.5;
    app_1.Selection.ShapeRange.Rotation = 315;
    app_1.Selection.ShapeRange.LockAspectRatio = true;
    app_1.Selection.ShapeRange.Height = app_1.CentimetersToPoints(3.5);
    app_1.Selection.ShapeRange.Width = app_1.CentimetersToPoints(9);
    app_1.Selection.ShapeRange.WrapFormat.AllowOverlap = true;
    app_1.Selection.ShapeRange.WrapFormat.Side = 3;
    app_1.Selection.ShapeRange.WrapFormat.Type = 3;
    app_1.Selection.ShapeRange.RelativeHorizontalPosition = 0;
    app_1.Selection.ShapeRange.RelativeVerticalPosition = 0;
    app_1.Selection.ShapeRange.Left = 50;
    app_1.Selection.ShapeRange.Top = 350;
    app_1.ActiveWindow.ActivePane.View.SeekView = 0;

    //第三个水印
    obj.ActiveDocument.Sections(1).Range.Select();
    app_1.ActiveWindow.ActivePane.View.SeekView = 9;
    app_1.Selection.HeaderFooter.Shapes.AddTextEffect(0, text, "宋体", 1, false, false, 0, 0).Select();
    app_1.Selection.ShapeRange.Name = "PowerPlusWaterMarkObject3";
    app_1.Selection.ShapeRange.TextEffect.NormalizedHeight = false;
    app_1.Selection.ShapeRange.Line.Visible = false;
    app_1.Selection.ShapeRange.Fill.Visible = true;
    app_1.Selection.ShapeRange.Fill.Solid();
    app_1.Selection.ShapeRange.Fill.ForeColor.RGB = 12345;
    app_1.Selection.ShapeRange.Fill.Transparency = 0.5;
    app_1.Selection.ShapeRange.Rotation = 315;
    app_1.Selection.ShapeRange.LockAspectRatio = true;
    app_1.Selection.ShapeRange.Height = app_1.CentimetersToPoints(3.5);
    app_1.Selection.ShapeRange.Width = app_1.CentimetersToPoints(3.5);
    app_1.Selection.ShapeRange.WrapFormat.AllowOverlap = true;
    app_1.Selection.ShapeRange.WrapFormat.Side = 3;
    app_1.Selection.ShapeRange.WrapFormat.Type = 3;
    app_1.Selection.ShapeRange.RelativeHorizontalPosition = 0;
    app_1.Selection.ShapeRange.RelativeVerticalPosition = 0;
    app_1.Selection.ShapeRange.Left = 250;
    app_1.Selection.ShapeRange.Top = 580;
    app_1.ActiveWindow.ActivePane.View.SeekView = 0;
  }

  this.killWaterMark = function () {
    //删除水印
    var app_1 = obj.activeDocument.Application;
    obj.ActiveDocument.Sections(1).Range.Select();
    app_1.ActiveWindow.ActivePane.View.SeekView = 9;
    app_1.Selection.HeaderFooter.Shapes("PowerPlusWaterMarkObject1").Select();
    app_1.Selection.Delete();
    app_1.ActiveWindow.ActivePane.View.SeekView = 0;
  }
  /**
   * 控件载入时，载入文档。
   */
  this.initDocAddWaterMark = function (waterMark) {
    //指定了文件。
    if (this.config.fileId != "" && this.config.fileId > 0) {
      var path = __ctx + "/platform/system/sysFile/getFileById.ht?fileId=" + this.config.fileId;
      try {
        var docType = "Word.Document";
        this.controlObj.OpenFromURL(path, null, null);
        this.isFileOpen = true;
      }
      catch (err) {
        try {
          this.addPDFSupport();
          this.isFileOpen = true;
        }
        catch (err) {
          this.newDoc();
        }
      }
    }
    else {	//新建文档。
      this.newDoc();
    }
    //加水印
    this.TANGER_OCX_AddWaterMark(this.controlObj, waterMark);
    //IE浏览器是同步的 增加 设置文档是否只读，其它的为异步（由回调接管函数 OfficeControl.js 中有  documentOpenedOnComplete 处理 ）
    if (Sys.ie) {
      this.setFileReadOnly(false);
    }
    this.setDocUser();
    if (typeof(this.controlObj.ActiveDocument.TrackRevisions) == 'boolean') {
      if (this.config.menuRight.isMarkRight == 'y') {
        this.setMarkModify(false);

      } else {
        this.setMarkModify(true);
      }
      if (this.config.menuRight.isShowRight == 'y') {
        this.isShowmark(true);
      } else {
        this.isShowmark(false);
      }
      if (this.config.menuRight.notEditRight == 'y') {
        this.controlObj.SetReadOnly(true, '');
      }
      if (this.start) {
        this.setMarkModify(false);
      }
    }
  };
  /**
   * 控件载入时，载入文档。
   */
  this.initDoc = function () {
    //指定了文件。
    if (this.config.fileId != "" && this.config.fileId > 0) {
      var path = __ctx + "/platform/system/sysFile/getFileById.ht?fileId=" + this.config.fileId;
      try {
        //var docType=this.getDocType();
        var docType = "Word.Document";
        this.controlObj.OpenFromURL(path, null, null);
        this.isFileOpen = true;
      }
      catch (err) {
        try {
          this.addPDFSupport();
          this.isFileOpen = true;
        }
        catch (err) {
          this.newDoc();
        }
      }
    }
    else {	//新建文档。
      this.newDoc();
      //this.controlObj.ActiveDocument.Styles(-1).Font.NameFarEast="仿宋_GB2312";
      //this.controlObj.ActiveDocument.Styles(-1).Font.Size = 16;
    }
    //IE浏览器是同步的 增加 设置文档是否只读，其它的为异步（由回调接管函数 OfficeControl.js 中有  documentOpenedOnComplete 处理 ）
    if (Sys.ie) {
      this.setFileReadOnly(false);
    }
    this.setDocUser();
    if (typeof(this.controlObj.ActiveDocument.TrackRevisions) == 'boolean') {
      if (this.config.menuRight.isMarkRight == 'y') {
        this.setMarkModify(false);

      } else {
        this.setMarkModify(true);
      }
      if (this.config.menuRight.isShowRight == 'y') {
        this.isShowmark(true);
      } else {
        this.isShowmark(false);
      }
      if (this.config.menuRight.notEditRight == 'y') {
        this.controlObj.SetReadOnly(true, '');
      }
      if (this.start) {
        this.setMarkModify(false);
      }
    }
  };
  /**
   * 关闭文档。
   */
  this.closeDoc = function () {
    if (!confirm("关闭窗口不会保存文档！您确定要关闭吗?")) {
      return;
    } else {
      window.close();

    }
  };
  /**
   * 新建文档。
   */
  this.newDoc = function () {
    var path = __ctx + "/media/office/default.doc";
    try {
      //var docType=this.getDocType();
      var docType = "Word.Document";
      this.controlObj.OpenFromURL(path, null, null);
      this.isFileOpen = true;
    }
    catch (err) {
      try {
        this.addPDFSupport();
        this.isFileOpen = true;
      }
      catch (err) {
        this.newDoc();
      }
    }
  };
  /**
   * 保存文件到服务器。
   * 服务器返回文件id到this.config.fileId，同时返回文件ID。
   */
  this.saveRemote = function (inputObjNum) {

    var path = __ctx + "/platform/system/sysFile/saveFile.ht";
    var uploadName = this.controlId + "_name";
    var fileType = OfficePlugin.fileObjs.get(inputObjNum).getAttribute("fileType");
    if (typeof fileType == "undefind") {
      fileType = "";
    }
    var params = "fileId=" + this.config.fileId + "&uploadName=" + uploadName + "&fileType=" + fileType + "&isEdit=" + editPower;
    try {
      //保存数据到服务器。
      var curDate = new Date();
      var docName = Math.random() * curDate.getMilliseconds() * 10000;
      /*如果人后辍名为空时,需要用对象的类型来区分是什么文件返回当前控件中的文档类型,
       只读 0:  没有文档； 100 =其他文档类型；
       1=word；2=Excel.Sheet或者 Excel.Chart ；
       3=PowerPoint.Show； 4= Visio.Drawing；
       5=MSProject.Project； 6= WPS Doc；
       7:Kingsoft Sheet； 51 = PDF文档
       */
      if (this.config.doctype == '' || this.config.doctype == null || 'undefined' == typeof (this.config.doctype)) {
        var type = this.controlObj.DocType;
        if (type == 2) {
          this.config.doctype = "xls";
        } else if (type == 3) {
          this.config.doctype = "ppt";
        } else if (type == 51) {
          this.config.doctype = "pdf";
        } else {
          this.config.doctype = "doc";
        }
      }
      var result;
      if (Sys.firefox || Sys.chrome) {   //火狐谷歌浏览器控件文档保存事件（异步的）
        if (typeof(inputObjNum) != undefined && inputObjNum != null) {
          params += "&inputObjNum=" + inputObjNum;        // 用于保存返回的值对象的名称 （异步的才会有）
        }
        //当你用SaveToURL方法时，回调属性用：ForOnSaveToURL 如果是SaveAsOtherFormatToURL的话，就用ForOnSaveAsOtherFormatToURL回调
        if (this.config.doctype == 'pdf') {
          //直接保存文档，不用转换成指定是什么格式的文件方法
          this.controlObj.SaveToURL(path, uploadName, params, docName + "." + this.config.doctype, 0);
        } else {
          //保存文档时要转换成指定兼容文档的的格式方法
          this.controlObj.SaveAsOtherFormatToURL(5, path, uploadName, params, docName + "." + this.config.doctype, 0);
        }
        result = -11;
      } else {   //IE是同步的
        //SaveToURL
        if (this.config.doctype == 'pdf') {
          //直接保存文档，不用转换成指定是什么格式的文件方法
          result = this.controlObj.SaveToURL(path, uploadName, params, docName + "." + this.config.doctype, 0);
        } else {
          //保存文档时要转换成指定兼容文档的的格式方法

          result = this.controlObj.SaveToURL(path, uploadName, params, docName + "." + this.config.doctype, 0);
          //result=this.controlObj.SaveAsOtherFormatToURL(4,path,uploadName,params,docName+"." + this.config.doctype,0);
        }
        this.config.fileId = result;
      }
      return result;
    }
    catch (err) {
      //alert("saveRemote:" +err.name + ": " + err.message);
      if (Sys.firefox || Sys.chrome) {
        return -13;   //报错时表示火狐谷歌下OFFICE不正常
      }
      return -12;
    }
  };
  /**
   * 保存副本文件到服务器。
   * 服务器返回文件id到this.config.fileId，同时返回文件ID。
   */
  this.saveFuBenRemote = function () {
    var objs = $("input[lablename='正文副本']", window.opener.document);
    var fileId = "";
    var businessKey = $("#businessKey", window.opener.document).val();
    var fieldName = "";
    if (objs.length > 0) {
      fileId = objs[0].value;
      fieldName = objs[0].name;
    }
    var path = __ctx + "/platform/system/sysFile/saveFile.ht";
    var uploadName = this.controlId + "fuben_name";
    //type:doc  businessKey   name
    var params = "fieldName=" + fieldName + "&businessKey=" + businessKey + "&fileId=" + fileId + "&uploadName=" + uploadName + "&fileType=";
    try {
      //保存数据到服务器。
      var curDate = new Date();
      var docName = Math.random() * curDate.getMilliseconds() * 10000;
      this.config.doctype = "doc";
      var result;
      if (Sys.firefox || Sys.chrome) {   //火狐谷歌浏览器控件文档保存事件（异步的）
        if (typeof(inputObjNum) != undefined && inputObjNum != null) {
          params += "&inputObjNum=" + inputObjNum;        // 用于保存返回的值对象的名称 （异步的才会有）
        }
        this.controlObj.SaveAsOtherFormatToURL(5, path, uploadName, params, docName + "." + this.config.doctype, 0);
        result = -11;
      } else {   //IE是同步的
        //SaveToURL
        //保存文档时要转换成指定兼容文档的的格式方法
        result = this.controlObj.SaveAsOtherFormatToURL(5, path, uploadName, params, docName + "." + this.config.doctype, 0);
        var objs = $("input[lablename='正文副本']", window.opener.document);
        var fileId = "";
        if (objs.length > 0) {
          objs[0].value = result;
        }
      }
      alert("副本保存成功");
      return result;
    }
    catch (err) {
      if (Sys.firefox || Sys.chrome) {
        return -13;   //报错时表示火狐谷歌下OFFICE不正常
      }
      return -12;
    }
  };
  /**
   * 对文档进行签单
   */
  this.signature = function () {
    var url = __ctx + "/platform/system/seal/dialog.ht";
    var winArgs = "dialogWidth=800px;dialogHeight=600px;help=0;status=0;scroll=1;center=0;resizable=1;";
    url = url.getNewUrl();
    var that = this;
    /*KILLDIALOG*/
    DialogUtil.open({
      height: 500,
      width: 800,
      title: '对文档进行签单',
      url: url,
      isResize: true,
      //自定义参数
      sucCall: function (retVal) {
        if (typeof(retVal) == undefined || retVal == null) {
          return false;
        }
        if (retVal.fileId.isEmpty()) {
          return false;
        }
        var sealUrl = __ctx + "/platform/system/sysFile/getFileById.ht?fileId=" + retVal.fileId;
        try {
          var selLeft = that.controlObj.ActiveDocument.Application.Selection.Information(5);
          var selTop = that.controlObj.ActiveDocument.Application.Selection.Information(6);
          that.controlObj.SetAutoCheckSignKey("ntko");
          that.controlObj.addsignfromURL(_self.config.user.name,//签章的用户名
            sealUrl,//印章所在服务器相对url
            0,//left
            0,//top
            "ntko",
            1,//relative
            100,  //print mode 2
            0//是是否使用证书，true或者false，
          );
        } catch (err) {
          alert("signature:addsignfromURL:" + err.name + ": " + err.message);
          return -1;
        }
      }
    });

  };
  /**
   * 对Office文档进行Ekey硬件签章
   */
  this.signatureFromEkey = function () {
    if (this.controlObj != null) {
      this.controlObj.AddSecSignFromEKEY(
        _self.config.user.name,     //username
        0,  //left
        0,  // top,
        1,  // relative,
        2,  // PrintMode,
        false,  // IsUseCertificate,
        false,  // IsLocked,
        true,  // IsCheckDocChange,
        false,  //  IsShowUI
        true,  //   signpass,
        -1,    // ekeySignIndex,
        true,  //  IsAddComment,
        true  //  IsBelowText
      );
    }
  };

  /**
   * 对PDF文档进行Ekey硬件签章
   */
  this.signaturePdfFromEkey = function () {
    if (this.controlObj != null) {
      /*if(!this.controlObj.IsEkeyConnected)
       {
       alert("没有检测到EKEY.请将EKEY插入到计算机!然后点击确定继续.");
       return;
       }*/
      alert("signaturePdfFromEkey");
      this.controlObj.ActiveDocument.AddPDFSecSignFromEKEY(_self.config.user.name, null, "111111", null, 1, null, null, null, null, true, false, true, false, null);
    }
  };
  /**
   * 把Office文件转换成PDF文件。
   * 服务器返回文件id到this.config.fileId，同时返回文件ID。
   */
  this.officeToPdf = function () {
    if (!confirm("文档转换成PDF后将不可以恢复原有格式文档，确认转换吗？")) {
      return;
    }
    try {
      //保存数据到服务器。
      var pdfUrl = __ctx + "/platform/system/sysFile/saveFilePdf.ht";
      var uploadName = this.controlId + "_pdf";
      var params = "fileId=" + this.config.fileId + "&uploadName=" + uploadName;
      var pdfName = this.config.fileId + ".pdf";
      this.controlObj.PublishAsPDFToURL(pdfUrl, uploadName, params, pdfName, 0, null, true, true, false, true, true, true);
      //window.location.href=window.location.href;
    }
    catch (err) {
      alert("officeToPdf:" + err.name + ": " + err.message);
    }
  };
  this.protectDoc = function () {
    try {
      if (this.controlObj.ActiveDocument.ProtectionType == -1) {
        var pwd = prompt("请输入加锁密码", "");
        var repwd = prompt("请再输入加锁密码", "");
        if (pwd != repwd) {
          alert("两次输入密码不一致");
          return false;
        }
        this.controlObj.ActiveDocument.Protect(2, false, pwd);
      } else {
        this.controlObj.ActiveDocument.Unprotect();
      }
    }
    catch (err) {

    }
  };
  this.unProtectDoc = function () {
    try {
      if (this.controlObj.ActiveDocument.ProtectionType > 0) {
        var pwd = prompt("请输入加锁密码", "");
        this.controlObj.ActiveDocument.Unprotect(pwd); //解开保护
        this.controlObj.ActiveDocument.Application.Selection.Editors(-1).Delete();//
      }
    }
    catch (err) {

    }
  };

  /**
   * 把打开PDF文件
   */
  this.addPDFSupport = function () {
    //this.controlObj = document.getElementById(this.controlId);
    if (document.URL.indexOf("file://") >= 0) {
      if (!confirm("如果从本地磁盘打开的URL，需要手工运行命令'regsvr32 ntkopdfdoc.dll'注册插件文件.您确认已经注册了吗？")) {
        return;
      }
    }
    var path = __ctx + "/platform/system/sysFile/getFileById.ht?fileId=" + this.config.fileId;
    this.controlObj.AddDocTypePlugin(".pdf", "PDF.NtkoDocument", "4.0.0.1", __ctx + "/media/office/ntkopdfdoc.cab", 51, true);	//引用pdf组件
    //	this.controlObj.BeginOpenFromURL(path);  //打开PDF从URL "media/office/bpm.pdf"
    this.controlObj.OpenFromURL(path);

  };
  /**
   * 下载副本
   */
  this.downloadZwFuBen = function () {
    var objs = $("input[lablename='正文副本']", window.opener.document);
    var fileId = "";
    if (objs.length > 0) {
      fileId = objs[0].value;
    }
    if (fileId == "") {
      alert("未上传正文副本 ！！！");
      return;
    }
    var url = __ctx + "/platform/system/sysFile/download.ht?fileId=" + fileId;
    window.open(url);
  }

  /**
   * 参数为true时把文档设置为只读，false按文档原来的权限设置
   */
  this.setFileReadOnly = function (isRead) {
    var type = this.config.doctype;
    if (type == '' || type == null || 'undefined' == typeof (type) || type == 'pdf' || type == 'PDF') {
      return;
    }
    try {
      if (isRead) {
        this.controlObj.SetReadOnly(true, '');
        this.config.right == 'r';
      } else {
        if (this.config.right != 'w' && this.config.right != 'b') {
          this.controlObj.SetReadOnly(true, '');
        }
      }
    } catch (err) {
      //alert("setFileReadOnly:" +err.name + ": " + err.message);
    }
  };

  this.setBookMark = function () {
    var data = window.opener.CustomForm.getData();//、CustomForm.getData().main;
    var dataObj = eval("(" + data + ")").main.fields;//转换为json对象
    this.setBookMarkValue("instancy", dataObj.hj, "hj");//缓急
    this.setBookMarkValue("secret", dataObj.mj, "mj");//密级
    this.setBookMarkValue("FileClassNo", dataObj.jwh, "jwh");//文号
    this.setBookMarkValue("fnotype", dataObj.wh, "wh");//文号
    this.setBookMarkValue("Subject", dataObj.bt, "zsxtw");//标题
    this.setBookMarkValue("senddeptp", dataObj.zsxtw, "zsxtw");//主送抬头
    this.setBookMarkValue("senddept", dataObj.zsxtn, "zsxtn");//主送抬头
    this.setBookMarkValue("copydeptp", dataObj.csxtn, "csxtn");//抄送csxtn
    this.setBookMarkValue("copydept", dataObj.csxtw, "csxtw");//
    this.setBookMarkValue("draftuser", dataObj.ngr, "ngr");//联系人
    this.setBookMarkValue("phonenum", dataObj.ngrdh, "ngrdh");//联系电话
    this.setBookMarkValue("readleader", dataObj.nbfsld, "nbfsld");//内部发送
    this.setBookMarkValue("innersenddept", dataObj.nbfsbs, "bs");//内部发送
    this.setBookMarkValue("ztc", dataObj.ztc1, "ztc1");//主题词
  };
  this.setBookMarkValue = function (bookMark, value, field) {
    if ('undefined' == typeof (value) || value == "" || value == "无") {
      if (formData != "" && formData[field] != "" && formData[field] != "无" && 'undefined' != typeof (formData[field])) {
        value = formData[field];
      } else {
        return;
      }
    }
    var doc = _self.controlObj.ActiveDocument;
    var bookMarks = doc.BookMarks;
    if (bookMarks.Exists(bookMark)) {
      doc.BookMarks(bookMark).Range.Text = value;
    }
  };
};


/**
 * 火狐谷歌浏览器控件文档保存事件（异步的，IE是同步的）回调接管函数 注意不在OfficeControl类里面  一定是单独方法  是控件属性的ForOnSaveToURL对应的方法 （SaveToURL保存后的回调函数）
 * html 为后台返回的内容
 */
var saveMethodOnCompleteNum = 0;   // 有几次回调文件了
function saveMethodOnComplete(type, code, html) {
  saveMethodOnCompleteNum = saveMethodOnCompleteNum + 1;
  var arrys = html.split("##");
  var arryNum = arrys[0];    //保存对象的序号
  var arryValue = arrys[1];    //要保存的内容
  if (arryNum >= 0) {
    //返回小于1的情况要不要重新获取旧值做保存？
    /*if(arryValue<=0){
     arryValue = OfficePlugin.fileObjs.get(arryNum).getAttribute("value");   //保存到对象的值;
     }*/
    if (arryValue > 0) {
      OfficePlugin.fileObjs.get(arryNum).setAttribute("value", arryValue);   //保存到对象的值
      OfficePlugin.officeObjs[arryNum].config.fileId = arryValue;  //控件中config对象的fileId
      OfficePlugin.hasSubmitOffices[arryNum] = true; //完成标志
      OfficePlugin.submitNewNum = OfficePlugin.submitNewNum + 1;   //每回调一次就 提交数量的变量就 加上 1
      if (OfficePlugin.submitNum == OfficePlugin.submitNewNum) {    //当提交问题 等于 提交数量的变量 时 表示所有文档 都提交了  然后做 业务相关的提交
        if (OfficePlugin.callBack) {
          OfficePlugin.callBack();
        } else {
          var data = CustomForm.getData();
          //设置表单数据
          $("#formData").val(data);
          $('#frmWorkFlow').submit();
        }
        OfficePlugin.submitNewNum = 0; //重置  提交数量的变量
        saveMethodOnCompleteNum = 0; //重置  回调用提交方法次数的变量
      }
    } else {
      if (saveMethodOnCompleteNum == OfficePlugin.submitNum) {
        //$.ligerDialog.warn("提交失败,OFFICE控件没能正常使用，请重新安装 ！！！","提示");
        alert("提交失败,OFFICE控件没能正常使用，请重新安装 ！！！");
      }
    }
  } else {
    if (saveMethodOnCompleteNum == OfficePlugin.submitNum) {
      //$.ligerDialog.warn("提交失败,OFFICE控件没能正常使用，请重新安装 ！！！","提示");
      alert("提交失败,OFFICE控件没能正常使用，请重新安装 ！！！");
    }
  }

}

/**
 * 火狐谷歌浏览器控件文档在套红模版事件（异步的，IE是同步的）回调接管函数 注意不在OfficeControl类里面  一定是单独方法  是控件属性的ForOnAddTemplateFromURL对应的方法 （AddTemplateFromURL保存后的回调函数）
 * html 为后台返回的内容
 */
function addTemplateOnComplete(myNum) {
  //OfficePlugin.fileObjs.get(myNum).setAttribute("value",arryValue);   //保存到对象的值
  myObj = OfficePlugin.officeObjs[myNum];  //OfficeControl 实例对象
  var BookMarkName = "content";
  if (!myObj.controlObj.ActiveDocument.BookMarks.Exists(BookMarkName)) {
    alert("Word 模板中不存在名称为：\"" + BookMarkName + "\"的书签！");
    return false;
  }
//	var bkmkObj = myObj.controlObj.ActiveDocument.BookMarks(BookMarkName);   //IE的方法
  var bkmkObj = myObj.controlObj.ActiveDocument.BookMarks.Item(BookMarkName);	  //火狐和谷歌特有的
  var saverange = bkmkObj.Range;
  saverange.Paste();
  myObj.controlObj.ActiveDocument.Bookmarks.Add(BookMarkName, saverange);

}


/**
 * 火狐谷歌浏览器控件文档在打开文档后的事件（异步的，IE是同步的）
 *
 */
function documentOpenedOnComplete(myNum) {
  myObj = OfficePlugin.officeObjs[myNum];  //OfficeControl 实例对象
  //文档要求为只读时，通过Office 实例对象设置文档为只读
  if (myObj != null && myObj != undefined) {
    myObj.setFileReadOnly(false);
  }
  if (typeof documentOpenedOnCompleteCallback != 'undefined') {
    documentOpenedOnCompleteCallback();
  }
}
function documentOpened(str, obj) {
  myObj = OfficePlugin.officeObjs[0];  //OfficeControl 实例对象
  //文档要求为只读时，通过Office 实例对象设置文档为只读
  if (myObj != null && myObj != undefined) {
    myObj.isFileOpen = true;
    //myObj.setDocUser();
  }
}



