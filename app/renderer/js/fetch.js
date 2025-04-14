async function fetchWithAuth(url, options = {}) {
  const token = await window?.electronApi.getToken();

  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers
  });
}

export { fetchWithAuth }