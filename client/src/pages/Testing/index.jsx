import { Box, Button } from "@mui/material";
import Inventory from "../Home/Inventory";
import { useState } from "react";

export default function Testing() {

  const [open, setOpen] = useState(false)

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Inventory
      </Button>

      <Inventory open={open} onClose={() => setOpen(false)}/>

    </Box>
  );
}
