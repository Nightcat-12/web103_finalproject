import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CatSelect from "../Home/CatSelect";

export default function Testing() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Cat Select
      </Button>

      <CatSelect open={open} handleClose={()=>{setOpen(false)}}/>
    </>
  );
}