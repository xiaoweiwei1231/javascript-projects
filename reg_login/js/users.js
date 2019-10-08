var loginAction = (function(doc){
	var oModal = doc.getElementsByClassName('js_modal')[0],
      submitURL = doc.getElementById('js_loginForm').action,
	    oUsername = doc.getElementById('js_username'),
	    oPassword = doc.getElementById('js_password'),
	    oErrorTip = doc.getElementsByClassName('js_errorTip')[0],
	    oPersistedLogin = doc.getElementById('js_persistedLogin');

	function _submitForm(data){
    xhr.ajax({
      url: submitURL,
      type: 'POST',
      dataType: 'JSON',
      data: data,
      success: function(data){
        var code = data.error_code,
            errorInfo = '';

        switch(code){
        	case '1001':
        	  errorInfo = '用户名长度不正确';
        	  break;
        	case '1002':
        	  errorInfo = '密码长度不正确';
        	  break;
        	case '1003':
        	  errorInfo = '此用户名不存在';
        	  break;
        	case '1004':
        	  errorInfo = '密码不正确';
        	  break;
        	case '1005':
        	  errorInfo = '登录失败，请重试';
        	  break;
        	case '200':
        	  location.reload();
        	  break;
        	default:
        	  break;
        }

        oErrorTip.innerHTML = errorInfo;
      }
    });
  }
  
  return {
    openLoginBoard: function(show){
      if(show){
      	oModal.className += ' show login';
      }else{
      	oModal.className = 'modal-container js-modal';
      }
    },

    login: function(e){
    	var e = e || window.event;
    	e.preventDefault();

    	var username = trimSpace(oUsername.value),
    	    password = trimSpace(oPassword.value);

      if(username.length < 6 || username.length > 20){
  			oErrorTip.innerText = '用户名长度：6-20位';
  			return;
  		}

  		if(password.length < 6 || password.length > 20){
  			oErrorTip.innerText = '密码长度：6-20位';
  			return;
  		}
      oErrorTip.innerHTML = '';
  		_submitForm({
  			username: username, 
  			password: password, 
  			isPersistedLogin: oPersistedLogin.checked
  		});
    }
  }
})(document);

var regAction = (function(doc){
	var oModal = doc.getElementsByClassName('js_modal')[0],
      submitURL = doc.getElementById('js_regForm').action,
	    sendTelCodeURL = doc.getElementsByClassName('js_sendCodeBtn')[0].value,
      oNumber = doc.getElementById('js_rnumber'),
	    oPassword = doc.getElementById('js_rpassword'),
	    oTelCode = doc.getElementById('js_rtelcode'),
	    oPassCode = doc.getElementById('js_rpasscode'),
	    oErrorTip = doc.getElementsByClassName('js_errorTip')[1],
      oCodeImg = doc.getElementsByClassName('js_codeImg')[0],

      telCodeBtnDisabled = false;

	var t = null,
	    s = 60,
	    os = 60;

	function _submitForm(data, obj){
    xhr.ajax({
      url: submitURL,
      type: 'POST',
      dataType: 'JSON',
      data: data,
      success: function(data){
        var code = data.error_code,
            errorInfo = '';

        switch(code){
          case '1008':
            errorInfo = '手机号格式不正确';
            break;
          case '1002':
            errorInfo = '密码长度：6-20位';
            break;
          case '1009':
            errorInfo = '图片验证码不正确';
            break;
          case '1010':
            errorInfo = '与接收验证码的手机号不一致';
            break;
          case '1011':
            errorInfo = '短信验证码不正确';
            break;
          case '1014':
            errorInfo = '注册失败，请重试';
          default: 
            break;
        }
        oErrorTip.innerText = errorInfo;
        obj.refreshCode(oCodeImg);
        
        if(code == '200'){
          oErrorTip.innerText = '注册成功';
          setTimeout(function(){
            location.reload();
          }, 300);
        }
      }
    });
  }

  function countDown(obj){
  	if(s <= 0){
    	clearInterval(t);
    	t = null;
    	s = os;
      obj.className = 'input-btn js_sendCodeBtn';
      obj.disabled = false;
      obj.innerText = '获取验证码';
      telCodeBtnDisabled = false;
    }else{
    	s--;
    	obj.className += ' disabled';
      obj.disabled = true;
      obj.innerText = '已发送' + s + '秒';
      telCodeBtnDisabled = true;
    }
  }
  
  return {
  	openRegBoard: function(show){
      if(show){
      	oModal.className += ' show reg';
      }else{
      	oModal.className = 'modal-container js-modal';
      }
    },

    refreshCode: function(obj){
    	var imgUrl = obj.src;

    	obj.src = imgUrl.indexOf('?') > 0 ? 
    	           imgUrl.replace(/\?.*$/, '') + '?rand=' + Math.random() :
    	           imgUrl + '?rand=' + Math.random();
    },

    sendTelCode: function(btn){
    	var e = e || window.event;
    	e.preventDefault();

    	var pNumber = trimSpace(oNumber.value),
    	    errorInfo = '';

    	if(pNumber.length !== 11){
  			oErrorTip.innerText = '手机号长度：11位';
  			return;
  		}

  		if(!phoneNumberCheck(pNumber)){
  			oErrorTip.innerText = '手机号格式不正确';
  			return;
  		}

      if(!telCodeBtnDisabled){
        btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
      
        xhr.ajax({
          url: sendTelCodeURL,
          type: 'POST',
          dataType: 'JSON',
          data: {
            pNumber: pNumber
          },
          success: function(data){
            var code = data.error_code,
                errorInfo = '';

            switch(code){
              case '1008':
                errorInfo = '手机号格式不正确';
                break;
              case '1012':
                errorInfo = '手机号已被使用';
                btn.innerText = '获取验证码';
                break;
              case '1013':
                errorInfo = '验证码发送失败';
                btn.innerText = '获取验证码';
                break;
              case '200':
                t = setInterval(countDown.bind(null, btn), 1000);
                errorInfo = '验证码发送成功';
                break;
              default: 
                errorInfo = '验证码发送失败';
                btn.innerText = '获取验证码';
                break;
            }

            oErrorTip.innerText = errorInfo;
          }
        });
      }
    },

    register: function(){
      var e = e || window.event;
    	e.preventDefault();

    	var pNumber = trimSpace(oNumber.value),
    	    password = trimSpace(oPassword.value),
    	    telcode = trimSpace(oTelCode.value),
    	    passcode = trimSpace(oPassCode.value);

      if(pNumber.length !== 11){
  			oErrorTip.innerText = '手机号长度：11位';
  			return;
  		}

  		if(!phoneNumberCheck(pNumber)){
  			oErrorTip.innerText = '手机号格式不正确';
  			return;
  		}

  		if(password.length < 6 || password.length > 20){
  			oErrorTip.innerText = '密码长度：6-20位';
  			return;
  		}

  		if(telcode.length !== 6){
  			oErrorTip.innerText = '手机验证码长度：6位';
  			return;
  		}

  		if(digitCheck(telcode)){
        oErrorTip.innerText = '手机验证码必须是数字';
  			return;
  		}

  		if(passcode.length !== 4){
  			oErrorTip.innerText = '图片验证码长度：4位';
  			return;
  		}

  		if(alphabetCheck(passcode)){
  			oErrorTip.innerText = '图片验证码必须是字母';
  			return;
  		}

  		oErrorTip.innerHTML = '';
  		_submitForm({
        pNumber: pNumber,
        password: password,
        telcode: telcode,
        passcode: passcode
  		}, this);
    }
  }






})(document);























