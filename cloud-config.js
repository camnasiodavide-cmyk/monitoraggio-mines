window.MINES_CLOUD={url:'https://tedkgyaannofgiicowib.supabase.co',key:'sb_publishable_MlCrvJZoYynFByaIDDrKwA_oizkJgJ1'};

// Passkey / Face ID support.
(function(){
  if(!window.supabase||!window.supabase.createClient)return;
  var originalCreateClient=window.supabase.createClient;
  window.supabase.createClient=function(url,key,options){
    options=options||{};
    options.auth=Object.assign({persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,experimental:{passkey:true}},options.auth||{});
    options.auth.experimental=Object.assign({passkey:true},options.auth.experimental||{});
    var client=originalCreateClient(url,key,options);
    window.MINES_SB=client;
    return client;
  };

  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(async function(){
      var C=window.MINES_SB,login=document.getElementById('login'),loginBtn=document.getElementById('loginBtn'),loginMsg=document.getElementById('loginMsg'),app=document.getElementById('app');
      if(!C||!loginBtn||!login||!app)return;
      var session=(await C.auth.getSession()).data.session;

      function prepareLock(){
        app.classList.add('hidden');
        login.classList.remove('hidden');
        var p=login.querySelector('p');if(p)p.textContent='Sblocca Monitoraggio Mines+ con Face ID.';
        var f=document.getElementById('email');if(f&&f.parentElement)f.parentElement.style.display='none';
        loginBtn.textContent='Sblocca con Face ID';
      }
      async function faceUnlock(){
        loginMsg.textContent='Apertura Face ID…';
        try{
          var r=await C.auth.signInWithPasskey();
          if(r.error)throw r.error;
          loginMsg.textContent='';login.classList.add('hidden');app.classList.remove('hidden');return true;
        }catch(e){loginMsg.textContent='Accesso non riuscito: '+(e.message||e);return false}
      }

      if(session){
        prepareLock();
        loginBtn.onclick=faceUnlock;
        await faceUnlock();
      }else{
        prepareLock();
        loginBtn.textContent='Accedi con Face ID';
        loginBtn.onclick=faceUnlock;
        if(!document.getElementById('emailFallback')){
          var b=document.createElement('button');b.id='emailFallback';b.className='cancel';b.style.marginTop='10px';b.textContent='Recupero accesso via email';
          b.onclick=async function(){
            loginMsg.textContent='Invio in corso…';
            var r=await C.auth.signInWithOtp({email:'camnasiodavide@gmail.com',options:{shouldCreateUser:false,emailRedirectTo:'https://camnasiodavide-cmyk.github.io/monitoraggio-mines/'}});
            loginMsg.textContent=r.error?'Errore: '+r.error.message:'Link inviato. Controlla la tua email.';
          };
          login.appendChild(b);
        }
      }
    },0);
  });
})();