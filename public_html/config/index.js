const config = {
  apiUrl: 'https://trodat-kg.onrender.com',
  // apiUrl: 'http://localhost:8080'
};

function generateUrlParams(params) {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
}

async function fetchWithAuth({ url, method = 'GET', body, params }) {
  const LOCALSTORAGE_KEY = 'LOCALSTORAGE_KEY';

  const urlParam = generateUrlParams(params);

  const values = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

  const token = values.access_token;
  try {
    const response = await fetch(`${url}${urlParam}`, {
      body,
      headers: {
        Authorization: `Bearer ${token}`, // Authorization header with to
        'Content-Type': 'application/json', // adjust as needed
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
