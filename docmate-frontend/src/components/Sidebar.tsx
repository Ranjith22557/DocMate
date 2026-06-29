import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Divider
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

function Sidebar() {

    const location = useLocation();

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
                    sx={{fontWeight: "bold"}}>
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

                    <ListItemText primary="Alerts" />

                </ListItemButton>

                <Divider sx={{ background: "#334155", marginY: 2 }} />

                <ListItemButton onClick={logout}>

                    <ListItemIcon>
                        <LogoutIcon sx={{ color: "white" }} />
                    </ListItemIcon>

                    <ListItemText primary="Logout" />

                </ListItemButton>

            </List>

        </Drawer>

    );

}

export default Sidebar;