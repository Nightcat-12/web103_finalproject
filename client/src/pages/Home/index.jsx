import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Testing from "../Testing";
import TasksDrawer from "./TasksDrawer";
import VirtualRoom from "./VirtualRoom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import CatSelect from "./CatSelect";

export default function Home() {
	const { user, isNewUser } = useContext(AuthContext);
	const [catDialogOpen, setCatDialogOpen] = useState(false);
	const [profile, setProfile] = useState({});

	useEffect(() => {
		const getCatInfo = async () => {
			try {
				const results = await fetch(`/api/cats/${user.uid}`);
				const data = await results.json();

				console.log("Data: ", data);
				setCatDialogOpen(data.length == 0);
			} catch (err) {
				console.error(err.message);
			}
		};

		const createDefaultProfile = async () => {
			if (!user || !isNewUser) return;
			try {
				// Check if user already has profiles (and a default) before creating
				const existing = await fetch(`/api/pomodoro_profiles/${user.uid}`);
				const profiles = await existing.json();

				if (Array.isArray(profiles) && profiles.length > 0) {
					// prefer an explicit default if present
					const defaultProfile = profiles.find(
						(p) => p.isDefault || p.isdefault || p.is_default
					);
					setProfile(defaultProfile || profiles[0]);
					return; // already has a profile, do not create
				}

				// No profiles exist yet — create the default
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: user.uid,
						name: "25/5/5 Split",
						timeOn: 25,
						timeBreak: 5,
						timeLongBreak: 15,
						isDefault: true,
					}),
				};

				const results = await fetch(`/api/pomodoro_profiles/`, options);
				const data = await results.json();

				console.log("Created default profile:", data);
				setProfile(data);
			} catch (err) {
				console.error(err.message);
			}
		};

		getCatInfo();
		createDefaultProfile();
	}, [user, isNewUser]);

	useEffect(() => {
		console.log("Profile:", profile);
	}, [profile]);

	return (
		<Box>
			{/* <Typography variant="h1">
                Home Page
            </Typography> */}
			{user && (
				<CatSelect
					open={catDialogOpen}
					handleClose={() => setCatDialogOpen(false)}
				/>
			)}

			{profile && <VirtualRoom/>}
		</Box>
	);
}
