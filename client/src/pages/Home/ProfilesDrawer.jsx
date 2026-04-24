// client/src/pages/Home/TasksDrawer.jsx
import {
	Box,
	Card,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Drawer,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { IconButton, Checkbox, FormControlLabel } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";


function ProfilesForm({open, onClose}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                {"Edit Profile"}
            </DialogTitle>
            <DialogContent>
                
            </DialogContent>
        </Dialog>
    )
}

export default function ProfilesDrawer({
	open = false,
	onClose = () => {},
	sx = {},
	profiles,
}) {

    const [dialogOpen, setDialogOpen] = useState(false)

	return (
		<Drawer
			open={open}
			onClose={onClose}
			sx={{
				"& .MuiDrawer-paper": {
					backgroundColor: "primary.main",
					color: "white",
				},
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
				<Typography variant="h5">Profiles</Typography>
				<Divider color="white" sx={{ width: "80%", color: "white" }} />

				<Box sx={{ width: "100%" }}>
					{profiles?.map((profile) => (
						<Paper
							elevation={3}
							key={profile.id}
							sx={{
								width: "100%",
								backgroundColor: "primary.light",
								color: "white",
								boxShadow: "none",
								borderRadius: 2,
								p: 2,
								mb: 1,
								border: "1px solid rgba(255, 254, 254, 0.08)",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-around",
                                gap: 5
							}}
						>
							<Box>
								<Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>
									{profile.name}
								</Typography>
								<Divider color="white" />
								<Typography sx={{ color: "#FFFFFF", opacity: 0.9 }}>
									{profile.timeOn ?? profile.timeon ?? profile.time_on} |{" "}
									{profile.timeBreak ?? profile.timebreak ?? profile.time_break}{" "}
									|{" "}
									{profile.timeLongBreak ??
										profile.timelongbreak ??
										profile.time_long_break}
								</Typography>
							</Box>

							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<FormControlLabel
									control={
										<Checkbox
											checked={Boolean(
												profile.isDefault ??
													profile.isdefault ??
													profile.is_default
											)}
											onChange={() =>
												console.log("toggle default for", profile.id)
											}
											sx={{
												color: "#fff",
												"&.Mui-checked": { color: "#fff" },
											}}
										/>
									}
									label={
										<Typography sx={{ color: "#FFFFFF" }}>Default?</Typography>
									}
								/>
								<IconButton
									aria-label="edit"
									onClick={() => setDialogOpen(true)}
									sx={{ color: "#FFFFFF" }}
								>
									<EditIcon />
								</IconButton>

							</Box>
						</Paper>
					))}
                    <IconButton>
                        <AddIcon/>
                    </IconButton>

                    <ProfilesForm open={dialogOpen} onClose={() => {setDialogOpen(false)}} />
				</Box>
			</Stack>
		</Drawer>
	);
}
