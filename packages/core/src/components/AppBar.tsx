import { AppBar as MuiAppBar, ThemeProvider, createTheme } from "@mui/material";
import { PanelProps } from "../types";

export interface AppBarProps extends PanelProps {
    title?: string;
}

const them = createTheme({
    // theme for the app bar
})

export function AppBar(props: AppBarProps){ 
    console.info(props);
    return (
        <ThemeProvider theme={them}>
            <MuiAppBar data-testid="app-bar" sx={{ position: "fixed", paddingBlock: 2, paddingInline: 4 }}>App Bar</MuiAppBar>
        </ThemeProvider>
    );
}