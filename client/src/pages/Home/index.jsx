import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SignInWithGoogleButton from "../../components/SignInWithGoogleButton";

export default function Home() {
    return (
        <Box>
            <Typography variant="h1">
                Home Page
            </Typography>
            <SignInWithGoogleButton/>
        </Box>
    )
}