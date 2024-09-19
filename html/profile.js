// Element Selectors
const profileUnauthenticated = document.getElementById('unauthented');
const profileAuthenticated = document.getElementById('authented');

const signInButton = document.getElementById('sign-in');
const signUpButton = document.getElementById('sign-up');

const signInModal = document.getElementById('sign-in-modal');
const signUpModal = document.getElementById('sign-up-modal');

const modalSlider = document.getElementById('modal-slider');
const backdrop = document.getElementById('backdrop');

// profile info
const profileInfoTitle = document.getElementById('profile-info-title');
const profileInfoPhoneNumberValue = document.getElementById(
  'profile-info-phone-number-value'
);
const profileInfoEmailValue = document.getElementById(
  'profile-info-email-value'
);
const profileActionLogOut = document.getElementById('profile-action-log-out');

// Form fields
const signUpFullNameInput = document.getElementById('sign-up-full-name-input');
const signUpEmailInput = document.getElementById('sign-up-email-input');
const signUpPhoneNumberInput = document.getElementById(
  'sign-up-phone-number-input'
);
const signUpPasswordInput = document.getElementById('sign-up-password-input');
const signUpConfirmPasswordInput = document.getElementById(
  'sign-up-confirm-password-input'
);
const userAvatarInput = document.getElementById('user-avatar-input');

const signInEmail = document.getElementById('sign-in-email');
const signInPassword = document.getElementById('sign-in-password');

// Form buttons
const signInModalFieldsSubmit = document.getElementById(
  'sign-up-modal-fields-submit'
);
const signInModalFieldsNext = document.getElementById(
  'sign-up-modal-fields-next'
);
const signInModalFieldsSignIn = document.getElementById(
  'sign-in-modal-fields-sign-in'
);

// Form helpers
const signUpSecondHelperText = document.getElementById(
  'sign-up-second-helper-text'
);

// Form submission
const signUpModalFieldsFirstForm = document.getElementById(
  'sign-up-modal-fields-first-form'
);
const signUpModalFieldsSecondForm = document.getElementById(
  'sign-up-modal-fields-second-form'
);
const signInForm = document.getElementById('sign-in-form');

// edit

const profileInfoEdit = document.getElementById('profile-info-edit');

// Helper Functions

// Toggle visibility of authentication states
const toggleAuthState = (isAuthenticated) => {
  profileAuthenticated.style.display = isAuthenticated ? 'flex' : 'none';
  profileUnauthenticated.style.display = isAuthenticated ? 'none' : 'block';
};

// Validate form fields
const validateFields = (fields) =>
  fields.every((field) => field.value.trim() !== '');

// Disable/Enable buttons based on form validation
const toggleButtonState = (button, isValid) => {
  button.disabled = !isValid;
};

// Check SignIn Fields and toggle SignIn button state
const checkSignInFields = () => {
  const isValid = validateFields([signInEmail, signInPassword]);
  toggleButtonState(signInModalFieldsSignIn, isValid);
};

// Check SignUp Fields for 'Next' button
const checkSignUpNextFields = () => {
  const isValid = validateFields([
    signUpFullNameInput,
    signUpEmailInput,
    signUpPhoneNumberInput,
  ]);
  toggleButtonState(signInModalFieldsNext, isValid);
};

// Check SignUp Fields for 'Submit' button
const checkSignUpSubmitFields = () => {
  const isValid = validateFields([
    signUpFullNameInput,
    signUpEmailInput,
    signUpPhoneNumberInput,
    signUpPasswordInput,
    signUpConfirmPasswordInput,
  ]);
  toggleButtonState(signInModalFieldsSubmit, isValid);
};

// Handle backdrop and close modals
const handleBackdrop = () => {
  signInModal.style.display = 'none';
  signUpModal.style.display = 'none';
  backdrop.style.display = 'none';
  changePasswordModal.style.display = 'none';
  modalSlider.style.transform = 'translateX(0)';
};

const LOCALSTORAGE_KEY = 'LOCALSTORAGE_KEY';

