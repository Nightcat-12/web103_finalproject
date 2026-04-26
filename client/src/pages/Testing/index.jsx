import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Testing() {
	const [remainingSeconds, setRemainingSeconds] = useState(90);
	const [isRunning, setIsRunning] = useState(false);
	const [endTime, setEndTime] = useState(null);

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
			}
		}, 250);

		return () => clearInterval(interval);
	}, [isRunning, endTime]);

	return (
		<Box
			sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			<Stack>
				<Typography variant="h1">
					{Math.floor(remainingSeconds / 60)}:
					{String(remainingSeconds % 60).padStart(2, "0")}
				</Typography>

				<Button
					variant="contained"
					onClick={() => {
						isRunning ? stopTimer() : startTimer();
					}}
				>
					{isRunning ? "Stop Timer" : "Start Timer"}
				</Button>
			</Stack>
		</Box>
	);
}
