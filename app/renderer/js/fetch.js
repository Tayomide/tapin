async function fetchWithAuth(url, options = {}) {
  const token = await window?.electronAPI.getToken();

  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  return fetch(`${window.env.SERVER}${url}`, {
    ...options,
    headers
  });
}

export { fetchWithAuth }