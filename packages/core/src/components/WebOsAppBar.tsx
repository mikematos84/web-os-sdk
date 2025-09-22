import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

export interface WebOsAppBarProps {
  theme?: "light" | "dark";
}

export const WebOsAppBar: React.FC<WebOsAppBarProps> = ({
  theme = "light",
}) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">WebOS</Typography>
      </Toolbar>
    </AppBar>
  );
};
