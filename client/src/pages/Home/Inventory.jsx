import { Drawer, Stack, Typography } from "@mui/material";

export default function Inventory({open, onClose}) {
    return (
        <Drawer open={open} onClose={onClose} anchor="bottom">
            {/* IMPLEMENT HERE */}
            <Typography>Inventory goes here</Typography>
            <Stack>
                <Typography>Test</Typography>
                <Typography>Test</Typography>
                <Typography>Test</Typography>
                <Typography>Test</Typography>
                <Typography>Test</Typography>
                <Typography>Test</Typography>
            </Stack>
        </Drawer>
    )
}