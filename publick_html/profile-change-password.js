//buttons
const profileActionChangePassword = document.getElementById(
  'profile-action-change-password'
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

profileActionChangePassword.addEventListener('click', () => {
  handleOpenModal();
});

changePasswordModalFirstModal.addEventListener('submit', (e) => {
  e.preventDefault();
  changePasswordModalSlider.style.transform = 'translateX(-100%)';
  startTimer(60);
});

changePasswordModalSecondModal.addEventListener('submit', (e) => {
  e.preventDefault();
  changePasswordModalSlider.style.transform = 'translateX(-200%)';
});
changePasswordModalThirthModal.addEventListener('submit', (e) => {
  e.preventDefault();
  handleBackdrop();
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
