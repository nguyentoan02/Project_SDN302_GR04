// /js/panda.js
document.addEventListener('DOMContentLoaded', () => {
  let usernameRef = document.getElementById('loginUsername');
  let passwordRef = document.getElementById('loginPassword');
  let registerUsernameRef = document.getElementById('registerUsername');
  let emailRef = document.getElementById('email');
  let registerPasswordRef = document.getElementById('registerPassword');
  let confirmPasswordRef = document.getElementById('confirmPassword');
  let toggleLoginPassword = document.getElementById('toggleLoginPassword');
  let toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
  let toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  let loginForm = document.getElementById('loginForm');
  let registerForm = document.getElementById('registerForm');
  let loginSection = document.getElementById('loginSection');
  let registerSection = document.getElementById('registerSection');
  let showRegister = document.getElementById('showRegister');
  let showLogin = document.getElementById('showLogin');
  let messageDiv = document.getElementById('message');
  let eyeL = document.querySelector('.eyeball-l');
  let eyeR = document.querySelector('.eyeball-r');
  let handL = document.querySelector('.hand-l');
  let handR = document.querySelector('.hand-r');
  let pandaFace = document.querySelector('.panda-face');
  let blushL = document.querySelector('.blush-l');
  let blushR = document.querySelector('.blush-r');

  // Hiệu ứng mắt và tay
  window.normalEyeStyle = function () {
    eyeL.style.opacity = '1';
    eyeR.style.opacity = '1';
    eyeL.style.cssText = 'left: 0.6em; top: 0.6em; opacity: 1;';
    eyeR.style.cssText = 'right: 0.6em; top: 0.6em; opacity: 1;';
  };

  window.closeEyeStyle = function () {
    eyeL.style.opacity = '0';
    eyeR.style.opacity = '0';
  };

  window.normalHandStyle = function () {
    handL.style.cssText = `
      height: 2.81em;
      top: 7.4em;
      left: 7.5em;
      transform: rotate(0deg);
    `;
    handR.style.cssText = `
      height: 2.81em;
      top: 7.4em;
      right: 7.5em;
      transform: rotate(0deg);
    `;
  };

  window.coverEyeStyle = function () {
    handL.style.cssText = `
      height: 6.56em;
      top: 2.87em;
      left: 11.75em;
      transform: rotate(-155deg);
    `;
    handR.style.cssText = `
      height: 6.56em;
      top: 2.87em;
      right: 11.75em;
      transform: rotate(155deg);
    `;
  };

  // Hiệu ứng đỏ mặt và rung
  window.errorStyle = function () {
    blushL.classList.add('red');
    blushR.classList.add('red');
    pandaFace.classList.add('shake');
    setTimeout(() => {
      blushL.classList.remove('red');
      blushR.classList.remove('red');
      pandaFace.classList.remove('shake');
    }, 1000);
  };

  // Hiện thông báo
  window.showMessage = function (text, type) {
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    messageDiv.className = `thought-bubble ${type}`;
  };

  // Xóa thông báo
  window.clearMessage = function () {
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';
  };

  // Hàm gọi API với token
  window.fetchWithToken = async function (url, method = 'GET') {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token);
    if (!token) {
      showMessage('Please login first', 'error');
      errorStyle();
      return null;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const contentType = response.headers.get('Content-Type');
      console.log('Response Content-Type:', contentType);
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, received: ${text.slice(0, 50)}...`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      showMessage(error.message || 'Something went wrong', 'error');
      errorStyle();
      console.error('Fetch error:', error.message);
      return null;
    }
  };

  // Toggle giữa login và register
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    normalEyeStyle();
    normalHandStyle();
    clearMessage();
  });

  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    normalEyeStyle();
    normalHandStyle();
    clearMessage();
  });

  // Focus vào các input
  usernameRef.addEventListener('focus', () => {
    eyeL.style.cssText = 'left: 0.75em; top: 1.12em; opacity: 1;';
    eyeR.style.cssText = 'right: 0.75em; top: 1.12em; opacity: 1;';
    normalHandStyle();
  });

  passwordRef.addEventListener('focus', () => {
    closeEyeStyle();
    normalHandStyle();
  });

  passwordRef.addEventListener('input', () => {
    closeEyeStyle();
  });

  registerUsernameRef.addEventListener('focus', () => {
    eyeL.style.cssText = 'left: 0.75em; top: 1.12em; opacity: 1;';
    eyeR.style.cssText = 'right: 0.75em; top: 1.12em; opacity: 1;';
    normalHandStyle();
  });

  emailRef.addEventListener('focus', () => {
    eyeL.style.cssText = 'left: 0.75em; top: 1.12em; opacity: 1;';
    eyeR.style.cssText = 'right: 0.75em; top: 1.12em; opacity: 1;';
    normalHandStyle();
  });

  registerPasswordRef.addEventListener('focus', () => {
    closeEyeStyle();
    normalHandStyle();
  });

  registerPasswordRef.addEventListener('input', () => {
    closeEyeStyle();
  });

  confirmPasswordRef.addEventListener('focus', () => {
    closeEyeStyle();
    normalHandStyle();
  });

  confirmPasswordRef.addEventListener('input', () => {
    closeEyeStyle();
  });

  // Toggle password visibility
  toggleLoginPassword.addEventListener('click', () => {
    if (passwordRef.type === 'password') {
      passwordRef.type = 'text';
      toggleLoginPassword.textContent = '🙈';
      coverEyeStyle();
      normalEyeStyle();
    } else {
      passwordRef.type = 'password';
      toggleLoginPassword.textContent = '👁️';
      normalHandStyle();
      normalEyeStyle();
    }
  });

  toggleRegisterPassword.addEventListener('click', () => {
    if (registerPasswordRef.type === 'password') {
      registerPasswordRef.type = 'text';
      toggleRegisterPassword.textContent = '🙈';
      coverEyeStyle();
      normalEyeStyle();
    } else {
      registerPasswordRef.type = 'password';
      toggleRegisterPassword.textContent = '👁️';
      normalHandStyle();
      normalEyeStyle();
    }
  });

  toggleConfirmPassword.addEventListener('click', () => {
    if (confirmPasswordRef.type === 'password') {
      confirmPasswordRef.type = 'text';
      toggleConfirmPassword.textContent = '🙈';
      coverEyeStyle();
      normalEyeStyle();
    } else {
      confirmPasswordRef.type = 'password';
      toggleConfirmPassword.textContent = '👁️';
      normalHandStyle();
      normalEyeStyle();
    }
  });

  // Khi click ngoài input
  document.addEventListener('click', (e) => {
    let clickedElem = e.target;
    if (
      clickedElem != usernameRef &&
      clickedElem != passwordRef &&
      clickedElem != registerUsernameRef &&
      clickedElem != emailRef &&
      clickedElem != registerPasswordRef &&
      clickedElem != confirmPasswordRef &&
      clickedElem != toggleLoginPassword &&
      clickedElem != toggleRegisterPassword &&
      clickedElem != toggleConfirmPassword
    ) {
      normalEyeStyle();
      normalHandStyle();
    }
  });

  // Hàm đăng xuất
  window.logout = function () {
    localStorage.removeItem('token');
    showMessage('Logout successful!', 'success');
    setTimeout(() => {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      window.location.href = '/';
    }, 1000);
  };

  // Gắn sự kiện đăng xuất
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});
