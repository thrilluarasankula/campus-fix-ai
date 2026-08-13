function adminLoginPage(e){
  e.preventDefault();
  const email=document.getElementById('email').value.trim(),pass=document.getElementById('password').value;
  if(email===ADMIN.email&&pass===ADMIN.password){sessionStorage.setItem('campusfix_user',JSON.stringify({role:'admin',email}));location.href='admin.html'}
  else document.getElementById('msg').textContent='Invalid admin credentials.';
}
