import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotification: true,
    smsNotification: false,
    darkMode: false,
    compactSidebar: false,
    language: "English",
    timezone: "Asia/Kolkata",
  });

  const handleSwitch = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Settings
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>

          <Typography variant="h6" fontWeight="bold">
            General Settings
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotification}
                    onChange={handleSwitch}
                    name="emailNotification"
                  />
                }
                label="Email Notifications"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotification}
                    onChange={handleSwitch}
                    name="smsNotification"
                  />
                }
                label="SMS Notifications"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleSwitch}
                    name="darkMode"
                  />
                }
                label="Dark Mode (Coming Soon)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.compactSidebar}
                    onChange={handleSwitch}
                    name="compactSidebar"
                  />
                }
                label="Compact Sidebar"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Language"
                name="language"
                value={settings.language}
                onChange={handleChange}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Tamil">Tamil</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Time Zone"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
              >
                <MenuItem value="Asia/Kolkata">
                  Asia/Kolkata
                </MenuItem>

                <MenuItem value="UTC">
                  UTC
                </MenuItem>
              </TextField>
            </Grid>

          </Grid>

          <Box
            display="flex"
            justifyContent="flex-end"
            mt={4}
          >
            <Button
              variant="contained"
              size="large"
            >
              Save Settings
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}