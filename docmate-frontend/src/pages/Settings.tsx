import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import api from "../services/api";

import {
    Box,
    Typography,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Snackbar,
    Alert
} from "@mui/material";

function Settings() {

    const [reminderDays, setReminderDays] = useState(7);

    const [success, setSuccess] = useState(false);

    useEffect(() => {

        loadSettings();

    }, []);

    const loadSettings = async () => {

        try {

            const response = await api.get(
                "/users/reminder-settings"
            );

            setReminderDays(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const saveSettings = async () => {

        try {

            await api.put(
                "/users/reminder-settings",
                {
                    reminderDays
                }
            );

            setSuccess(true);

        } catch (error) {

            console.error(error);

            alert("Unable to save settings.");

        }

    };

    return (

        <Layout>

            <Box
                sx={{
                    p: 4,
                    maxWidth: 700,
                    mx: "auto"
                }}
            >

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 1
                    }}
                >
                    Settings
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Configure your reminder preferences.
                </Typography>

                <Card>

                    <CardContent>

                        <FormControl
                            fullWidth
                            sx={{ mb: 3 }}
                        >

                            <InputLabel>
                                Reminder Days
                            </InputLabel>

                            <Select
                                value={reminderDays}
                                label="Reminder Days"
                                onChange={(e) =>
                                    setReminderDays(
                                        Number(e.target.value)
                                    )
                                }
                            >

                                <MenuItem value={1}>
                                    1 Day Before
                                </MenuItem>

                                <MenuItem value={7}>
                                    7 Days Before
                                </MenuItem>

                                <MenuItem value={15}>
                                    15 Days Before
                                </MenuItem>

                                <MenuItem value={30}>
                                    30 Days Before
                                </MenuItem>

                            </Select>

                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={saveSettings}
                        >
                            Save Settings
                        </Button>

                    </CardContent>

                </Card>

                <Snackbar
                    open={success}
                    autoHideDuration={3000}
                    onClose={() => setSuccess(false)}
                >

                    <Alert
                        severity="success"
                        variant="filled"
                    >
                        Settings updated successfully.
                    </Alert>

                </Snackbar>

            </Box>

        </Layout>

    );

}

export default Settings;