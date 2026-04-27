// components/BuyButton.jsx
import { useContext, useState } from "react";
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AuthContext from "../contexts/AuthContext";
import { addToInventory } from "../services/inventory"; // uncommented and correct path

export default function BuyButton({ shopItemId, onSuccess, onError, ...rest }) {
  const { user } = useContext(AuthContext);
  const [purchasing, setPurchasing] = useState(false);

  const handleBuy = async () => {
    if (!user?.uid || purchasing) return;
    setPurchasing(true);
    try {
      const data = await addToInventory(shopItemId, user.uid);
      // dispatch global event with updated coins when available
      if (data?.user?.coins != null) {
        try {
          window.dispatchEvent(new CustomEvent('userCoinsUpdated', { detail: { coins: Number(data.user.coins) } }));
        } catch (e) {
          /* ignore dispatch errors */
        }
      }
      onSuccess?.(data);
    } catch (err) {
      onError?.(err);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <Button
      onClick={handleBuy}
      disabled={!user?.uid || purchasing}
      variant="contained"
      startIcon={<ShoppingCartIcon />}
      {...rest}
    >
      {!user?.uid ? "Sign in to buy" : "Buy"}
    </Button>
  );
}