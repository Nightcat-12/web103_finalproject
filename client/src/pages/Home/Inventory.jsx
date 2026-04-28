import { Drawer, Typography, Box, IconButton, Divider, Button } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../../contexts/AuthContext"; // ✅ get current user

/** Served from `client/public` — used when API has no image or URL fails. */
const FALLBACK_INVENTORY_IMAGE = "/patternSopItems.svg";
const INVENTORY_HEADER_BADGE = "/patternSopItems.svg";

const INVENTORY_BG = "#e0e0e0";
const INVENTORY_BORDER = "#bdbdbd";
const INVENTORY_TEXT = "#212121";
const INVENTORY_MUTED = "#616161";

function itemImageSrc(item) {
  const url = item?.image ?? item?.img;
  return url && String(url).trim() ? String(url).trim() : FALLBACK_INVENTORY_IMAGE;
}

function ItemCard({ item, selected, onClick }) {
  return (
    <Box
      onClick={() => onClick(item)}
      sx={{
        position: "relative",
        width: 80,
        height: 80,
        border: `2px solid ${selected ? "#60a5fa" : "#1e1e30"}`,
        borderRadius: "6px",
        background: selected
          ? "radial-gradient(circle at center, #1e3a5fcc, #0d0d14)"
          : "radial-gradient(circle at center, #1a1a2e, #0d0d14)",
        boxShadow: selected ? "0 0 8px rgba(96,165,250,0.5)" : "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        transition: "all 0.15s ease",
        "&:hover": {
          border: "2px solid #60a5fa",
          boxShadow: "0 0 8px rgba(96,165,250,0.5)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        component="img"
        src={itemImageSrc(item)}
        alt={item.name}
        sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <Box
        sx={{
          display: "none",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}
      >
        🪑
      </Box>
    </Box>
  );
}

export default function Inventory({ open, onClose, initialFilter = "All", allowedCategories = [], activeSlot = null }) {
  const { user } = useContext(AuthContext);        //  current user
  const [shopItems, setShopItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState(initialFilter);
  const [loading, setLoading] = useState(false);  //  loading state
  const [error, setError] = useState(null);        //  error state

  useEffect(() => {
    if (!open || !user?.uid) {
      return; //  only fetch when drawer opens and user exists
    }

    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/inventory/${user.uid}`);
        if (!res.ok) throw new Error("Failed to fetch inventory");
        const data = await res.json();
        setShopItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setFilter(initialFilter);
    fetchInventory();
  }, [open, user?.uid, initialFilter, allowedCategories]); // ✅ re-fetch when drawer opens or user changes

  // expose a refresh function so other handlers can call it
  const refreshInventory = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory/${user.uid}`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setShopItems(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleEquipToggle = async (item) => {
    if (!item) return;
    setLoading(true);
    setError(null);
    try {
      const nextEquipped = !item.equipped;

      // If equipping, first unequip others in the same category
      if (nextEquipped) {
        const others = shopItems.filter(
          (i) => i.category === item.category && i.equipped && i.id !== item.id,
        );
        const unequippedItems = await Promise.all(
          others.map((o) =>
            fetch(`/api/inventory/${o.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ equipped: false }),
            }),
          ),
        );

        const failedUnequip = unequippedItems.find((response) => !response.ok);
        if (failedUnequip) {
          throw new Error("Failed to unequip item");
        }
      }

      // Toggle selected item
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipped: nextEquipped }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error || "Failed to update item");
      }

      // Refresh local inventory and selected item
      const latestInventory = await refreshInventory();
      const updated = await res.json();
      setSelected(updated);

      // notify others (VirtualRoom) with the updated inventory snapshot so it can render immediately
      try {
        window.dispatchEvent(
          new CustomEvent("inventoryUpdated", {
            detail: {
              item: updated,
              inventory: latestInventory ?? [],
              slot: activeSlot,
              equipped: updated?.equipped ?? nextEquipped,
            },
          }),
        );
      } catch {
        /* ignore */
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = allowedCategories && allowedCategories.length > 0
    ? allowedCategories.length > 1 
      ? ["All", ...allowedCategories] 
      : allowedCategories
    : ["All", ...new Set(shopItems.map((i) => i.category))];

  const filtered = allowedCategories?.length > 0
    ? filter === "All"
      ? shopItems.filter((i) => allowedCategories.includes(i.category))
      : shopItems.filter((i) => i.category === filter && allowedCategories.includes(i.category))
    : filter === "All"
      ? shopItems
      : shopItems.filter((i) => i.category === filter);

  const handleSelect = (item) => {
    setSelected((prev) => (prev?.id === item.id ? null : item));
  };

  const TOTAL_SLOTS = Math.ceil(shopItems.length / 5) * 5 + 5;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="bottom"
      PaperProps={{
        sx: {
          background: INVENTORY_BG,
          borderTop: `2px solid ${INVENTORY_BORDER}`,
          borderRadius: "16px 16px 0 0",
          maxHeight: "80vh",
          overflow: "hidden",
          fontFamily: "inherit",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${INVENTORY_BORDER}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src={INVENTORY_HEADER_BADGE}
            alt=""
            aria-hidden
            sx={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }}
          />
          <Typography sx={{ fontSize: "1.3rem" }}>🛍️</Typography>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                color: INVENTORY_TEXT,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Inventory
            </Typography>
            <Typography
              sx={{
                fontSize: "0.65rem",
                color: INVENTORY_MUTED,
                letterSpacing: "0.08em",
              }}
            >
              {loading ? "Loading..." : `${shopItems.length} items`}  {/* ✅ loading feedback */}
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: INVENTORY_MUTED,
            border: `1px solid ${INVENTORY_BORDER}`,
            borderRadius: "6px",
            width: 32,
            height: 32,
            "&:hover": { color: INVENTORY_TEXT, borderColor: "#9e9e9e" },
          }}
        >
          ✕
        </IconButton>
      </Box>

      {/* Category Filter Row */}
      <Box
        sx={{
          px: 3,
          py: 1.2,
          display: "flex",
          gap: 1,
          overflowX: "auto",
          borderBottom: `1px solid ${INVENTORY_BORDER}`,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {categories.map((cat) => {
          const isActive = filter === cat;
          return (
            <Box
              key={cat}
              onClick={() => setFilter(cat)}
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: "4px",
                border: `1px solid ${isActive ? "#2563eb" : "#9e9e9e"}`,
                cursor: "pointer",
                flexShrink: 0,
                background: isActive ? "#ffffff" : "transparent",
                transition: "all 0.15s",
                "&:hover": { borderColor: "#2563eb" },
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: isActive ? "#2563eb" : INVENTORY_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {cat}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", height: "calc(80vh - 130px)", overflow: "hidden" }}>
        {/* Item Grid */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { background: INVENTORY_BG },
            "&::-webkit-scrollbar-thumb": { background: INVENTORY_BORDER, borderRadius: 2 },
          }}
        >
          {/* ✅ Loading spinner */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
              <CircularProgress size={40} sx={{ color: "#60a5fa" }} />
            </Box>
          )}

          {/* ✅ Error state */}
          {error && (
            <Typography sx={{ color: "#f87171", fontSize: "0.75rem", textAlign: "center", pt: 4 }}>
              {error}
            </Typography>
          )}

          {/* ✅ Empty state */}
          {!loading && !error && shopItems.length === 0 && (
            <Typography sx={{ color: INVENTORY_MUTED, fontSize: "0.75rem", textAlign: "center", pt: 4 }}>
              No items in your inventory yet.
            </Typography>
          )}

          {!loading && !error && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                gap: 1.5,
              }}
            >
              {filtered.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  selected={selected?.id === item.id}
                  onClick={handleSelect}
                />
              ))}
              {filter === "All" &&
                Array.from({ length: Math.max(0, TOTAL_SLOTS - shopItems.length) }).map((_, i) => (
                  <Box
                    key={`empty-${i}`}
                    sx={{
                      width: 80,
                      height: 80,
                      border: `1px dashed ${INVENTORY_BORDER}`,
                      borderRadius: "6px",
                      opacity: 0.4,
                    }}
                  />
                ))}
            </Box>
          )}
        </Box>

        {/* Detail Panel - unchanged */}
        {selected && (
          <Box
            sx={{
              width: 200,
              borderLeft: `1px solid ${INVENTORY_BORDER}`,
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              background: "#d5d5d5",
              flexShrink: 0,
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 120,
                borderRadius: "8px",
                overflow: "hidden",
                border: `1px solid ${INVENTORY_BORDER}`,
                background: "#eeeeee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={itemImageSrc(selected)}
                alt={selected.name}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  color: "#2563eb",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                }}
              >
                {selected.category}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: INVENTORY_TEXT,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  mt: 0.3,
                }}
              >
                {selected.name}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: INVENTORY_BORDER }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography
                sx={{ fontSize: "0.65rem", color: INVENTORY_MUTED }}
              >
                PRICE
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#34d399",
                  fontWeight: 700,
                }}
              >
                ${selected.price}
              </Typography>
            </Box>

            <Button
              disabled={loading}
              onClick={() => handleEquipToggle(selected)}
              variant={selected?.equipped ? "outlined" : "contained"}
              color={selected?.equipped ? "secondary" : "primary"}
              sx={{
                mt: "auto",
                py: 1,
                borderRadius: "6px",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {selected?.equipped ? "Unequip" : "Equip"}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}