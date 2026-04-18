import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import pawmodoroIcon from '/pawmodoro.png'
import Box from "@mui/material/Box";

export default function NavBar() {
    
    const navigate = useNavigate()

	return (
		<AppBar>
			<Toolbar sx={{justifyContent: "center", height: 75}}>
				<Stack direction="row" width="100%" sx={{justifyContent: "center", alignItems: "center"}}>
					<Stack
						direction="row"
                        sx = {{
                            alignItems: "center",
                            justifyContent: "center"
                        }}
						spacing={20}
					>
						<IconButton aria-label="Profile" sx={{ color: "#FFFFFF" }} onClick={() => navigate('/shop')}>
							<ShoppingCart />
						</IconButton>


                        <Stack direction="row" spacing={1} sx={{justifyContent: "center", alignItems: "center"}}>
                            <Box component="img" src={pawmodoroIcon} sx={{width: "3em"}}/>
						    <Typography variant="h4" sx={{cursor: "pointer"}} onClick={() => navigate('/')}>Pawmodoro</Typography>
                        </Stack>

						<IconButton aria-label="Profile" sx={{ color: "#FFFFFF" }} onClick={() => navigate('/profile')}>
							<AccountCircle />
						</IconButton>
					</Stack>
				</Stack>
			</Toolbar>
		</AppBar>
	);
}
