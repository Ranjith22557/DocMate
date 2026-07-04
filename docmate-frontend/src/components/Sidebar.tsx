import { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import api from "../services/api";

import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Divider,
    Box
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

function Sidebar() {

    const location = useLocation();

    const [alertCount, setAlertCount] = useState(0);

    useEffect(() => {

        api.get("/documents/alerts/count")
            .then((response) => {
                setAlertCount(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }, []);

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");

        window.location.href = "/";

    };

    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    background: "#0F172A",
                    color: "white",
                    height: "100vh"
                }
            }}
        >

            <Toolbar>

                <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold" }}>
                    DocMate
                </Typography>

            </Toolbar>

            <Divider sx={{ background: "#334155" }} />

            <List>

                <ListItemButton
                    component={Link}
                    to="/dashboard"
                    selected={location.pathname === "/dashboard"}
                >

                    <ListItemIcon>
                        <DashboardIcon sx={{ color: "white" }} />
                    </ListItemIcon>

                    <ListItemText primary="Dashboard" />

                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/documents"
                    selected={location.pathname === "/documents"}
                >

                    <ListItemIcon>
                        <DescriptionIcon sx={{ color: "white" }} />
                    </ListItemIcon>

                    <ListItemText primary="Documents" />

                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/upload"
                    selected={location.pathname === "/upload"}
                >

                    <ListItemIcon>
                        <UploadFileIcon sx={{ color: "white" }} />
                    </ListItemIcon>

                    <ListItemText primary="Upload" />

                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/alerts"
                    selected={location.pathname === "/alerts"}
                >

                    <ListItemIcon>
                        <NotificationsIcon sx={{ color: "white" }} />
                    </ListItemIcon>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%"
                        }}
                    >

                        <ListItemText primary="Alerts" />

                        <Badge
                            badgeContent={alertCount}
                            color="error"
                            invisible={alertCount === 0}
                        />

                    </Box>

                </ListItemButton>


                <Divider sx={{ background: "#334155", marginY: 2 }} />

                <ListItemButton onClick={logout}>

                    <ListItemIcon>
                        <LogoutIcon sx={{ color: "white" }} />
                    </ListItemIcon>

                    <ListItemText primary="Logout" />

                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/settings"
                    selected={location.pathname === "/settings"}
                >

                    <ListItemIcon>
                        <SettingsIcon sx={{ color: "white" }} />
                    </ListItemIcon>

                    <ListItemText
                        primary="Settings"
                    />

                </ListItemButton>

            </List>

        </Drawer>

    );

}

export default Sidebar;