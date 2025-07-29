import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Fab,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { getUserFiles, logout } from "../services/authService";
import api from "../services/api";

interface FileData {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadTime: string;
}

const FileManagement = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const result = await getUserFiles();

        if (result.success) {
          setFiles(result.files || []);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Handle file upload
  const handleUploadClick = () => {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await api.post("/files/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.file) {
            // Add the new file to the files list
            setFiles([response.data.file, ...files]);
          }
        } catch (err) {
          setError("File upload failed");
        }
      }
    };
    fileInput.click();
  };

  // Handle file download
  const handleDownload = async (fileId: string) => {
    try {
      const response = await api.get(`/files/${fileId}/download`, {
        responseType: "blob",
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        files.find((f) => f.id === fileId)?.originalName || "file"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("File download failed");
    }
  };

  // Handle file deletion
  const handleDelete = async (fileId: string) => {
    try {
      await api.delete(`/files/${fileId}`);

      // Remove the file from the files list
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (err) {
      setError("File deletion failed");
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Container maxWidth={false} sx={{ pt: 3, pb: 3 }}>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wonder Cloud Drive
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">My Files</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          {files.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography>No files found</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Upload your first file to get started
              </Typography>
            </Box>
          ) : (
            <List>
              {files.map((file) => (
                <ListItem key={file.id} divider>
                  <ListItemText
                    primary={file.originalName}
                    secondary={`Size: ${formatFileSize(
                      file.size
                    )} | Uploaded: ${new Date(
                      file.uploadTime
                    ).toLocaleString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() => handleDownload(file.id)}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(file.id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      <Fab
        color="primary"
        aria-label="upload"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleUploadClick}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default FileManagement;
