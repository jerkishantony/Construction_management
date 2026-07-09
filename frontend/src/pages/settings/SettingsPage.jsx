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
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import settingsService from "../../services/settingsService";
import Swal from "sweetalert2";
const DEFAULT_SETTINGS = {
  emailNotification: true,
  smsNotification: false,
  compactSidebar: false,
  language: "en",
  timezone: "Asia/Kolkata",
};

export default function SettingsPage() {
  const { t, i18n } = useTranslation();

  // darkMode now comes ONLY from AdminLayout's shared context —
  // no separate copy here, so there's nothing for loadSettings to
  // accidentally overwrite it with.
  const { darkMode, setDarkMode } = useOutletContext();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

const loadSettings = async () => {
  try {
    const res = await settingsService.getSettings();
    const loaded = {
      emailNotification: res.data.email_notifications,
      smsNotification: res.data.sms_notifications,
      compactSidebar: res.data.compact_sidebar,
      language: res.data.language,
      timezone: res.data.timezone,
    };
    setSettings(loaded);
    // No i18n.changeLanguage() call here anymore — localStorage,
    // read once at app boot in i18n.js, is the source of truth.
  } catch (err) {
    console.error("Failed to load settings:", err);
  }
};

  const handleSwitch = (event) => {
    setSettings((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings((prev) => ({ ...prev, [name]: value }));

    if (name === "language") {
      i18n.changeLanguage(value);
      localStorage.setItem("language", value);
    }
  };

 const handleSave = async () => {
  setSaving(true);
  try {
    await settingsService.updateSettings({
      email_notifications: settings.emailNotification,
      sms_notifications: settings.smsNotification,
      language: settings.language,
      timezone: settings.timezone,
      dark_mode: darkMode, // comes from shared context, not local state
      compact_sidebar: settings.compactSidebar,
    });

    Swal.fire({
      icon: "success",
      title: t("save_success"),
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: t("save_failed"),
    });
  } finally {
    setSaving(false);
  }
};
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {t("settings")}
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {t("general_settings")}
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
                label={t("email_notifications")}
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
                label={t("sms_notifications")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    name="darkMode"
                  />
                }
                label={t("dark_mode")}
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
                label={t("compact_sidebar")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label={t("language")}
                name="language"
                value={settings.language}
                onChange={handleChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ta">தமிழ்</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label={t("time_zone")}
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
              >
                <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
                <MenuItem value="UTC">UTC</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? t("saving") : t("save")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}