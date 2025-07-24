import React from "react";
import { Snackbar, Alert } from "@mui/material";

function Notification({ notification, handleCloseNotification }) {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={handleCloseNotification}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        onClose={handleCloseNotification}
        severity={notification.severity}
        sx={{ width: "100%" }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
