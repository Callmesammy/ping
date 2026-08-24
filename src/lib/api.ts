const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchPing(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/pings/${id}`);
    if (!res.ok) throw new Error('Failed to fetch ping');
    return await res.json();
  } catch (error) {
    console.warn('API fetch fallback to local state:', error);
    return null;
  }
}

export async function createPingApi(title: string, tag: string) {
  try {
    const res = await fetch(`${API_BASE}/api/pings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, tag }),
    });
    if (!res.ok) throw new Error('Failed to create ping');
    return await res.json();
  } catch (error) {
    console.warn('API create fallback:', error);
    return null;
  }
}

export async function voteVenueApi(pingId: string, venueId: string, userName: string = '@you') {
  try {
    const res = await fetch(`${API_BASE}/api/pings/${pingId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venueId, userName }),
    });
    if (!res.ok) throw new Error('Failed to submit vote');
    return await res.json();
  } catch (error) {
    console.warn('API vote fallback:', error);
    return null;
  }
}

export async function lockPingApi(pingId: string) {
  try {
    const res = await fetch(`${API_BASE}/api/pings/${pingId}/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to lock ping');
    return await res.json();
  } catch (error) {
    console.warn('API lock fallback:', error);
    return null;
  }
}