// Initialize login state
const initializationLogin = () => {
  const values = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
  const isAuth = values?.isAuth;

  toggleAuthState(isAuth);

  renderUserInfo(values);
};

//

const fetchAuthLogin = async (values) => {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(values));
  } catch (error) {
    console.log(error);
  }
};

// render user info

const renderUserInfo = (values) => {
  const fullName = values.fullName;
  const email = values.email;
  const phoneNumber = values.phoneNumber;
  const avatar = values.avatar;

  profileInfoTitle.innerHTML = fullName;
  profileInfoPhoneNumberValue.innerHTML = phoneNumber;
  profileInfoEmailValue.innerHTML = email;
  if (avatar) userAvatarInput.setAttribute('src', avatar);
};

// Add Event Listeners

const signInModalOpen = () => {
  signInModal.style.display = 'flex';
  backdrop.style.display = 'block';
};

const signInModalClose = () => {
  signInModal.style.display = 'none';
};

const signUpModalOpen = () => {
  signUpModal.style.display = 'flex';
  backdrop.style.display = 'block';
};

const signUpModalClose = () => {
  signUpModal.style.display = 'none';
};

signInButton.addEventListener('click', () => {
  signInModalOpen();
  signUpModalClose();
});

signUpButton.addEventListener('click', () => {
  signUpModalOpen();
  signInModalClose();
  signUpModalFieldsFirstForm.setAttribute('name', 'next');
});

backdrop.addEventListener('click', handleBackdrop);

// Form validation event listeners
[signUpFullNameInput, signUpEmailInput, signUpPhoneNumberInput].forEach(
  (input) => {
    input.addEventListener('input', checkSignUpNextFields);
  }
);

[signUpPasswordInput, signUpConfirmPasswordInput].forEach((input) => {
  input.addEventListener('input', checkSignUpSubmitFields);
});

signInEmail.addEventListener('input', checkSignInFields);
signInPassword.addEventListener('input', checkSignInFields);

// Form submission events

const signUpModalFieldsFirstFormHandler = (reason = 'next') => {
  if (reason === 'next') {
    modalSlider.style.transform = 'translateX(-100%)';

    return;
  }

  const values = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

  signUpFullNameInput.setAttribute('value', values.fullName || '');
  signUpEmailInput.setAttribute('value', values.email || '');
  signUpPhoneNumberInput.setAttribute('value', values.phoneNumber || '');
};

// submittings

signUpModalFieldsFirstForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.name;
  if (name === 'next') {
    signUpModalFieldsFirstFormHandler();
    return;
  }

  const values = {
    fullName: signUpFullNameInput.value,
    email: signUpEmailInput.value,
    phoneNumber: signUpPhoneNumberInput.value,
    isAuth: true,
  };

  renderUserInfo(values);

  fetchAuthLogin(values);
  handleBackdrop();
});

signUpModalFieldsSecondForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (signUpPasswordInput.value !== signUpConfirmPasswordInput.value) {
    signUpSecondHelperText.innerHTML = 'Password does not match';
    return;
  }

  signUpSecondHelperText.innerHTML = '';

  const values = {
    fullName: signUpFullNameInput.value,
    email: signUpEmailInput.value,
    phoneNumber: signUpPhoneNumberInput.value,
    password: signUpPasswordInput.value,
    isAuth: true,
  };

  renderUserInfo(values);

  fetchAuthLogin(values);
  toggleAuthState(true);
  handleBackdrop();
});

signInForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const values = {
    email: signInEmail.value,
    password: signInPassword.value,
    isAuth: true,
  };

  fetchAuthLogin(values);
  renderUserInfo(values);
  toggleAuthState(true);
  handleBackdrop();
});

profileInfoEdit.addEventListener('click', () => {
  signUpModalFieldsFirstForm.setAttribute('name', 'edit');
  signUpModalFieldsFirstFormHandler('edit');
  signUpModalOpen();
  signInModalClose();
});

profileActionLogOut.addEventListener('click', () => {
  const values = { isAuth: false };
  fetchAuthLogin(values);

  initializationLogin();
});

// Initialize authentication state
initializationLogin();
