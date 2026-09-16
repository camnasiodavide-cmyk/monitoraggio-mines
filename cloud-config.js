window.MINES_CLOUD={url:'https://tedkgyaannofgiicowib.supabase.co',key:'sb_publishable_MlCrvJZoYynFByaIDDrKwA_oizkJgJ1'};

// Enable Supabase passkey support. Authentication UI and unlocking are handled by app.html.
(function(){
  if(!window.supabase||!window.supabase.createClient)return;
  var originalCreateClient=window.supabase.createClient;
  window.supabase.createClient=function(url,key,options){
    options=options||{};
    options.auth=Object.assign({persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,experimental:{passkey:true}},options.auth||{});
    options.auth.experimental=Object.assign({passkey:true},options.auth.experimental||{});
    return originalCreateClient(url,key,options);
  };
})();