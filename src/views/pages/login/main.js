const $loginEmail = document.querySelector('.login-email');
const $loginPassword = document.querySelector('.login-pw');
const $loginBtn = document.querySelector('.login-btn');

const postAPI = async (url, obj) => {
  return (
    await fetch(`${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    })
  ).json();
};

// verification chk
/*


*/

const routeToken = async (url, token) => {};

const changeLocation = (url) => {
  location.href = `${url}`;
};

// 로그인 요청
$loginBtn.addEventListener('click', async (e) => {
  let token = '';
  sessionStorage.removeItem('token');

  e.preventDefault();

  let headerObj = {
    email: $loginEmail.value,
    password: $loginPassword.value,
  };

  let data = await postAPI('/api/login', headerObj);
  if (data.isAdmin) {
    token = data.token;
    sessionStorage.setItem('token', token);
    alert('관리자 유저 로그인 성공');
    changeLocation('/admin');
  } else if (!data.isAdmin) {
    token = data.token;

    // 토큰도 같이 저장해주기~
    sessionStorage.setItem('token', token);
    alert('일반 유저 로그인 성공');
    changeLocation('/');
  } else {
    alert('로그인 실패');
  }
  // input 초기화
  $loginEmail.value = '';
  $loginPassword.value = '';
});
