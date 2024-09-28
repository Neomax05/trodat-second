//modals
const deleteAccountModal = document.getElementById('delete-account-modal');

// button
const deleteAccountButton = document.getElementById('delete-account-button');
const deleteAccountModalDeleteButton = document.getElementById(
  'delete-account-modal-delete-button'
);
const deleteAccountModalCancelButton = document.getElementById(
  'delete-account-modal-cancel-button'
);

//icons
const closeDeleteAccountModal = document.getElementById(
  'close-delete-account-modal'
);

// ________________________________________
// handlers

const handleOpenModalDeleteAccount = () => {
  deleteAccountModal.style.display = 'block';
  backdrop.style.display = 'block';
};

////___________________________

deleteAccountButton.addEventListener('click', handleOpenModalDeleteAccount);

closeDeleteAccountModal.addEventListener('click', handleBackdrop);

deleteAccountModalDeleteButton.addEventListener('click', () => {
  fetchAuthLogin({ isAuth: false });

  handleBackdrop();
  initializationLogin();
});
deleteAccountModalCancelButton.addEventListener('click', handleBackdrop);
