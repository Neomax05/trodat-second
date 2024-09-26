const userAvatarUploadCamera = document.getElementById(
  'user-avatar-upload-camera'
);

userAvatarUploadCamera.addEventListener('input', ({ target }) => {
  const value = target.files[0];

  const reader = new FileReader();

  reader.onload = async function (e) {
    const result = e.target.result;

    if (!result) {
      alert('avatar not upload');
      return;
    }

    const values = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

    const newValues = { ...values, avatar: result };

    await changeUserValues(newValues);
    renderUserInfo(newValues);
  };

  reader.readAsDataURL(value);
});
