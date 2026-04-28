import { Drawer, Typography, Box, IconButton } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../../contexts/AuthContext"; // ✅ get current user

/** Served from `client/public` — used when API has no image or URL fails. */
const FALLBACK_INVENTORY_IMAGE = "/patternSopItems.svg";
const INVENTORY_HEADER_BADGE = "/patternSopItems.svg";

const INVENTORY_BG = "rgb(253, 246, 235)";
const INVENTORY_SURFACE = "rgba(255, 255, 255, 0.86)";
const INVENTORY_BORDER = "rgba(74, 59, 30, 0.14)";
const INVENTORY_TEXT = "#4a3b1e";
const INVENTORY_MUTED = "#706763";
const INVENTORY_SOFT = "rgba(252, 116, 116, 0.12)";
const INVENTORY_HIGHLIGHT = "#FC7474";

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
        width: 100,
        height: 100,
        border: `2px solid ${selected ? INVENTORY_HIGHLIGHT : INVENTORY_BORDER}`,
        borderRadius: "12px",
        background: selected ? INVENTORY_HIGHLIGHT : "rgba(255, 255, 255, 0.92)",
        color: selected ? "white" : INVENTORY_TEXT,
        boxShadow: selected
          ? "0 10px 24px rgba(74, 59, 30, 0.12)"
          : "0 4px 14px rgba(74, 59, 30, 0.06)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        transition: "all 0.4s ease",
        "&:hover": {
          borderColor: INVENTORY_HIGHLIGHT,
          boxShadow: "0 10px 24px rgba(74, 59, 30, 0.12)",
          transform: "translateY(-2px)",
          background: selected ? INVENTORY_HIGHLIGHT : "rgba(116, 184, 252, 0.16)",
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
          background: selected ? INVENTORY_HIGHLIGHT : "rgba(255, 255, 255, 0.92)",
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

  const TOTAL_SLOTS = Math.ceil(shopItems.length / 5) * 5 + 5;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="bottom"
      sx={{
        "& .MuiDrawer-paper": {
          height: "80vh",
          minHeight: "80vh",
          maxHeight: "80vh",
          overflow: "hidden",
          boxSizing: "border-box",
        },
      }}
      PaperProps={{
        sx: {
          background: `linear-gradient(180deg, rgba(255, 251, 245, 0.98) 0%, ${INVENTORY_BG} 100%)`,
          borderTop: `1px solid ${INVENTORY_BORDER}`,
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -18px 40px rgba(74, 59, 30, 0.12)",
          height: "80vh",
          minHeight: "80vh",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxSizing: "border-box",
          fontFamily: "inherit",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${INVENTORY_BORDER}`,
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src={INVENTORY_HEADER_BADGE}
            alt=""
            aria-hidden
            sx={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }}
          />
          <Typography sx={{ fontSize: "1.2rem" }}>🛍️</Typography>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.05rem",
                color: INVENTORY_TEXT,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Inventory
            </Typography>
            <Typography
              sx={{
                fontSize: "0.65rem",
                color: INVENTORY_MUTED,
                letterSpacing: "0.12em",
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
            color: INVENTORY_TEXT,
            border: `1px solid ${INVENTORY_BORDER}`,
            borderRadius: "10px",
            width: 32,
            height: 32,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              color: INVENTORY_HIGHLIGHT,
              borderColor: INVENTORY_HIGHLIGHT,
              backgroundColor: INVENTORY_SOFT,
            },
          }}
        >
          ✕
        </IconButton>
      </Box>

      {/* Category Filter Row */}
      <Box
        sx={{
          px: 3,
          py: 1.25,
          display: "flex",
          gap: 1,
          overflowX: "auto",
          borderBottom: `1px solid ${INVENTORY_BORDER}`,
          background: "rgba(255, 255, 255, 0.4)",
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
                px: 1.6,
                py: 0.65,
                borderRadius: "999px",
                border: `2px solid ${isActive ? INVENTORY_HIGHLIGHT : INVENTORY_BORDER}`,
                cursor: "pointer",
                flexShrink: 0,
                background: isActive ? INVENTORY_HIGHLIGHT : "#ffffff",
                color: isActive ? "white" : INVENTORY_MUTED,
                boxShadow: isActive ? "0 6px 18px rgba(252, 116, 116, 0.18)" : "none",
                transition: "all 0.4s ease",
                "&:hover": {
                  borderColor: INVENTORY_HIGHLIGHT,
                  background: isActive ? INVENTORY_HIGHLIGHT : "rgba(116, 184, 252, 0.16)",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: isActive ? "white" : INVENTORY_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {cat}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", flex: 1, height: 0, minHeight: 0, overflow: "hidden", alignItems: "stretch" }}>
        {/* Item Grid */}
        <Box
          sx={{
            flex: 1,
            height: "100%",
            p: 2,
            overflowY: "auto",
            minHeight: 0,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: INVENTORY_BORDER,
              borderRadius: 999,
            },
          }}
        >
          {/* ✅ Loading spinner */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
              <CircularProgress size={40} sx={{ color: INVENTORY_HIGHLIGHT }} />
            </Box>
          )}

          {/* ✅ Error state */}
          {error && (
            <Typography sx={{ color: INVENTORY_HIGHLIGHT, fontSize: "0.75rem", textAlign: "center", pt: 4 }}>
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
                gap: 4,
              }}
            >
              {filtered.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                    selected={item.equipped}
                    onClick={handleEquipToggle}
                />
              ))}
              {filter === "All" &&
                Array.from({ length: Math.max(0, TOTAL_SLOTS - shopItems.length) }).map((_, i) => (
                  <Box
                    key={`empty-${i}`}
                    sx={{
                      width: 100,
                      height: 100,
                      border: `1px dashed ${INVENTORY_BORDER}`,
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.35)",
                      opacity: 0.75,
                    }}
                  />
                ))}
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}