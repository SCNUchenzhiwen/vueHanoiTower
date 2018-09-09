/**
 * ntko控件api
 */

import getBrowserType from './getBrowserType.js'
/**
 * 获取文档类型。
 */
const getDocType = (type) => {
  let docType = "Word.Document";
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
}

// 套红
const signRed = (contrlObj, tempurl = 'http://www.ntko.com:8000/admin/ocv14_test.nsf/vwTaoHong/DAF324112709F8BA48256E4A005C3D5F/$file/gongwenT.doc?openelement') => {
  console.log(contrlObj)
  try {
    contrlObj.ActiveDocument.Application.Selection.HomeKey(6);
  } catch (err) {
    console.log('######## 套红失败 #########')
  }
  contrlObj.AddTemplateFromURL(tempurl)
}

// 设置当前word文档用户名
const setDocUser = (contrlObj, userName = '小胜') => {
  console.dir(contrlObj)
  contrlObj.ActiveDocument.Application.UserName = userName;//设置用户信息
  if (userName.length > 6) {
    contrlObj.ActiveDocument.Application.UserInitials = userName.substring(0, 5);
  } else {
    contrlObj.ActiveDocument.Application.UserInitials = userName;//设置用户信息缩写
  }
}

// 进入或退出痕迹保留状态，调用下面的两个函数
const setMarkModify = (contrlObj, boolvalue) => {
  setReviewMode(boolvalue);
  enableReviewBar(!boolvalue);
  // 打开或者关闭修订模式
  function setReviewMode(boolvalue) {
    contrlObj.ActiveDocument.TrackRevisions = boolvalue;
  }

  // 允许或禁止显示修订工具栏和工具菜单（保护修订）
  function enableReviewBar(boolvalue) {
    contrlObj.ActiveDocument.CommandBars("Reviewing").Enabled = boolvalue;
    contrlObj.ActiveDocument.CommandBars("Track Changes").Enabled = boolvalue;
    contrlObj.IsShowToolMenu = boolvalue; //关闭或打开工具菜单
  }
}

// 是否显示留痕
const showRevisions = (contrlObj, boolvalue) => {
  contrlObj.ActiveDocument.ShowRevisions = boolvalue
}

// 保存到服务器
const saveToServer = (contrlObj, url = 'http://localhost:3001/upload', fileName = 'UsersdouDesktop.docx') => {
  contrlObj.SaveToURL(url, fileName)
}

// 保存到本地
const saveToLocal = (contrlObj, localPath = 'C:\Users\dou\Desktop') => {
  contrlObj.SaveToLocal(localPath.replace(/\\/g, '/'))
}

export {
  getDocType,
  getBrowserType,
  signRed,
  setDocUser,
  setMarkModify,
  showRevisions,
  saveToServer,
  saveToLocal
}
