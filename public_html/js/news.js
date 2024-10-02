const getNewsAsync = async () => {
  try {
    const result = await fetchWithAuth({
      url: `${config.apiUrl}/api/news`,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
getNewsAsync();
