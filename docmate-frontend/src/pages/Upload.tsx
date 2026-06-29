import { useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Upload() {

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

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
                "/documents/upload",formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log(response.data);

            alert("Document Uploaded Successfully!");

            setFile(null);

        } catch (error) {
            console.error(error);
            alert("Upload Failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Layout>

            <h1>Upload Document</h1>
            <br />
            <input
                type="file"
                onChange={(e) => {
                    if (e.target.files) {
                        setFile(e.target.files[0]);
                    }
                }}
            />
            <br />
            <br />

            <button onClick={uploadDocument} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
        </Layout>
    );
}

export default Upload;