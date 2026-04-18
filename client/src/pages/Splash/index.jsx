import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SignInWithGoogleButton from "../../components/SignInWithGoogleButton";
import Stack from "@mui/material/Stack";
import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Splash() {

    const {user} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/home')
        }
    }, [user, navigate])

	return (
		<Box
			sx={{
				minHeight: "100svh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				gap: 3,
				px: 2,
			}}
		>
			<Typography variant="h1">Pawmodoro</Typography>

			<Stack
				justifyContent="center"
				alignItems="center"
				sx={{ width: "50%" }}
				spacing={3}
			>
				<Typography>Welcome to Pawmodoro!</Typography>
				<Typography>
					Pawmodoro is a gamified study timer experience utilizing the Pomodoro
					technique.
				</Typography>
				<Typography>
					In Pawmodoro, the player has a loyal, energetic pet. During study
					sessions, their pet will play, and during breaks, they come back with
					rewards. The player can use these rewards and resources to obtain
					items, decorations, and upgrades for their pet's energy.
				</Typography>
				<Typography>
					Pawmodoro is built to gamify the Pomodoro Technique, creating a
					satisfying balance of productivity and entertainment. Users have one
					more thing to look forward to during their breaks and can romanticize
					the work they do.
				</Typography>
				<Typography>
					Pawmodoro was inspired by the desire to have a more entertaining
					studying/working experience. Finding joy and aesthetic pleasure in
					work results in increased productivity, and a more fulfilling
					experience. By gamifying productivity, players will look forward to
					the ways Pawmodoro rewards them for working hard (and taking breaks)!
				</Typography>
			</Stack>

			<SignInWithGoogleButton />
		</Box>
	);
}
