import { useEffect, useState } from "react";
import dashboardService from "../../services/dashboardService";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Paper
} from "@mui/material";

function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.getAdminDashboard()
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f4f6f8",
        padding: 3
      }}
    >
      {/* HEADER */}
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
          Admin Dashboard
        </Typography>

        {/* CARDS SECTION */}
        <Grid container spacing={3}>

          {/* Total Users */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography color="text.secondary">
                  Total Users
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {data.total_users}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Active Users */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography color="text.secondary">
                  Active Users
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {data.active_users}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

      </Container>
    </Box>
  );
}

export default AdminDashboard;