import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
    palette: {
        background: {
            default: "rgb(253, 246, 235)",
        },
        primary: {
            main: "#FC7474",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#74B8FC",
            contrastText: "#FFFFFF",
        }
    },
    typography: {
        fontFamily: `"Spinnaker", sans-serif`,
        allVariants: {
            fontFamily: `"Spinnaker", sans-serif`,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "rgb(253, 246, 235)",
                    fontFamily: `"Spinnaker", sans-serif`,
                },
                button: {
                    fontFamily: "inherit",
                },
                input: {
                    fontFamily: "inherit",
                },
                textarea: {
                    fontFamily: "inherit",
                },
                select: {
                    fontFamily: "inherit",
                },
                code: {
                    fontFamily: "inherit",
                },
                pre: {
                    fontFamily: "inherit",
                },
                kbd: {
                    fontFamily: "inherit",
                },
                samp: {
                    fontFamily: "inherit",
                },
            },
        },
    }
})

