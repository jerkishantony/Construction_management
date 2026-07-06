import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import profileService from "../../services/profileService";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box width="100%">
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Stack
                spacing={2}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 40,
                    bgcolor: "primary.main",
                  }}
                >
                  {profile.full_name?.charAt(0)}
                </Avatar>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  textAlign="center"
                >
                  {profile.full_name}
                </Typography>

                <Typography color="text.secondary">
                  {profile.role}
                </Typography>

                <Chip
                  label={
                    profile.is_active
                      ? "Active"
                      : "Inactive"
                  }
                  color={
                    profile.is_active
                      ? "success"
                      : "error"
                  }
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Personal Information
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>

                <Stack direction="row" spacing={2}>
                  <PersonIcon />
                  <Typography>
                    <b>Username :</b> {profile.username}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <EmailIcon />
                  <Typography>
                    <b>Email :</b> {profile.email}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <PhoneIcon />
                  <Typography>
                    <b>Phone :</b> {profile.phone}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <BusinessIcon />
                  <Typography>
                    <b>Company :</b> {profile.company_name}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <BadgeIcon />
                  <Typography>
                    <b>Role :</b> {profile.role}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <WorkspacePremiumIcon />
                  <Typography>
                    <b>Plan :</b> {profile.plan}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <CalendarMonthIcon />
                  <Typography>
                    <b>Subscription :</b>{" "}
                    {profile.subscription_start} - {profile.subscription_end}
                  </Typography>
                </Stack>

              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}