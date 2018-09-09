/**
 * Office插件，用于自定义表单。
 * 
 * 1.OfficePlugin.init();
 *  	加载office控件。
 * 
 * 2.OfficePlugin.submit();
 * 		保存office文档。
 */
OfficePlugin={
		//当前登陆用户相关信息件对象
		user:{id:"0",name:"开发用户",groupId:"0",groupName:"开发部"},
		//office控件对象
		officeObjs:new Array(),
		//附件对象
		fileObjs:null,
		//控件窗口
		officeDialog:null,
		//判断当前表单页面是否有office控件。
		hasOfficeFields:new Array(),		
		//判断当前表单页面所有office控件是否都提交了。
		hasSubmitOffices:new Array(),
		//有多少文档可以提交的
		submitNum:null,
		//当前提交文档变量
		submitNewNum:null,
		//是否初始化tab中的OFFICE工具栏目的隐藏问题。在FormUtil用到
		isTabItemOffice:true,
		//初始化
		//所做的操作如下：
		//1.检查当前表单中是否有office控件。
		//2.如果存在office控件
		// 	获取文件id，将office控件添加到容器中。
		initoffic:function(){},
		init:function(){
			if(this.officeDialog!=null){
				this.officeDialog.show();
				return;
			}
			this.officeObjs=new Array();
			this.hasOfficeFields=new Array();
			this.hasSubmitOffices=new Array();
			this.user = getDocUserData();
			var num = 0;
			var myNum = 0;
			this.fileObjs=$("input[controltype='office']");
			for ( var i = 0; i < this.fileObjs.length; i++) {
				var fileObj = this.fileObjs.get(i);
				var name=fileObj.getAttribute("name");
				var fileId=fileObj.getAttribute("value");

				//获取附件的扩展名
				var doctype = "";
				if(fileId!=null&&fileId!=""){
					doctype = sysFileType(fileId);
				}else{
					fileId="";
					doctype = fileObj.getAttribute("doctype");	
				}
				
				var width=$(fileObj).css('width');
				var height=$(fileObj).css('height');
				
				
				width=(width==null || width=="0px")?"100%":width;
				height=(height==null || height=="0px")?"100%":height;
				
				
		
				width=width.endWith("%", false)?width:width +"px";
				height=height.endWith("%", false)?height:height +"px";
				
			
				
				if(doctype){
					doctype = doctype.toLowerCase();
					if(doctype=='pptx'){
						doctype='ppt';
					}else if(doctype=='docx'){
						doctype = 'doc'; 
					}else if(doctype=='xlsx'){
						doctype = 'xls'; 
					}
				}
				
				//容器的ID  
				var divId="div_" + name.replaceAll(":","_");
				
				//容器样式修改
				var div_rq = $("#" + divId);
				if(!div_rq || div_rq.length<1){
					//如果找不到容器，则为表单生成模式，需要生成一个容器div
					div_rq = $('<div id="'+divId+'" class="office-div"></div>');
					$(fileObj).after(div_rq);
				}
				div_rq.css("width", "99%");
				div_rq.css("height", height);
				
				//字段权限
				var right=fileObj.getAttribute("right");
				if(!right||right==""){
					right="w";//默认可写
				}
				//默认菜单权限，全部功能打开
				var menuRight = {wjRight:'y',lhRight:'y',blhRight:'y',qchjRight:'y',mbthRight:'y',xzmbRight:'y',sxqmRight:'y',gzRight:'y',qpRight:'y',zcpdfRight:'y',ekeygzRight:'y',pdfgzRight:'y'};
				//字段对应的控件的菜单权限
				var menuRightStr = fileObj.getAttribute("menuRight");
				if(typeof(menuRightStr)!='undefined' && menuRightStr!=null && menuRightStr!=''){
					menuRightStr = menuRightStr.replace(/\'/g, '\"');
					menuRight =  eval("(" +menuRightStr +")");
				}
				
				//有多少 个文档是可以做提交的
				if(right=="w"||right=="b"){
					//必填  已在其它处理
					if(right=="b"){
						var validRule = fileObj.getAttribute("validate");
						if ( validRule != null && 'undefined' != validRule.toLowerCase() && validRule.length>2 ){ 
							var json = eval('(' + validRule + ')');		
							if(json.required){
								//不做操作
							}else{
								var jsonStr = validRule.substring(0, validRule.lastIndexOf('}'));
								jsonStr +=",\'required\':true}";    //加上必填
								fileObj.setAttribute("validate",jsonStr);    
							}				
						}else{
							fileObj.setAttribute("validate","{\'required\':true}");     //必填
						}
					}	
					num++;           //做可提交的标志数量
				}
				this.officeDialog=$.ligerDialog.open({
					target:$("#" + divId),
			        height:600,
			        width: 1000,
			        title : '正文',
			        isHidden:true,
			        //url: __ctx+"/platform/system/sysFile/getOffic.ht?name="+name+"&fileId="+fileId+"&right="+right+"&menuright="+menuright, 
			        isResize: true
	    	   });
				//没有权限，删除div容器。
				if(right=="no"){
					div_rq.remove();
				}else{             //有读和写的权限，加载控件。
					$.ligerDialog.waitting('正在加载OFFICE文档,请稍候...');
					//加载控件。
					var officeObj= new OfficeControl();
					this.officeObjs.push(officeObj);
					//加载office控件。
					officeObj.renderTo(divId,{fileId:fileId,doctype:doctype,myNum:myNum,right:right,user:this.user,menuRight:menuRight});
					//是否有office控件。
					this.hasOfficeFields.push(true);
					//office控件文档标志
					this.hasSubmitOffices.push(false);
					myNum++; //序号
					$.ligerDialog.closeWaitting(); 
				}
			}
			this.submitNum = num;  //文档是可以做提交的数目   总娄
			this.submitNewNum = 0;  //文档是提交了的数目     变化的(重新清空)
		},
		//提交文件保存。
		//如果有office控件。则保存后将返回的附件id放到隐藏域。
		submit:function(callBack){
			$.ligerDialog.waitting('正在保存OFFICE文档中,请稍候...');
			//每次提交，都需要清零
			this.submitNewNum = 0;
		//	var _self=this;
			for ( var cn = 0; cn < this.officeObjs.length; cn++) {
				var officeObj= this.officeObjs[cn];
				if(!this.hasOfficeFields[cn]) return;
				var right=this.fileObjs.get(cn).getAttribute("right");
				
				if(callBack){
					this.callBack=callBack;
				}
				
				//可写，保存office内容并上传。
				if(right=="w"||right=="b"){
					//保存到服务器。
					var result=officeObj.saveRemote(cn);
					if(result==-11){
						//由 火狐谷歌浏览器控件文档保存事件（异步的，IE是同步的）回调接管函数 OfficeControl.js 中有  saveToURLOnComplete 处理 
					}else if(result==-13){
						//由 火狐谷歌浏览器控件文档保存事件报错不能由回调接管函数 OfficeControl.js 中有  saveToURLOnComplete 处理 ，直接 在这里处理
						//下面处理的是如果没安装控件，也可以正常提交表单（建议注销保留）
						/*result = this.fileObjs.get(cn).getAttribute("value");   //保存到对象的值;
						if(result>0){
							officeObj.config.fileId = result;  //控件中config对象的fileId
							this.fileObjs.get(cn).setAttribute("value",result);
							this.hasSubmitOffices[cn]=true; //完成标志
							this.submitNewNum = this.submitNewNum + 1;  //文档是提交了的数目     变化的(重新清空)
							if(this.submitNum == this.submitNewNum){    //当提交问题 等于 提交数量的变量 时 表示所有文档 都提交了  然后做 业务相关的提交
								var data=CustomForm.getData();
								//设置表单数据
								$("#formData").val(data);
								$('#frmWorkFlow').submit();
								this.submitNewNum = 0; //重置  提交数量的变量
							}else{
								if(cn==this.officeObjs.length){
									$.ligerDialog.warn("提交失败,OFFICE控件没能正常使用，请重新安装 ！！！","提示");
								}
							}
						}else{
							$.ligerDialog.warn("提交失败,OFFICE控件没能正常使用，请重新安装 ！！！","提示");
							break
						}*/
						//$.ligerDialog.warn("提交失败,OFFICE控件没能正常使用，请重新安装 ！！！","提示");
						alert("提交失败,OFFICE控件没能正常使用，请重新安装 ！！！");
						break;
					}else{
						//将结果放到隐藏域。(同步的 处理方法 IE 360 等)
						//如果返回的是错误的内容，就保存以前的ID（因为过程中文档的ID是一样的）
						/*if(result==12){      //12这种是OFFICE安装程序有误,可要获取以前的保存（建议注销保留）
							result = this.fileObjs.get(cn).getAttribute("value");
						}*/
						if(result>0){
							this.fileObjs.get(cn).setAttribute("value",result);
							this.hasSubmitOffices[cn]=true; //完成标志
							this.submitNewNum = this.submitNewNum + 1;  //文档是提交了的数目     变化的(重新清空)
						}else{
							break; //文件上传失败
						}
					}
				}else{
					this.hasSubmitOffices[cn]=true;    //完成标志					
				}
			}
			$.ligerDialog.closeWaitting();   //关闭提示
			if(callBack){
				callBack();
			}
		}
};

//获取文件格式
function sysFileType(fileId){
	var doctype = "doc";
	var path = __ctx +'/platform/system/sysFile/getFileType.ht';
    $.ajaxSetup({async:false});  //同步
	$.post(path,{fileId:fileId},function(data){			
	   doctype = data;
    });
	$.ajaxSetup({async:true}); //异步
	return doctype;
};


//获取用户
function getDocUserData(){
	var user = OfficePlugin.user;
	var path = __ctx +'/platform/system/sysFile/getUserData.ht';
    $.ajaxSetup({async:false});  //同步
	$.post(path,{},function(data){			
	   if(data!=""){
		   var obj = eval('(' + data + ')');
		   if(obj.success){
			   user = obj.user;
		   }
	   }
    });
	$.ajaxSetup({async:true}); //异步
	return user;
};



