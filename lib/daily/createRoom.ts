interface DailyRoom {
  roomName: string;
  roomUrl: string;
}

export async function createDailyRoom(): Promise<DailyRoom | null> {
  const DAILY_API_KEY = process.env.DAILY_API_KEY;
  if (!DAILY_API_KEY) return null;

  const roomName = `consult-${Date.now()}`;
  const expiresAt = Math.floor(Date.now() / 1000) + 86400;

  try {
    const res = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${DAILY_API_KEY}` },
      body: JSON.stringify({
        name: roomName,
        privacy: "public",
        properties: { exp: expiresAt, enable_recording: "cloud", enable_chat: true, enable_screenshare: true, enable_knocking: true },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return { roomName, roomUrl: data.url };
    }
  } catch {
    // Daily.co room creation failed - continue without video room
  }
  return null;
}
