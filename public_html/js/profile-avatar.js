const userAvatarUploadCamera = document.getElementById(
  'user-avatar-upload-camera'
);

function generateUrlParamsUser(params) {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
}

async function fetchWithUserAuth({
  url,
  method = 'GET',
  body,
  params,
  headers = {},
}) {
  const LOCALSTORAGE_KEY = 'LOCALSTORAGE_KEY';

  const urlParam = generateUrlParamsUser(params);

  const values = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

  const token = values.access_token;
  try {
    const response = await fetch(`${url}${urlParam}`, {
      method: method, // or 'POST', 'PUT', etc.
      body,
      headers: {
        Authorization: `Bearer ${token}`, // Authorization header with token
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

const uploadUserAvatarAsync = async (image) => {
  const LOCALSTORAGE_KEY = 'LOCALSTORAGE_KEY';

  const values = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
  try {
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    const result = await fetchWithUserAuth({
      url: `${config.apiUrl}/api/users/upload`,
      method: 'PUT',
      body: formData,
      headers: {},
    });
    console.log(result);
    renderUserInfo(result);
    localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify({ ...values, ...result })
    );
  } catch (error) {
    console.log(error);
  }
};

userAvatarUploadCamera.addEventListener('input', ({ target }) => {
  const value = target.files[0];

  const reader = new FileReader();

  reader.onload = async function (e) {
    const result = e.target.result;

    if (!result) {
      alert('avatar not upload');
      return;
    }

    await uploadUserAvatarAsync(value);
  };

  reader.readAsDataURL(value);
});
