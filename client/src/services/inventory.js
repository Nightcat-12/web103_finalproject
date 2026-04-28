// client/services/inventory.js  ← create this file
export async function addToInventory(shopItemId, userId) {
  const res = await fetch(`/api/inventory/${shopItemId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId }),
});
  // #region agent log
  
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

