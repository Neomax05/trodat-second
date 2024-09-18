// Element Selectors
const profileUnauthenticated = document.getElementById('unauthented');
const profileAuthenticated = document.getElementById('authented');

const signInButton = document.getElementById('sign-in');
const signUpButton = document.getElementById('sign-up');

const signInModal = document.getElementById('sign-in-modal');
const signUpModal = document.getElementById('sign-up-modal');

const modalSlider = document.getElementById('modal-slider');
const backdrop = document.getElementById('backdrop');

// Form fields
const signUpFullNameInput = document.getElementById('sign-up-full-name-input');
const signUpEmailInput = document.getElementById('sign-up-email-input');
const signUpPhoneNumberInput = document.getElementById(
  'sign-up-phone-number-input',
);
const signUpPasswordInput = document.getElementById('sign-up-password-input');
const signUpConfirmPasswordInput = document.getElementById(
  'sign-up-confirm-password-input',
);

const signInEmail = document.getElementById('sign-in-email');
const signInPassword = document.getElementById('sign-in-password');

// Form buttons
const signInModalFieldsSubmit = document.getElementById(
  'sign-up-modal-fields-submit',
);
const signInModalFieldsNext = document.getElementById(
  'sign-up-modal-fields-next',
);
const signInModalFieldsSignIn = document.getElementById(
  'sign-in-modal-fields-sign-in',
);

// Form helpers
const signUpSecondHelperText = document.getElementById(
  'sign-up-second-helper-text',
);

// Form submission
const signUpModalFieldsFirstForm = document.getElementById(
  'sign-up-modal-fields-first-form',
);
const signUpModalFieldsSecondForm = document.getElementById(
  'sign-up-modal-fields-second-form',
);
const signInForm = document.getElementById('sign-in-form');

let isAuth = false;

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
  modalSlider.style.transform = 'translateX(0)';
};

// Initialize login state
const initializationLogin = () => {
  toggleAuthState(isAuth);
};

// Add Event Listeners

signInButton.addEventListener('click', () => {
  signInModal.style.display = 'flex';
  signUpModal.style.display = 'none';
  backdrop.style.display = 'block';
});

signUpButton.addEventListener('click', () => {
  signInModal.style.display = 'none';
  signUpModal.style.display = 'flex';
  backdrop.style.display = 'block';
});

backdrop.addEventListener('click', handleBackdrop);

// Form validation event listeners
[signUpFullNameInput, signUpEmailInput, signUpPhoneNumberInput].forEach(
  (input) => {
    input.addEventListener('input', checkSignUpNextFields);
  },
);

[signUpPasswordInput, signUpConfirmPasswordInput].forEach((input) => {
  input.addEventListener('input', checkSignUpSubmitFields);
});

signInEmail.addEventListener('input', checkSignInFields);
signInPassword.addEventListener('input', checkSignInFields);

// Form submission events

signUpModalFieldsFirstForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  modalSlider.style.transform = 'translateX(-100%)';
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
  };

  console.log(values);
  toggleAuthState(true);
  handleBackdrop();
});

signInForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const values = {
    email: signInEmail.value,
    password: signInPassword.value,
  };

  console.log(values);
  toggleAuthState(true);
  handleBackdrop();
});

// Initialize authentication state
initializationLogin();
