// client/src/pages/Home/VirtualRoom.jsx
import { Box, Card, Paper, Typography, Fab, Stack, Badge } from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import TasksDrawer from "./TasksDrawer";
import { useContext, useEffect, useState } from "react";
import { Bounce } from "react-awesome-reveal";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ProfilesDrawer from "./ProfilesDrawer";
import AuthContext from "../../contexts/AuthContext";
import PauseIcon from "@mui/icons-material/Pause";

const slots = {
	desk: {
		bottom: "10%",
		left: "50%",
		transform: "translate(-50%)",
		width: "40%",
		height: "40%",
	},
	floor1: {
		bottom: "15%",
		left: "20%",
		transform: "translate(-50%)",
		width: "14%",
		height: "50%",
	},
	floor2: {
		bottom: "15%",
		right: "6%",
		transform: "translate(-50%)",
		width: "14%",
		height: "50%",
	},
	wall: {
		bottom: "75%",
		right: "0%",
		transform: "translate(-50%)",
		width: "12%",
		height: "16%",
	},
	timer: {
		position: "absolute",
		top: "15%",
		left: "50%",
		transform: "translate(-50%)",
		width: "30%",
		height: "20%",
		backgroundColor: "rgba(0, 0, 0, 0.1)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
	},
};

function Slot({ label, sx, item }) {
	return (
		<Box
			sx={{
				position: "absolute",
				...sx,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{item?.img ? (
				<Box
					component="img"
					src={item.img}
					elevation={3}
					sx={{
						width: "100%",
						height: "100%",
						borderRadius: 2,
						objectFit: "cover",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				/>
			) : (
				<Paper
					elevation={3}
					sx={{
						width: "100%",
						height: "100%",
						borderRadius: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						bgcolor: "rgba(255,255,255,0.7)",
						border: "1px dashed rgba(0,0,0,0.2)",
					}}
				>
					<Typography variant="caption">{label}</Typography>
				</Paper>
			)}
		</Box>
	);
}

export default function VirtualRoom() {
	const [items, setItems] = useState({
		desk: {
			img: "https://static.vecteezy.com/system/resources/thumbnails/046/797/124/small/wooden-office-desk-with-lamp-table-isolated-on-transparent-background-png.png",
		},
		floor1: { img: "" },
		floor2: { img: "" },
		wall: { img: "" },
		timer: {
			minutes: 0,
			seconds: 0,
		},
	});
	const [isTasksOpen, setIsTasksOpen] = useState(false);
	const [isProfilesOpen, setIsProfilesOpen] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState();
	const [allProfiles, setAllProfiles] = useState();
	const [remainingSeconds, setRemainingSeconds] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [endTime, setEndTime] = useState(null);
	const [mode, setMode] = useState("work"); // "work" | "break" | "longBreak"
	const [sessionCount, setSessionCount] = useState(0);

	const { user } = useContext(AuthContext);

	const getDurations = (profile) => {
		if (!profile) return null;

		return {
			work: Number(profile.timeon),
			break: Number(profile.timebreak),
			longbreak: Number(profile.timelongbreak),
		};
	};

	const startTimer = () => {
		if (isRunning) return;

		setEndTime(Date.now() + remainingSeconds * 1000);
		setIsRunning(true);
	};

	const stopTimer = () => {
		setIsRunning(false);
	};

	useEffect(() => {
		if (!isRunning) return;

		const interval = setInterval(() => {
			const remaining = Math.max(0, endTime - Date.now());

			setRemainingSeconds(Math.ceil(remaining / 1000));

			if (remaining <= 0) {
				setIsRunning(false);

				if (mode == "work") {
					const nextCount = sessionCount + 1;
					setSessionCount(nextCount);
					if (nextCount % 4 == 0) {
						setMode("longbreak");
					} else {
						setMode("break");
					}
				} else {
					setMode("work");
				}
			}
		}, 250);

		return () => clearInterval(interval);
	}, [isRunning, endTime, mode]);

	useEffect(() => {
		const raw = selectedProfile?.timeon;
		if (raw == null) return;

		const minutes = Number(raw);
		if (!Number.isFinite(minutes)) return;

		setItems((prev) => {
			if (prev.timer?.minutes === minutes && prev.timer?.seconds === 0)
				return prev;
			return { ...prev, timer: { minutes, seconds: 0 } };
		});
	}, [selectedProfile]);

	const refreshProfiles = async () => {
		if (!user?.uid) return;

		const results = await fetch(`/api/pomodoro_profiles/${user.uid}`);
		const data = await results.json();

		setSelectedProfile(data[0]);
		setAllProfiles(data);
	};

	useEffect(() => {
		refreshProfiles();
	}, [user]);

	useEffect(() => {
		const durations = getDurations(selectedProfile);
		if (!durations) return;

		const minutes = durations[mode];
		if (!Number.isFinite(minutes)) return;

		setRemainingSeconds(minutes * 60);
	}, [selectedProfile, mode]);

	return (
		<Box
			sx={{
				width: "80vw",
				maxWidth: 1000,
				margin: "0 auto",
			}}
		>
			{/* Room canvas */}
			<Box
				sx={{
					position: "relative",
					width: "100%",
					aspectRatio: "16 / 9",
					backgroundColor: "red",
					borderRadius: 4,
					overflow: "hidden",
				}}
			>
				{/* Background layers */}
				<Box sx={{ position: "absolute", inset: 0, bgcolor: "#cfe8ff" }} />
				<Box
					sx={{
						position: "absolute",
						bottom: 0,
						width: "100%",
						height: "35%",
						bgcolor: "#e9d8b5",
					}}
				/>

				{/* Slots */}
				<Slot label="Desk" sx={slots.desk} item={items.desk} />
				<Slot label="Floor Item 1" sx={slots.floor1} />
				<Slot label="Floor Item 2" sx={slots.floor2} />
				<Slot label="Wall Item" sx={slots.wall} item={items.wall} />
				<Stack spacing={5}>
					<Card sx={{ ...slots.timer, overflow: "visible" }} elevation={0}>
						<Badge
							badgeContent={sessionCount}
							showZero
							color="primary"
							sx={{
								position: "absolute",
								top: 8,
								right: 25,
								zIndex: 2,
							}}
						>
							<Box sx={{ width: 1, height: 1 }} />
						</Badge>
						<Typography variant="caption" sx={{ position: "absolute", top: 6, color: "#FFFFFF"}}>
							{mode.toUpperCase()}
						</Typography>
						{selectedProfile?.timeon != null && (
							<Bounce>
								<Stack>
									<Typography
										variant="h2"
										sx={{
											color: "common.white",
											fontSize: {
												xs: "1.2rem",
												sm: "1.8rem",
												md: "2.5rem",
												lg: "3rem",
											},
										}}
									>
										{Math.floor(remainingSeconds / 60)}:
										{String(remainingSeconds % 60).padStart(2, "0")}
									</Typography>
								</Stack>
							</Bounce>
						)}
					</Card>

					{/* FAB to open Tasks */}
					<Fab
						color="primary"
						aria-label="tasks"
						onClick={() => setIsTasksOpen(true)}
						sx={{
							position: "absolute",
							left: "5%",
							top: "5%",
							zIndex: 20,
							width: { xs: 40, sm: 56, md: 64 },
							height: { xs: 40, sm: 56, md: 64 },
							"& .MuiSvgIcon-root": {
								fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
							},
						}}
					>
						<PlaylistAddCheckIcon />
					</Fab>

					<Stack
						direction="row"
						spacing={2}
						sx={{
							position: "absolute",
							left: "50%",
							top: "35%",
							zIndex: 20,
							transform: "translate(-50%, -50%)",
							"& .MuiSvgIcon-root": {
								fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
							},
						}}
					>
						<Fab
							color="primary"
							sx={{
								width: { xs: 30, sm: 46, md: 54 },
								height: { xs: 30, sm: 46, md: 54 },
							}}
							onClick={() => setIsProfilesOpen(true)}
						>
							<SettingsIcon />
						</Fab>
						<Fab
							color="primary"
							sx={{
								width: { xs: 30, sm: 46, md: 54 },
								height: { xs: 30, sm: 46, md: 54 },
							}}
							onClick={() => {
								isRunning ? stopTimer() : startTimer();
							}}
						>
							{isRunning ? <PauseIcon /> : <PlayArrowIcon />}
						</Fab>
					</Stack>
				</Stack>

				{/* Controlled Drawer */}
				<TasksDrawer open={isTasksOpen} onClose={() => setIsTasksOpen(false)} />

				{/* Profile Options Drawer */}
				<ProfilesDrawer
					open={isProfilesOpen}
					onClose={() => setIsProfilesOpen(false)}
					profiles={allProfiles}
					onProfilesChanged={refreshProfiles}
					selectedProfile={selectedProfile}
					setSelectedProfile={setSelectedProfile}
				/>
			</Box>
		</Box>
	);
}
