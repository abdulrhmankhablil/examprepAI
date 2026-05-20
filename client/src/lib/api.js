const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function analyzeFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: formData
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}`);
  }
  return payload;
}

export async function healthCheck() {
  const response = await fetch(`${API_BASE}/api/health`);
  return response.json();
}
