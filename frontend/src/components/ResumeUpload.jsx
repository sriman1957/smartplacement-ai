import {
    CheckCircle2,
    FileText,
    Upload,
    X,
} from "lucide-react";
import {
    useRef,
    useState,
} from "react";
import { uploadResume } from "../services/resumeService";
import "./ResumeUpload.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
    ".pdf",
    ".docx",
];

function formatFileSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileExtension(fileName) {
    const lastDotIndex = fileName.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return "";
    }

    return fileName
        .substring(lastDotIndex)
        .toLowerCase();
}

function ResumeUpload({ onUploadSuccess }) {
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    function validateFile(file) {
        if (!file) {
            return "Please select a resume file.";
        }

        const extension = getFileExtension(file.name);

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return "Only PDF and DOCX files are allowed.";
        }

        if (file.size > MAX_FILE_SIZE) {
            return "Resume file size must not exceed 10 MB.";
        }

        return "";
    }

    function handleFileChange(event) {
        const file = event.target.files?.[0];

        setError("");
        setSuccess(false);
        setUploadProgress(0);

        if (!file) {
            setSelectedFile(null);
            return;
        }

        const validationError = validateFile(file);

        if (validationError) {
            setSelectedFile(null);
            setError(validationError);
            return;
        }

        setSelectedFile(file);
    }

    function handleSelectFile() {
        if (uploading) {
            return;
        }

        fileInputRef.current?.click();
    }

    function handleRemoveFile() {
        if (uploading) {
            return;
        }

        setSelectedFile(null);
        setError("");
        setSuccess(false);
        setUploadProgress(0);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function handleUpload() {
        if (!selectedFile || uploading) {
            return;
        }

        const validationError = validateFile(selectedFile);

        if (validationError) {
            setError(validationError);
            return;
        }

        setUploading(true);
        setError("");
        setSuccess(false);
        setUploadProgress(0);

        try {
            const uploadedResume = await uploadResume(
                selectedFile,
                (progressEvent) => {
                    if (!progressEvent.total) {
                        return;
                    }

                    const progress = Math.round(
                        (progressEvent.loaded /
                            progressEvent.total) *
                        100
                    );

                    setUploadProgress(progress);
                }
            );

            setUploadProgress(100);
            setSuccess(true);

            if (onUploadSuccess) {
                onUploadSuccess(uploadedResume);
            }
        } catch (requestError) {
            const status = requestError.response?.status;

            if (status === 401) {
                setError(
                    "Your session has expired. Please sign in again."
                );
            } else if (status === 400) {
                setError(
                    requestError.response?.data?.message ||
                    "The selected resume is invalid."
                );
            } else if (status >= 500) {
                setError(
                    "The server is unavailable. Please try again."
                );
            } else {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to upload your resume."
                );
            }

            setUploadProgress(0);
        } finally {
            setUploading(false);
        }
    }

    return (
        <section className="resume-upload">
            <div className="resume-upload-header">
                <div>
                    <p className="resume-upload-label">
                        Resume
                    </p>

                    <h3>
                        Upload your resume
                    </h3>

                    <p className="resume-upload-description">
                        Upload a PDF or DOCX resume up to 10 MB.
                    </p>
                </div>

                <div className="resume-upload-icon">
                    <FileText size={19} />
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                disabled={uploading}
                hidden
            />

            {!selectedFile && !success && (
                <button
                    type="button"
                    className="resume-upload-dropzone"
                    onClick={handleSelectFile}
                    disabled={uploading}
                >
                    <span className="resume-upload-dropzone-icon">
                        <Upload size={20} />
                    </span>

                    <span className="resume-upload-dropzone-title">
                        Choose your resume
                    </span>

                    <span className="resume-upload-dropzone-text">
                        PDF or DOCX, maximum 10 MB
                    </span>
                </button>
            )}

            {selectedFile && !success && (
                <div className="resume-upload-file">
                    <div className="resume-upload-file-icon">
                        <FileText size={18} />
                    </div>

                    <div className="resume-upload-file-details">
                        <strong>
                            {selectedFile.name}
                        </strong>

                        <span>
                            {formatFileSize(
                                selectedFile.size
                            )}
                        </span>
                    </div>

                    {!uploading && (
                        <button
                            type="button"
                            className="resume-upload-remove"
                            onClick={handleRemoveFile}
                            aria-label="Remove selected resume"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            )}

            {selectedFile && !success && (
                <div className="resume-upload-actions">
                    <button
                        type="button"
                        className="resume-upload-secondary-button"
                        onClick={handleSelectFile}
                        disabled={uploading}
                    >
                        Change file
                    </button>

                    <button
                        type="button"
                        className="resume-upload-primary-button"
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        <Upload size={15} />

                        <span>
                            {uploading
                                ? "Uploading..."
                                : "Upload resume"}
                        </span>
                    </button>
                </div>
            )}

            {uploading && (
                <div
                    className="resume-upload-progress"
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`Resume upload ${uploadProgress}%`}
                >
                    <div className="resume-upload-progress-header">
                        <span>
                            Uploading resume
                        </span>

                        <strong>
                            {uploadProgress}%
                        </strong>
                    </div>

                    <div className="resume-upload-progress-track">
                        <span
                            style={{
                                width: `${uploadProgress}%`,
                            }}
                        />
                    </div>
                </div>
            )}

            {error && (
                <div
                    className="resume-upload-message resume-upload-error"
                    role="alert"
                >
                    <span>
                        {error}
                    </span>
                </div>
            )}

            {success && (
                <div
                    className="resume-upload-message resume-upload-success"
                    role="status"
                >
                    <CheckCircle2 size={17} />

                    <div>
                        <strong>
                            Resume uploaded successfully.
                        </strong>

                        <span>
                            Your latest resume is now available.
                        </span>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ResumeUpload;
