import { useEffect, useState } from "react";
import api from "../services/api";
import type { DashboardResponse } from "../types/dashboard";
import Layout from "../components/Layout";
import type { RecentDocument } from "../types/recentDocument";
import type { UpcomingRenewal } from "../types/upcomingRenewal";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";


import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

function Dashboard() {

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);

  const [upcomingRenewals, setUpcomingRenewals] = useState<UpcomingRenewal[]>([]);

  useEffect(() => {

    api.get("/documents/dashboard")
      .then((response) => {
        setDashboard(response.data);
      })
      .catch((error) => {
        console.error("Dashboard Error", error);
      });

    api.get("/documents/recent")
      .then((response) => {
        setRecentDocuments(response.data);
      })
      .catch((error) => {
        console.error("Renewals Error", error);
      });

    api.get("/documents/upcoming-renewals")
      .then((response) => {
        setUpcomingRenewals(response.data);
      })
      .catch((error) => {
        console.error("Upcoming Renewals Error", error);
      });


  }, []);

  const cards = dashboard
    ? [
      {
        title: "Total Documents",
        value: dashboard.totalDocuments,
        icon: <DescriptionIcon fontSize="large" color="primary" />
      },
      {
        title: "Active",
        value: dashboard.activeDocuments,
        icon: <CheckCircleIcon fontSize="large" color="success" />
      },
      {
        title: "Expiring Soon",
        value: dashboard.expiringSoonDocuments,
        icon: <WarningAmberIcon fontSize="large" color="warning" />
      },
      {
        title: "Expired",
        value: dashboard.expiredDocuments,
        icon: <CancelIcon fontSize="large" color="error" />
      },
      {
        title: "No Renewal",
        value: dashboard.noRenewalRequiredDocuments,
        icon: <AssignmentTurnedInIcon fontSize="large" color="secondary" />
      }
    ]
    : [];

  const formatDate = (date: string | null) => {
    if (!date) {
      return "-";
    }
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Layout>

      <Box sx={{ p: 4 }}>

        <Typography
          variant="h4"
          sx={{ fontWeight: "bold" }}
          gutterBottom
        >
          Dashboard
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Overview of your uploaded documents.
        </Typography>

        <Grid container spacing={3}>

          {cards.map((card) => (

            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}
              key={card.title}
            >

              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)"
                  }
                }}
              >

                <CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >

                    <Box>

                      <Typography
                        color="text.secondary"
                      >
                        {card.title}
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold" }}

                      >
                        {card.value}
                      </Typography>

                    </Box>

                    {card.icon}

                  </Box>

                </CardContent>

              </Card>

            </Grid>

          ))}

        </Grid>

        <Box sx={{ mt: 5 }}>

          <Grid container spacing={3}>

            {/* Upcoming Renewals */}

            <Grid size={{ xs: 12, md: 6 }}>

              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  minHeight: 320
                }}
              >

                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  Upcoming Renewals
                </Typography>

                <List>

                  {upcomingRenewals.length === 0 ? (

                    <Typography color="text.secondary">

                      No upcoming renewals.

                    </Typography>

                  ) : (

                    upcomingRenewals.map((doc) => (

                      <div key={doc.id}>

                        <ListItem>

                          <Stack
                            sx={{
                              direction: "row",
                              alignItems: "center",
                              width: "100%"
                            }}
                            spacing={2}
                          >

                            <Avatar sx={{ bgcolor: "#1976d2" }}>
                              <DescriptionIcon />
                            </Avatar>

                            <Box sx={{ flex: 1 }}>

                              <Typography sx={{ fontWeight: 600 }}>
                                {doc.documentName}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Expires on {formatDate(doc.expiryDate)}
                              </Typography>

                            </Box>

                            <Chip
                              label={
                                doc.status === "EXPIRING_SOON"
                                  ? "Expiring Soon"
                                  : "Expired"
                              }
                              color={
                                doc.status === "EXPIRING_SOON"
                                  ? "warning"
                                  : "error"
                              }
                              size="small"
                            />

                          </Stack>

                        </ListItem>

                        <Divider />

                      </div>

                    ))

                  )}

                </List>

              </Paper>

            </Grid>

            {/* Recent Documents */}

            <Grid size={{ xs: 12, md: 6 }}>

              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  minHeight: 320
                }}
              >

                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  Recently Uploaded
                </Typography>

                <List>

                  {recentDocuments.length === 0 ? (

                    <Typography color="text.secondary">

                      No recent documents.

                    </Typography>

                  ) : (

                    recentDocuments.map((doc) => (

                      <div key={doc.id}>

                        <ListItem>

                          <Stack sx={{
                            direction: "row",
                            spacing: 2,
                            alignItems: "center",
                            width: "100%"
                          }}
                          >

                            <Avatar sx={{ bgcolor: "#1976d2" }}>
                              <DescriptionIcon />
                            </Avatar>

                            <Box sx={{ flex: 1 }}>

                              <Typography sx={{ fontWeight: 600 }}>
                                {doc.documentName}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {doc.documentType}
                              </Typography>

                            </Box>

                            <Chip
                              label={`${doc.confidence}%`}
                              color="primary"
                              size="small"
                            />

                          </Stack>

                        </ListItem>

                        <Divider />

                      </div>

                    ))

                  )}

                </List>

              </Paper>

            </Grid>

          </Grid>

        </Box>

      </Box>

    </Layout>
  );

}

export default Dashboard;