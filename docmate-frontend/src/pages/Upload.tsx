import { useRef, useState } from "react";

import Layout from "../components/Layout";
import api from "../services/api";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Stack,
    Paper,
    LinearProgress,
    Snackbar,
    Alert
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";


function Upload() {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);


    const uploadDocument = async () => {

        if (!file) {
            alert("Please select a document.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            const response = await api.post(
                "/documents/upload", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log(response.data);

            setSuccess(true);

            setFile(null);
            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (error) {
            console.error(error);
            alert("Upload Failed");
        } finally {
            setUploading(false);
        }
    };

    return (

        <Layout>

            <Box
                sx={{
                    p: 4,
                    maxWidth: 900,
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
                    Upload Document
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Upload and organize your important documents securely.
                </Typography>

                <Card>

                    <CardContent>

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 5,
                                textAlign: "center",
                                borderStyle: "dashed",
                                borderWidth: 2,
                                cursor: "pointer",
                                transition: "0.3s",

                                "&:hover": {
                                    background: "#fafafa"
                                }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                        >

                            <UploadFileIcon
                                sx={{
                                    fontSize: 70,
                                    color: "primary.main",
                                    mb: 2
                                }}
                            />

                            <Typography variant="h6">

                                Drag & Drop your document

                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >

                                or click to browse

                            </Typography>

                            <Button
                                variant="contained"
                            >

                                Choose File

                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                onChange={(e) => {

                                    if (e.target.files) {

                                        setFile(e.target.files[0]);

                                    }

                                }}
                            />

                        </Paper>

                        {

                            file && (

                                <Card
                                    sx={{
                                        mt: 3,
                                        background: "#fafafa"
                                    }}
                                >

                                    <CardContent>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2
                                            }}
                                        >
                                            <DescriptionIcon color="primary" />

                                            <Box>
                                                <Typography sx={{ fontWeight: 600 }}>
                                                    {file.name}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </Typography>
                                            </Box>
                                        </Box>

                                    </CardContent>

                                </Card>

                            )

                        }

                        {

                            uploading && (

                                <LinearProgress
                                    sx={{ mt: 3 }}
                                />

                            )

                        }

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                            disabled={!file || uploading}
                            onClick={uploadDocument}
                        >

                            {

                                uploading

                                    ?

                                    "Uploading..."

                                    :

                                    "Upload Document"

                            }

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

                        Document uploaded successfully.

                    </Alert>

                </Snackbar>

            </Box>

        </Layout>

    );
}

export default Upload;