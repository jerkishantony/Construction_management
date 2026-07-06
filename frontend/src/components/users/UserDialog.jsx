import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import UserForm from "../forms/UserForm";

export default function UserDialog({
  open,
  mode,
  user,
  onClose,
  onSuccess,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {mode === "create" ? "Create User" : "Edit User"}
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
      <UserForm
  mode={mode}
  user={user}
  onClose={onClose}
  onSuccess={() => {
    onSuccess();
    onClose();
  }}
/>
      </DialogContent>
    </Dialog>
  );
}