import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { VERSION } from "../constants";

export interface InfoPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  content?: string | React.ReactNode;
  theme?: "light" | "dark";
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  open,
  onClose,
  title = "WebOS SDK Information",
  content,
  theme = "light",
}) => {
  const version = VERSION;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e0e0e0"}`,
        }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: theme === "dark" ? "#fff" : "#666",
            "&:hover": {
              backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ padding: "24px" }}>
        <Box>
          {/* Version Information */}
          <Box sx={{ marginBottom: content ? "16px" : "0" }}>
            <Typography variant="h6" color="text.primary" sx={{ marginBottom: "8px" }}>
              WebOS SDK
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Version: {version}
            </Typography>
          </Box>
          
          {/* Custom Content */}
          {content && (
            <Box sx={{ borderTop: `1px solid ${theme === "dark" ? "#333" : "#e0e0e0"}`, paddingTop: "16px" }}>
              {typeof content === "string" ? (
                <Typography variant="body1" color="text.primary">
                  {content}
                </Typography>
              ) : (
                content
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ padding: "16px 24px", borderTop: `1px solid ${theme === "dark" ? "#333" : "#e0e0e0"}` }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: theme === "dark" ? "#1976d2" : "#2196f3",
            "&:hover": {
              backgroundColor: theme === "dark" ? "#1565c0" : "#1976d2",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
