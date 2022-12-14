import userService from '/public/scripts/userService.js';
import { loggedInOnlyPageProtector } from '/public/scripts/common.js';
import { errorUtil } from '/public/scripts/util.js';

const createUserSection = ({ fullName, email, phoneNumber }) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
        <div>
          <label>사용자명</label>
          <input type="text" class="username" value="${fullName}" readonly></input>
        </div>
        <div>
          <label>이메일</label>
          <input class="email" value="${email}" readonly></input>
        </div>
        <div>
          <label>전화번호:</label>
          ${
            phoneNumber
              ? `<input type="text" class="phone" value="${phoneNumber}"
            placeholder="-없이 번호만 입력해주세요" />`
              : `<input type="text" class="phone" placeholder="-없이 번호만 입력해주세요" />`
          }
        </div>
    `;
  return wrapper;
};

const passwordEditBtnEventHandler = (e) => {
  e.target.disabled = true;
  if (confirm('비밀번호를 변경하시겠습니까?')) {
    location.href = '/password-edit';
  }
  e.target.disabled = false;
  return;
};

const signOutEventHandler = async (e) => {
  e.preventDefault();
  e.target.disabled = true;
  if (confirm('정말 탈퇴하시겠습니까?')) {
    const response = await userService.deleteUser();
    if (response.acknowledged) {
      alert('탈퇴가 완료되었습니다.');
      sessionStorage.removeItem('token');
      location.href = '/';
    }
  }
  e.target.disabled = false;
  return;
};

const profileEditSubmitEventHandler = async (e) => {
  e.preventDefault();
  const phoneNumberInput = document.querySelector('.phone');
  const addressLongInput = document.querySelector('.address_long');
  const addressDetailInput = document.querySelector('.address_detail');
  const postalCodeInput = document.querySelector('.postal_code');
  const currentPasswordInput = document.querySelector('.password');

  const toUpdateObj = {
    address: {
      address1: addressLongInput.value,
      address2: addressDetailInput.value,
      postalCode: postalCodeInput.value,
    },
    phoneNumber: phoneNumberInput.value,
    currentPassword: currentPasswordInput.value,
  };
  if (errorUtil.isValidPhoneNumber(toUpdateObj.phoneNumber)) {
    const response = await userService.updateUserInformation(toUpdateObj);
    if (response._id) {
      alert('수정이 완료되었습니다');
      location.href = '/profile';
    }
  } else {
    alert('휴대전화번호 형식이 맞지 않습니다');
    phoneNumberInput.focus();
  }
};

const init = async () => {
  loggedInOnlyPageProtector();
  const user = await userService.getCurrentUser();

  const profileEditForm = document.querySelector('.profile_edit');
  profileEditForm.addEventListener('submit', profileEditSubmitEventHandler);

  const signOutBtn = document.querySelector('.sign_out');
  signOutBtn.addEventListener('click', signOutEventHandler);

  const passwordEditBtn = document.querySelector('.password_edit');
  passwordEditBtn.addEventListener('click', passwordEditBtnEventHandler);

  const profileWrapper = document.querySelector('.profile');
  profileWrapper.innerHTML = '';
  profileWrapper.appendChild(createUserSection(user));

  const addressLongInput = document.querySelector('.address_long');
  const addressDetailInput = document.querySelector('.address_detail');
  const postalCodeInput = document.querySelector('.postal_code');

  if (user.address) {
    const { address1, address2, postalCode } = user.address;
    addressLongInput.value = address1;
    addressDetailInput.value = address2;
    postalCodeInput.value = postalCode;
  }

  const addressSearchBtn = document.querySelector('.address_search');
  addressSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: ({ zonecode, address }) => {
        addressLongInput.value = address;
        postalCodeInput.value = zonecode;
        addressDetailInput.disabled = false;
        addressDetailInput.focus();
        addressDetailInput.placeholder = '상세주소를 입력해주세요';
      },
    }).open();
  });
};

document.addEventListener('DOMContentLoaded', init);
