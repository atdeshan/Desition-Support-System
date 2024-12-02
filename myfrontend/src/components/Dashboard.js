import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// import UploadIcon from "../images/upload.svg";
import "./dashboard.css";
import Header from "./header";
import UploadIcon from "../images/upload.svg";


const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Handles file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handles file upload to the server
  const handleFileUpload = async (event) => {
    event.preventDefault();
    setUploadStatus(""); // Reset status
    if (!file) {
      setUploadStatus("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("File uploaded successfully.");
        navigate("/sales-graph"); // Navigate to the Sales Graph page
      } else {
        const errorResponse = await response.json();
        setUploadStatus(errorResponse.message || "File upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("An error occurred while uploading the file.");
    }
  };

  return (
    <div className="dashboard">
      <Header />

      {/* File upload section */}
      <div className="file-upload">
        <h1 style={{ textAlign: "left", padding: "5px", marginBottom: "0" }}>Welcome to Your Decision Support Dashboard</h1>
        <form onSubmit={handleFileUpload} encType="multipart/form-data">
          <label htmlFor="file-upload" className="file-label">
            <img
              style={{ width: "70px", height: "70px", fill: "white" }}
              src={UploadIcon}
              alt="Upload Icon"
              className="icon"
            />
          </label>
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            aria-label="Upload CSV file"
          />
          <br />
          <button type="submit" className="upload-button">
            Upload
          </button>
        </form>

        <a
  href={`${process.env.PUBLIC_URL}/gg.csv`}
  download="SampleTemplate.csv"
>
  <button>Download Sample Template</button>
</a>
      </div>
    </div>
  );
};

export default Dashboard;
