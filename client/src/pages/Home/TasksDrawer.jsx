// client/src/pages/Home/TasksDrawer.jsx
import { Box, Divider, Drawer, Stack, Typography } from "@mui/material";

export default function TasksDrawer({ open = false, onClose = () => {}, sx = {} }) {
    return (
        <Drawer
            open={open}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": { backgroundColor: "primary.main", color: "white" },
                ...sx,
            }}
        >
            <Stack
                sx={{
                    width: "30vw",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                }}
                spacing={2}
            >
                <Typography variant="h5">Tasks</Typography>
                <Divider color="white" sx={{ width: "80%", color: "white" }} />

                <Box>
					{/* @TODO: Implement Tasks Logic here */}
				</Box>
				
            </Stack>
        </Drawer>
    );
}