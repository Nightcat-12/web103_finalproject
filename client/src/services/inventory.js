// client/services/inventory.js  ← create this file
export async function addToInventory(shopItemId, userId) {
  const res = await fetch(`/api/inventory/${shopItemId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId }),
});
  // #region agent log
  fetch("http://127.0.0.1:7902/ingest/19da2628-1f15-41a8-839b-145e0e286fb3", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "419e30" },
    body: JSON.stringify({
      sessionId: "419e30",
      location: "services/inventory.js:addToInventory",
      message: "addToInventory HTTP",
      data: { status: res.status, ok: res.ok, hypothesisId: "H1" },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (!res.ok) {
    let detail = "";
    try {
      const errBody = await res.json();
      if (errBody?.error) detail = `: ${errBody.error}`;
    } catch {
      /* ignore */
    }
    throw new Error(`Failed to add to inventory${detail}`);
  }
  return res.json();
}

