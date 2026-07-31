import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import api from "../services/api";

import type { Alert } from "../types/alert";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Avatar,
    Stack,
    Button
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";



function Alerts() {

    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {

        api.get("/documents/alert")
            .then((response) => {
                setAlerts(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }, []);

    const formatDate = (date: string) => {

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };

    const viewDocument = async (id: string) => {

        try {

            const response = await api.get(
                `/documents/${id}/view`,
                {
                    responseType: "blob"
                }
            );

            const file = new Blob(
                [response.data],
                {
                    type: "application/pdf"
                }
            );

            const url = URL.createObjectURL(file);

            window.open(url, "_blank");

        } catch (error) {

            console.error(error);

            alert("Unable to open document.");

        }

    };

    return (

        <Layout>

            <Box sx={{ p: 4 }}>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 1
                    }}
                >
                    Alerts
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mb: 4 }}

                >
                    Documents that require your attention.
                </Typography>

                {

                    alerts.length === 0 ?

                        (

                            <Card>

                                <CardContent>

                                    <Typography
                                        align="center"
                                    >

                                        🎉 No alerts available.

                                    </Typography>

                                </CardContent>

                            </Card>

                        )

                        :

                        (

                            alerts.map((alert) => (

                                <Card
                                    key={alert.id}
                                    sx={{
                                        mb: 3,
                                        borderRadius: 3,

                                        borderLeft:
                                            alert.status === "EXPIRED"
                                                ? "6px solid #d32f2f"
                                                : "6px solid #ed6c02",

                                        transition: "0.3s",

                                        "&:hover": {
                                            transform: "translateY(-3px)",
                                            boxShadow: 6
                                        }
                                    }}
                                >

                                    <CardContent sx={{ py: 2.5 }}>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: 3
                                            }}
                                        >

                                            {/* Left Side */}

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 2,
                                                    flex: 1
                                                }}
                                            >

                                                <Avatar
                                                    sx={{
                                                        bgcolor:
                                                            alert.status === "EXPIRED"
                                                                ? "#d32f2f"
                                                                : "#ed6c02",
                                                        width: 46,
                                                        height: 46
                                                    }}
                                                >
                                                    <DescriptionIcon />
                                                </Avatar>

                                                <Box>

                                                    <Typography
                                                        variant="h6"
                                                        sx={{fontWeight:600}}
                                                    >
                                                        {alert.documentName}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {alert.documentType}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        Expiry Date : {formatDate(alert.expiryDate)}
                                                    </Typography>

                                                </Box>

                                            </Box>

                                            {/* Right Side */}

                                            <Stack sx={{
                                                direction:"row",
                                                spacing:2,
                                                alignItems:"center"
                                                }}
                                            >

                                                <Chip
                                                    label={
                                                        alert.status === "EXPIRED"
                                                            ? "Expired"
                                                            : "Expiring Soon"
                                                    }
                                                    color={
                                                        alert.status === "EXPIRED"
                                                            ? "error"
                                                            : "warning"
                                                    }
                                                />

                                                <Button
                                                    variant="outlined"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => viewDocument(alert.id)}
                                                >
                                                    View
                                                </Button>

                                            </Stack>

                                        </Box>

                                    </CardContent>

                                </Card>

                            ))

                        )

                }

            </Box>

        </Layout>

    );

}

export default Alerts;