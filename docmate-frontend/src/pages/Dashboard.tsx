import { useEffect, useState } from "react";
import api from "../services/api";
import type { DashboardResponse } from "../types/dashboard";
import Layout from "../components/Layout";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

function Dashboard() {

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  useEffect(() => {

    api.get("/documents/dashboard")
      .then((response) => {
        setDashboard(response.data);
      })
      .catch((error) => {
        console.error("Dashboard Error", error);
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

  return (
    <Layout>

      <Box sx={{ p: 4 }}>

        <Typography
          variant="h4"
          sx ={{fontWeight:"bold"}} 
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
                        sx={{fontWeight: "bold"}}
                        
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

      </Box>

    </Layout>
  );

}

export default Dashboard;