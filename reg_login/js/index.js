var main = (function(doc, loginAction, regAction){

  var oOpenLoginBtn = doc.getElementsByClassName('js_openLoginBtn')[0],
      oOpenRegBtn = doc.getElementsByClassName('js_openRegBtn')[0],
      oCloseLoginBtn = doc.getElementsByClassName('js_closeBtn')[0],
      oCloseRegBtn = doc.getElementsByClassName('js_closeBtn')[1],
      oLoginBtn = doc.getElementsByClassName('js_loginBtn')[0],
      oRegBtn = doc.getElementsByClassName('js_regBtn')[0],
      oSendCodeBtn = doc.getElementsByClassName('js_sendCodeBtn')[0],
      oLoginStatus = doc.getElementsByClassName('js_loginStatus')[0],
      oCodeImg = doc.getElementsByClassName('js_codeImg')[0],

      loginTpl = doc.getElementById('js_loginTpl').innerHTML,
      userTpl = doc.getElementById('js_userTpl').innerHTML;

  function bindEvent(){
  	oOpenLoginBtn.addEventListener('click', loginAction.openLoginBoard.bind(null, true), false);
    oOpenRegBtn.addEventListener('click', regAction.openRegBoard.bind(null, true), false);
  	oCloseLoginBtn.addEventListener('click', loginAction.openLoginBoard.bind(null, false), false);
    oCloseRegBtn.addEventListener('click', regAction.openRegBoard.bind(null, false), false);
    oLoginBtn.addEventListener('click', loginAction.login.bind(loginAction), false);
    oRegBtn.addEventListener('click', regAction.register.bind(regAction), false);
    oSendCodeBtn.addEventListener('click', regAction.sendTelCode.bind(regAction, oSendCodeBtn), false);
    oCodeImg.addEventListener('click', regAction.refreshCode.bind(null, oCodeImg), false);
  }
  
  //方法私有化
  function renderUserArea(isLogin){
    if(isLogin){
      manageCookies.get('nickname', function(cookie){
        oLoginStatus.innerHTML = userTpl.replace(/{{(.*?)}}/g, cookie);
      });
    }else{
      oLoginStatus.innerHTML = loginTpl;
    }
  }
  
  //方法公用化
  return {
    init: function(){
      this.checkAuth();
      bindEvent();
    },

    checkAuth: function(){
      var _self = this;

      manageCookies.get('auth', function(cookie){
        if(cookie != undefined){
          xhr.ajax({
            url: 'http://localhost/api_for_study/User/checkAuth',
            type: 'POST',
            dataType: 'JSON',
            data: {
              auth: cookie
            },
            success: function(data){
              var code = data.error_code,
                  errorInfo = '';

              switch(code){
                case '1006':
                  errorInfo = '登录验证不通过，请重试';
                  loginAction.openLoginBoard(true);
                  renderUserArea(false);
                  break;
                case '1007':
                  errorInfo = '登录已过期，请重试';
                  loginAction.openLoginBoard(true);
                  renderUserArea(false);
                  break;
                case '200':
                  renderUserArea(true);
                  break;
                default:
                  break;
              }
            }
          });
        }
      });
    }
  }
})(document, loginAction, regAction);