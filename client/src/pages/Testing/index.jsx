import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import RewardModal from "../Home/RewardModal";

export default function Testing() {
	const [open, setOpen] = useState(false);

	return (
		<Box
			sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			<Button onClick={() => setOpen(true)}>Open Modal</Button>
			<RewardModal
				cat={{
					id: 21,
					userid: "oobv9zeogyZEvCNkoYzlDOLy9ZC3",
					name: "Winton",
					image: "/cats/orangeCat.PNG",
					energy: 100,
				}}
        minutes={100}
				open={open}
				onClose={() => {
					setOpen(false);
				}}
			/>
		</Box>
	);
}
