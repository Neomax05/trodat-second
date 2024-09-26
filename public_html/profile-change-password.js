//buttons
const profileActionChangePassword = document.getElementById(
  'profile-action-change-password'
);

// inputs
const changePasswordModalPhoneNumberInput = document.getElementById(
  'change-password-modal-phone-number-input'
);
const changePasswordModalCodeInput = document.getElementById(
  'change-password-modal-code-input'
);
const signUpChangePasswordInput = document.getElementById(
  'sign-up-change-password-input'
);
const signUpChangeConfirmPasswordInput = document.getElementById(
  'sign-up-change-confirm-password-input'
);

// modals
const changePasswordModal = document.getElementById('change-password-modal');

//backdrop

const handleOpenModal = () => {
  changePasswordModal.style.display = 'flex';
  backdrop.style.display = 'block';
};

// forms
const changePasswordModalFirstModal = document.getElementById(
  'change-password-modal-first-modal'
);
const changePasswordModalSecondModal = document.getElementById(
  'change-password-modal-second-modal'
);
const changePasswordModalThirthModal = document.getElementById(
  'change-password-modal-thirth-modal'
);

// slider
const changePasswordModalSlider = document.getElementById(
  'change-password-modal-slider'
);

//actions
const closeChangePasswordModal = document.getElementById(
  'close-change-password-modal'
);
const closeChangePasswordModal2 = document.getElementById(
  'close-change-password-modal-2'
);
const closeChangePasswordModal3 = document.getElementById(
  'close-change-password-modal-3'
);

// send code

const SendCodeAgainViaTime = document.getElementById(
  'send-code-again-via-time'
);
const SendCodeAgainVia = document.getElementById('send-code-again-via');

const sendCodeAgainText = document.getElementById('send-code-again-text');

const startTimer = (initialSeconds) => {
  let seconds = initialSeconds;

  const changeTimer = () => {
    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format the remaining seconds to always show two digits
    const formattedTime = `${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;

    // Update the text content of the element with the current time
    SendCodeAgainViaTime.textContent = formattedTime;

    // Decrease the seconds
    seconds--;

    // Stop the timer when it reaches 0
    if (seconds < 0) {
      clearInterval(timerInterval);
      sendCodeAgainText.style.display = 'block';
      SendCodeAgainVia.style.display = 'none';
    }
  };

  // Call the function every second
  const timerInterval = setInterval(changeTimer, 1000);
};

const verifyUrl = 'http://212.67.8.153:3011/api/verification';

const sendCodeWithPhoneNumberAsync = async (values) => {
  try {
    const response = await fetch(`${verifyUrl}/send-code`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();

    console.log(result);

    if (!result.error) {
      changePasswordModalSlider.style.transform = 'translateX(-100%)';
      startTimer(60);
    }
  } catch (error) {
    console.log(error);
    throw new Error('error');
  }
};

const verifyCodeWithPhoneNumberAsync = async (values) => {
  try {
    const response = await fetch(`${verifyUrl}/verify-code`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();

    console.log(result);

    if (!result.error) {
      changePasswordModalSlider.style.transform = 'translateX(-200%)';
    }
  } catch (error) {
    console.log(error);
    throw new Error('error');
  }
};

const changePasswordAsync = async (values) => {
  try {
    const response = await fetch(`${url}/change-password`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();

    console.log(result);

    if (!result.error) {
      handleBackdrop();
    }
  } catch (error) {
    console.log(error);
    throw new Error('error');
  }
};

profileActionChangePassword.addEventListener('click', () => {
  handleOpenModal();
});

changePasswordModalFirstModal.addEventListener('submit', async (e) => {
  e.preventDefault();

  const phone_number = changePasswordModalPhoneNumberInput.value;

  const regexPhoneNumber = /^\+\d{9,15}$/;

  if (!regexPhoneNumber.test(phone_number)) {
    return;
  }

  await sendCodeWithPhoneNumberAsync({ phone_number });
});

changePasswordModalSecondModal.addEventListener('submit', async (e) => {
  e.preventDefault();

  const phone_number = changePasswordModalPhoneNumberInput.value;
  const code = changePasswordModalCodeInput.value;

  const regexPhoneNumber = /^\+\d{9,15}$/;
  const regexCode = /^\d{4}$/;

  if (!regexPhoneNumber.test(phone_number)) {
    return;
  }

  if (!regexCode.test(code)) {
    return;
  }

  await verifyCodeWithPhoneNumberAsync({ phone_number, code });
});
changePasswordModalThirthModal.addEventListener('submit', async (e) => {
  e.preventDefault();

  const phone_number = changePasswordModalPhoneNumberInput.value;
  const password = signUpChangePasswordInput.value;
  const confirmPassword = signUpChangeConfirmPasswordInput.value;

  const regexPhoneNumber = /^\+\d{9,15}$/;

  if (!regexPhoneNumber.test(phone_number)) {
    return;
  }

  if (password !== confirmPassword) {
    return;
  }

  await changePasswordAsync({ phone_number, password });
});

sendCodeAgainText.addEventListener('click', () => {
  SendCodeAgainViaTime.textContent = '1:00';
  startTimer(60);
  sendCodeAgainText.style.display = 'none';
  SendCodeAgainVia.style.display = 'block';
});

closeChangePasswordModal.addEventListener('click', handleBackdrop);
closeChangePasswordModal2.addEventListener('click', handleBackdrop);
closeChangePasswordModal3.addEventListener('click', handleBackdrop);
