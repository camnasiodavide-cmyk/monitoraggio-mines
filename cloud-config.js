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
      var C=window.MINES_SB, login=document.getElementById('login'), loginBtn=document.getElementById('loginBtn'), loginMsg=document.getElementById('loginMsg'), app=document.getElementById('app');
      if(!C||!loginBtn)return;
      var session=(await C.auth.getSession()).data.session;

      async function faceUnlock(){
        loginMsg.textContent='Apertura Face ID…';
        try{
          var r=await C.auth.signInWithPasskey();
          if(r.error)throw r.error;
          loginMsg.textContent='';
          login.classList.add('hidden');
          app.classList.remove('hidden');
          return true;
        }catch(e){
          loginMsg.textContent='Accesso non riuscito: '+(e.message||e);
          return false;
        }
      }

      if(!session){
        var p=login.querySelector('p');
        if(p)p.textContent='Accedi in modo sicuro con Face ID.';
        var field=document.getElementById('email'); if(field&&field.parentElement)field.parentElement.style.display='none';
        loginBtn.textContent='Accedi con Face ID';
        loginBtn.onclick=faceUnlock;
        if(!document.getElementById('emailFallback')){
          var b=document.createElement('button');
          b.id='emailFallback'; b.className='cancel'; b.style.marginTop='10px'; b.textContent='Recupero accesso via email';
          b.onclick=async function(){
            loginMsg.textContent='Invio in corso…';
            var r=await C.auth.signInWithOtp({email:'camnasiodavide@gmail.com',options:{shouldCreateUser:false,emailRedirectTo:'https://camnasiodavide-cmyk.github.io/monitoraggio-mines/'}});
            loginMsg.textContent=r.error?'Errore: '+r.error.message:'Link inviato. Controlla la tua email.';
          };
          login.appendChild(b);
        }
      } else {
        try{
          var list=await C.auth.passkey.list();
          var passkeys=list&&list.data;
          if(passkeys&&!Array.isArray(passkeys))passkeys=passkeys.passkeys||passkeys.credentials||passkeys.data||[];
          var hasPasskey=!list.error&&Array.isArray(passkeys)&&passkeys.length>0;
          if(hasPasskey){
            app.classList.add('hidden');
            login.classList.remove('hidden');
            var p2=login.querySelector('p'); if(p2)p2.textContent='Sblocca Monitoraggio Mines+ con Face ID.';
            var f2=document.getElementById('email'); if(f2&&f2.parentElement)f2.parentElement.style.display='none';
            loginBtn.textContent='Sblocca con Face ID';
            loginBtn.onclick=faceUnlock;
            await faceUnlock();
          }else if(app&&!document.getElementById('passkeySetup')){
            var box=document.createElement('div'); box.id='passkeySetup'; box.className='login';
            box.innerHTML='<b>Proteggi l’accesso con Face ID</b><p>Registra una passkey su questo iPhone. È necessario farlo una sola volta.</p><button id="registerFaceId">Attiva Face ID</button><div id="passkeyMsg" class="status" style="margin-top:10px"></div>';
            app.insertBefore(box,app.firstChild);
            document.getElementById('registerFaceId').onclick=async function(){
              var m=document.getElementById('passkeyMsg');m.textContent='Apertura Face ID…';
              try{var r=await C.auth.registerPasskey();if(r.error)throw r.error;box.remove()}catch(e){m.textContent='Errore: '+(e.message||e)}
            };
          }
        }catch(e){}
      }
    },0);
  });
})();