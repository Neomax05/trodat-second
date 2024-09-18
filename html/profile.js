const profileUnauthenticated = document.getElementById("unauthented")
const profileAuthenticated = document.getElementById("authented")

const signInButton = document.getElementById("sign-in")
const signUpButton = document.getElementById("sign-up")

const signInModal = document.getElementById("sign-in-modal")
const signUpModal = document.getElementById("sign-up-modal")

const modalSlider = document.getElementById("modal-slider")

const signInModalFieldsSubmit = document.getElementById(
   "sign-up-modal-fields-submit"
)

// helpers

const signUpSecondHelperText = document.getElementById(
   "sign-up-second-helper-text"
)

//forms
const signUpModalFieldsFirstForm = document.getElementById(
   "sign-up-modal-fields-first-form"
)
const signUpModalFieldsSecondForm = document.getElementById(
   "sign-up-modal-fields-second-form"
)
const signInForm = document.getElementById("sign-in-form")

//fiels
const signUpFullNameInput = document.getElementById("sign-up-full-name-input") //sign-up-confirm-password-input
const signUpEmailInput = document.getElementById("sign-up-email-input")
const signUpPhoneNumberInput = document.getElementById(
   "sign-up-phone-number-input"
)
const signUpPasswordInput = document.getElementById("sign-up-password-input")
const signUpConfirmPasswordInput = document.getElementById(
   "sign-up-confirm-password-input" //sign-up-confirm-password-input
)

const signInEmail = document.getElementById("sign-in-email")
const signInPassword = document.getElementById("sign-in-password")

//labels
const signUpFullNameInputLabel = document.getElementById(
   "sign-up-full-name-input-label"
)

//buttons
const signInModalFieldsNext = document.getElementById(
   "sign-up-modal-fields-next"
)
const signInModalFieldsSignIn = document.getElementById(
   "sign-in-modal-fields-sign-in"
)

const backdrop = document.getElementById("backdrop")

const isAuth = false

const checkSignInFields = () => {
   const signInEmailValue = signInEmail.value.trim()
   const signInPasswordValue = signInPassword.value.trim()

   if (signInEmailValue && signInPasswordValue) {
      signInModalFieldsSignIn.disabled = false
   } else {
      signInModalFieldsSignIn.disabled = true
   }
}

function checkFieldsNext() {
   const signUpFullNameInputValue = signUpFullNameInput.value.trim()
   const signUpEmailInputValue = signUpEmailInput.value.trim()
   const signUpPhoneNumberInputValue = signUpPhoneNumberInput.value.trim()

   // Check if all input fields have values
   if (
      signUpFullNameInputValue &&
      signUpEmailInputValue &&
      signUpPhoneNumberInputValue
   ) {
      signInModalFieldsNext.disabled = false // Enable the button
   } else {
      signInModalFieldsNext.disabled = true // Disable the button
   }
}

function checkFields() {
   const signUpFullNameInputValue = signUpFullNameInput.value.trim()
   const signUpEmailInputValue = signUpEmailInput.value.trim()
   const signUpPhoneNumberInputValue = signUpPhoneNumberInput.value.trim()
   const signUpPasswordInputValue = signUpPasswordInput.value.trim()
   const signUpConfirmPasswordInputValue =
      signUpConfirmPasswordInput.value.trim()

   // Check if all input fields have values
   if (
      signUpFullNameInputValue &&
      signUpEmailInputValue &&
      signUpPhoneNumberInputValue &&
      signUpPasswordInputValue &&
      signUpConfirmPasswordInputValue
   ) {
      signInModalFieldsSubmit.disabled = false // Enable the button
   } else {
      signInModalFieldsSubmit.disabled = true // Disable the button
   }
}

const hiddenAuthenticated = () => {
   profileAuthenticated.style.display = "none"
   profileUnauthenticated.style.display = "block"
}

const hiddenUnauthenticated = () => {
   profileAuthenticated.style.display = "flex"
   profileUnauthenticated.style.display = "none"
}

const handleBackdrop = () => {
   signInModal.style.display = "none"
   signUpModal.style.display = "none"

   backdrop.style.display = "none"
   modalSlider.style.transform = "translateX(0)"
}

const initializationLogin = async () => {
   console.log("login")

   if (isAuth) {
      hiddenUnauthenticated()
   } else {
      hiddenAuthenticated()
   }
}

signInButton.addEventListener("click", ({target}) => {
   signInModal.style.display = "flex"
   signUpModal.style.display = "none"
   backdrop.style.display = "block"
})

signUpButton.addEventListener("click", ({target}) => {
   signInModal.style.display = "none"
   signUpModal.style.display = "flex"
   backdrop.style.display = "block"
})

backdrop.addEventListener("click", handleBackdrop)

signUpFullNameInput.addEventListener("input", checkFieldsNext)

signUpEmailInput.addEventListener("input", checkFieldsNext)

signUpPhoneNumberInput.addEventListener("input", checkFieldsNext)

signUpPasswordInput.addEventListener("input", checkFields)

signUpConfirmPasswordInput.addEventListener("input", checkFields)

signUpModalFieldsFirstForm?.addEventListener("submit", e => {
   e.preventDefault()

   modalSlider.style.transform = "translateX(-100%)"
})

signUpModalFieldsSecondForm.addEventListener("submit", async e => {
   e.preventDefault()

   const signUpFullNameInputValue = signUpFullNameInput.value
   const signUpEmailInputValue = signUpEmailInput.value
   const signUpPhoneNumberInputValue = signUpPhoneNumberInput.value
   const signUpPasswordInputValue = signUpPasswordInput.value
   const signUpConfirmPasswordInputValue = signUpConfirmPasswordInput.value

   if (signUpPasswordInputValue !== signUpConfirmPasswordInputValue) {
      signUpSecondHelperText.innerHTML = "password is not match"
      return
   }

   signUpSecondHelperText.innerHTML = ""

   const values = {
      fullName: signUpFullNameInputValue,
      email: signUpEmailInputValue,
      phoneNumber: signUpPhoneNumberInputValue,
      password: signUpPasswordInputValue
   }

   console.log(values)
   hiddenUnauthenticated()
   handleBackdrop()
})

// sign in

signInEmail.addEventListener("input", checkSignInFields)
signInPassword.addEventListener("input", checkSignInFields)

signInForm.addEventListener("submit", async e => {
   e.preventDefault()

   const signInEmailValue = signInEmail.value
   const signInPasswordValue = signInPassword.value

   const values = {
      email: signInEmailValue,
      password: signInPasswordValue
   }
   console.log(values)
   hiddenUnauthenticated()
   handleBackdrop()
})

initializationLogin()
