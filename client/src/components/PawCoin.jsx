import { Box } from "@mui/system";
import PetsIcon from "@mui/icons-material/Pets";

export default function PawCoin({ width = 40, height = 40 }) {
    const iconSize = Math.min(width, height) * 0.55;

    return (
        <Box
            sx={{
                width,
                height,
                borderRadius: "50%",
                backgroundColor: "secondary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
            }}
        >
            <PetsIcon sx={{ fontSize: iconSize }} />
        </Box>
    );
}