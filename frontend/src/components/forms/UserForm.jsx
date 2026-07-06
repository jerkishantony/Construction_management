import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Swal from "sweetalert2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import userService from "../../services/userService";

export default function UserForm({ mode, user, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    role: "user",
    plan: "basic",
    is_active: true,
  });

  // ==========================
  // Load user when editing
  // ==========================
  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        username: user.username || "",
        password: "",
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        company_name: user.company_name || "",
        role: user.role || "user",
        plan: user.plan || "basic",
        is_active: user.is_active,
      });
    }
  }, [mode, user]);

  // ==========================
  // Handle Change
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Handle Status
  // ==========================
  const handleStatus = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_active: e.target.checked,
    }));
  };

  // ==========================
  // Submit Form
  // ==========================
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const payload = {
      username: formData.username,
      password: formData.password,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      company_name: formData.company_name,
      role: formData.role,
      plan: formData.plan,
      is_active: formData.is_active,
    };

    if (mode === "create") {
      await userService.createUser(payload);
    } else {
      const updatePayload = { ...payload };

      // Don't send empty password while editing
      if (!updatePayload.password) {
        delete updatePayload.password;
      }

      await userService.updateUser(user.id, updatePayload);
    }

    await Swal.fire({
      icon: "success",
      title: mode === "create" ? "User Created" : "User Updated",
      text:
        mode === "create"
          ? "The user has been created successfully."
          : "Changes have been saved successfully.",
      confirmButtonColor: "#1976d2",
      customClass: {
        container: "swal-top",
      },
    });

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error(error);

    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response?.data?.detail || "Something went wrong.",
      confirmButtonColor: "#1976d2",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Company Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
          />
        </Grid>

        {/* Full Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>

        {/* Username */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </Grid>

        {/* Password */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required={mode === "create"}
            helperText={
              mode === "edit" ? "Leave empty to keep existing password" : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Role */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
        </Grid>

        {/* Subscription */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Subscription Plan"
            name="plan"
            value={formData.plan}
            onChange={handleChange}
          >
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="pro">Pro</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
          </TextField>
        </Grid>

        {/* Status */}
        {mode === "edit" && (
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch checked={formData.is_active} onChange={handleStatus} />
              }
              label={formData.is_active ? "Active User" : "Inactive User"}
            />
          </Grid>
        )}

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                minWidth: 180,
                borderRadius: 2,
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : mode === "create" ? (
                "Create User"
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}