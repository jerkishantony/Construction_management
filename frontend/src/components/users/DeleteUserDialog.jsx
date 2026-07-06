import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

import { useState } from "react";
import userService from "../../services/userService";

export default function DeleteUserDialog({
  open,
  user,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    try {
      setLoading(true);

      await userService.deleteUser(user.id);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.detail ||
          "Failed to delete user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Delete User
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this user?
        </DialogContentText>

        {user && (
          <DialogContentText
            sx={{
              mt: 2,
              fontWeight: "bold",
            }}
          >
            {user.full_name || user.username}
            <br />
            {user.company_name}
          </DialogContentText>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          disabled={loading}
          onClick={handleDelete}
        >
          {loading ? (
            <CircularProgress
              size={20}
              color="inherit"
            />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}