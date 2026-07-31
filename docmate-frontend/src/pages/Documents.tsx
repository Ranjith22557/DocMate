import { useEffect, useMemo, useState } from "react";

import Layout from "../components/Layout";
import api from "../services/api";
import type { Document } from "../types/document";

import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Stack,
  Avatar,
  Tooltip,
  IconButton,
  InputAdornment
} from "@mui/material";

import {
  DataGrid,
  type GridColDef
} from "@mui/x-data-grid";

import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";

import { useNavigate } from "react-router-dom";

function Documents() {

  const navigate = useNavigate();

  const [documents, setDocuments] = useState<Document[]>([]);

  const [search, setSearch] = useState("");

  useEffect(() => {

    loadDocuments();

  }, []);

  const loadDocuments = async () => {

    try {

      const response = await api.get("/documents");

      setDocuments(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const filteredDocuments = useMemo(() => {

    return documents.filter((doc) =>

      doc.documentName
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      doc.documentType
        .toLowerCase()
        .includes(search.toLowerCase())

    );

  }, [documents, search]);

  const getStatusChip = (status: string) => {

    switch (status) {

      case "ACTIVE":

        return (
          <Chip
            label="Active"
            color="success"
            size="small"
          />
        );

      case "EXPIRING_SOON":

        return (
          <Chip
            label="Expiring Soon"
            color="warning"
            size="small"
          />
        );

      case "EXPIRED":

        return (
          <Chip
            label="Expired"
            color="error"
            size="small"
          />
        );

      default:

        return (
          <Chip
            label="No Renewal"
            size="small"
          />
        );

    }

  };

  const viewDocument = async (id: string) => {

    try {

      const response = await api.get(
        `/documents/${id}/view`,
        {
          responseType: "blob"
        }
      );

      const contentType = response.headers["content-type"] as string | undefined;

      const file = new Blob(
        [response.data],
        {
          type: contentType
        }
      );

      const url = URL.createObjectURL(file);

      window.open(url, "_blank");

    } catch (error) {

      console.error(error);

      alert("Unable to open document.");

    }

  };

  const downloadDocument = async (
    id: string,
    fileName: string
  ) => {

    try {

      const response = await api.get(
        `/documents/${id}/download`,
        {
          responseType: "blob"
        }
      );

      const url = URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

      alert("Download Failed");

    }

  };

  const deleteDocument = async (id: string) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(`/documents/${id}`);

      alert("Document deleted successfully.");

      loadDocuments();

    } catch (error) {

      console.error(error);

      alert("Delete Failed");

    }

  };

  const columns: GridColDef[] = [

    {
      field: "documentName",
      headerName: "Document",
      flex: 2,
      minWidth: 220,

      renderCell: (params) => (

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            height: "100%"
          }}
        >

          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 38,
              height: 38
            }}
          >
            <DescriptionIcon />
          </Avatar>

          <Typography
            sx={{
              fontWeight: 600
            }}
          >
            {params.row.documentName}
          </Typography>

        </Box>

      )
    },

    {
      field: "documentType",
      headerName: "Type",
      flex: 1,
      minWidth: 120
    },

    {
      field: "expiryDate",
      headerName: "Expiry",
      flex: 1,
      minWidth: 120,

      renderCell: (params) =>

        params.value ?? "-"
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,

      renderCell: (params) =>
        getStatusChip(params.value)
    },

    {
      field: "confidence",
      headerName: "Confidence",
      flex: 0.08,
      minWidth: 100,

      renderCell: (params) => (

        <Chip
          label={`${params.value}%`}
          color="primary"
          size="small"
        />

      )
    },

    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      minWidth: 140,

      renderCell: (params) => (

        <Stack
          direction="row"
          spacing={1}
        >

          <Tooltip title="View">

            <IconButton
              color="primary"
              onClick={() =>
                viewDocument(params.row.id)
              }
            >
              <VisibilityIcon />
            </IconButton>

          </Tooltip>

          <Tooltip title="Download">

            <IconButton
              color="success"
              onClick={() =>
                downloadDocument(
                  params.row.id,
                  params.row.documentName
                )
              }
            >
              <DownloadIcon />
            </IconButton>

          </Tooltip>

          <Tooltip title="Delete">

            <IconButton
              color="error"
              onClick={() =>
                deleteDocument(params.row.id)
              }
            >
              <DeleteIcon />
            </IconButton>

          </Tooltip>

        </Stack>

      )
    }

  ];

  return (
    <Layout>
      <Box sx={{ width: "100%", p: 3 }}>

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3
          }}
        >

          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              My Documents
            </Typography>

            <Typography
              color="text.secondary"
            >
              Manage all your uploaded documents
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => navigate("/upload")}
          >
            Upload Document
          </Button>

        </Box>

        {/* Search */}

        <Card sx={{ mb: 3 }}>

          <CardContent>

            <TextField
              fullWidth
              placeholder="Search documents..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }
              }}
            />

          </CardContent>

        </Card>

        {/* Grid */}

        <Card>

          <CardContent>

            <DataGrid
              rows={filteredDocuments}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                    page: 0
                  }
                }
              }}
              disableRowSelectionOnClick
              autoHeight
              sx={{
                width: "100%",
                minWidth: 1100,
                border: 0,

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#F8FAFC",
                  fontWeight: "bold"
                }
              }}
            />

          </CardContent>

        </Card>

      </Box>

    </Layout>
  );

}

export default Documents;