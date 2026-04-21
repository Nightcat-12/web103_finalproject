import { Box, Paper, Typography } from "@mui/material";
import TasksDrawer from "./TasksDrawer";
import { useState } from "react";

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
			{item?.img  ? (
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
		floor1: {
			img: "",
		},
		floor2: {
			img: "",
		},
		wall: {
			img: "",
		},
	});

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
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						bgcolor: "#cfe8ff", // wall
					}}
				/>
				<Box
					sx={{
						position: "absolute",
						bottom: 0,
						width: "100%",
						height: "35%",
						bgcolor: "#e9d8b5", // floor
					}}
				/>

				{/* Slots */}
				<Slot label="Desk" sx={slots.desk} item={items.desk} />
				<Slot label="Floor Item 1" sx={slots.floor1} />
				<Slot label="Floor Item 2" sx={slots.floor2} />
				<Slot label="Wall Item" sx={slots.wall} />
				<TasksDrawer sx={{ position: "absolute", left: "20%" }} />
			</Box>
		</Box>
	);
}
