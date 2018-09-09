//注意:这是内部需要使用的函数，除
//ocxElement.codebase = "ntkoWebSign.cab#version=4,0,2,0";
//语句可以根据需要修改之外，其他语句不要修改
function NtkoReserved_AddSecSignOcx(ControlID,ocxLeft,ocxTop)
{
	var ocxElement = null;
	try
	{
		ocxElement = document.createElement('object');
		if("string" == typeof(ControlID))
		{
			ocxElement.id = ControlID;
		}
		ocxElement.style.position = "absolute";
		ocxElement.style.pixelLeft = ocxLeft;
		ocxElement.style.pixelTop = ocxTop;
		ocxElement.codebase = "ntkoWebSign.cab#version=4,0,2,0";
		ocxElement.classid = "clsid:AA4B3728-B61C-4bcc-AEE7-0AA47D3C0DDA"; 
		ocxElement.width = "10";
		ocxElement.height = "10";
		document.body.appendChild(ocxElement);	
		return ocxElement;
	}
	catch(err)
	{		
		alert("印章对象装载错误!请确认您正确安装了NTKO安全电子印章系统！"+ err.number + ":" + err.description);			
		if(ocxElement)
		{
			ocxElement.removeNode();
		}
	}
	return null;
}
//注意：以下函数除提示信息之外，其他语句不要修改。
function NtkoReserved_RunSignHelper(ocxElement,UserName,FileName,PromptSelect,
		PrintMode,IsUseCertificate,IsLocked,IsCheckDocChange,
		IsShowUI,SignPass,SignType,IsAddComment,AdjustToHeight,SignIndex)
{
	if("object" != typeof(ocxElement)) return;
	ocxElement.SetUser(UserName);
	switch(SignType)
	{
		case 0:
			{
				try
				{
					ocxElement.DoSign(FileName,PromptSelect, SignPass, PrintMode, 
						IsUseCertificate, IsLocked,IsCheckDocChange,IsShowUI,IsAddComment);
				}
				catch(err)
				{		
				//	alert("加盖印章错误!");			
					ocxElement.Close();
					ocxElement.removeNode();
				}
			}
			break;
		case 1:
			{
				try
				{
					ocxElement.DoHandSign(PrintMode,IsUseCertificate,IsLocked,IsCheckDocChange,
						IsShowUI,SignPass,IsAddComment,AdjustToHeight);
				}
				catch(err)
				{
				//	alert("手写签名错误!");
					ocxElement.Close();
					ocxElement.removeNode();
				}		
			}	
			break;
		case 2:
			{
				try
				{
					ocxElement.DoSignFromEkey(SignPass,PrintMode,IsUseCertificate,IsLocked,
						IsCheckDocChange,IsShowUI,SignIndex,IsAddComment);
				}
				catch(err)
				{
				//	alert("加盖EKEY印章错误!");
					ocxElement.Close();
					ocxElement.removeNode();
				}		
			}	
			break;	
		case 3:
			{
				try
				{
					ocxElement.DoKeyBoardComment(PrintMode,IsUseCertificate,IsLocked,IsCheckDocChange,IsShowUI,SignPass);
				}
				catch(err)
				{
				//	alert("添加安全键盘批注错误!");
					ocxElement.Close();
					ocxElement.removeNode();
				}		
			}	
			break;		
		case 4:
			{
				try
				{
					ocxElement.DoHandSignFullScreen(PrintMode,IsUseCertificate,IsLocked,IsCheckDocChange,
						IsShowUI,SignPass,IsAddComment,AdjustToHeight);
				}
				catch(err)
				{
				//	alert("全屏手写签名错误!");
					ocxElement.Close();
					ocxElement.removeNode();
				}			
			}	
			break;			
		case 5:
			{
				try
				{
					ocxElement.DoHandSignInplace(PrintMode,IsUseCertificate,IsLocked,IsCheckDocChange,
						IsShowUI,SignPass);
				}
				catch(err)
				{
				//	alert("嵌入手写签名错误!");
					ocxElement.Close();
					ocxElement.removeNode();
				}			
			}	
			break;					
		default: 
			{
				try
				{
					ocxElement.DoSign(FileName,true, SignPass, PrintMode, 
						IsUseCertificate, IsLocked,IsCheckDocChange,IsShowUI);
				}
				catch(err)
				{
				//	alert("加盖印章错误!");
					ocxElement.Close();
					ocxElement.removeNode();
				}					
			}
			break;	
	}
}