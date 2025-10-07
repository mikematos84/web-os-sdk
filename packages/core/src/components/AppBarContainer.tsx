import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

export interface AppBarContainerProps {
  theme?: "light" | "dark";
  onInfoPanelClick?: () => void;
}

export const AppBarContainer: React.FC<AppBarContainerProps> = ({
  theme = "light",
  onInfoPanelClick,
}) => {
  const handleInfoPanelClick = () => {
    if (onInfoPanelClick) {
      onInfoPanelClick();
    } else {
      // Fallback: try to use global webOsCore if available
      if (typeof window !== "undefined" && (window as any).webOsCore) {
        (window as any).webOsCore.showInfoPanel({
          title: 'WebOS SDK Information',
          content: 'This is the WebOS SDK information panel. You can customize this content by providing an onInfoPanelClick callback to the AppBarContainer component.',
          theme: theme
        });
      }
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">WebOS</Typography>
        <Box>
          <Button color="inherit" onClick={handleInfoPanelClick}>
            Info Panel
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
