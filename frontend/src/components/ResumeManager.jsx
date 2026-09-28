import {
    AlertTriangle,
    CheckCircle2,
    Download,
    Eye,
    FileText,
    LoaderCircle,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    deleteResume,
    getResumes,
    getResumeFile,
} from "../services/resumeService";
import ResumeUpload from "./ResumeUpload";
import ResumeAnalysis from "./ResumeAnalysis";
import "./ResumeManager.css";

function formatFileSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatUploadedDate(value) {
    if (!value) {
        return "Unknown date";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function getFileTypeLabel(fileType) {
    if (fileType === "application/pdf") {
        return "PDF";
    }

    if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        return "DOCX";
    }

    return fileType || "Unknown";
}

function ResumeManager() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingResumeId, setDeletingResumeId] =
        useState(null);
    const [viewingResumeId, setViewingResumeId] =
        useState(null);
    const [downloadResumeId, setDownloadResumeId] =
        useState(null);
    const [successMessage, setSuccessMessage] =
        useState("");
    const [isReplacing, setIsReplacing] =
        useState(false);
    const [resumeToDelete, setResumeToDelete] =
        useState(null);

    const loadResumes = useCallback(async () => {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const data = await getResumes();

            setResumes(Array.isArray(data) ? data : []);
        } catch (requestError) {
            const status = requestError.response?.status;

            if (status === 401) {
                setError(
                    "Your session has expired. Please sign in again."
                );
                return;
            }

            if (status >= 500) {
                setError(
                    "The server is unavailable. Please try again."
                );
                return;
            }

            setError(
                requestError.response?.data?.message ||
                "Unable to load your resume."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadResumes();
    }, [loadResumes]);

    function handleReplaceClick() {
        if (
            viewingResumeId ||
            downloadResumeId ||
            deletingResumeId
        ) {
            return;
        }

        setError("");
        setSuccessMessage("");
        setIsReplacing(true);
    }

    function handleCancelReplace() {
        setError("");
        setSuccessMessage("");
        setIsReplacing(false);
    }

    function handleUploadSuccess(uploadedResume) {
        setSuccessMessage(
            "Resume uploaded successfully."
        );

        setIsReplacing(false);

        if (uploadedResume) {
            setResumes([uploadedResume]);
        } else {
            void loadResumes();
        }
    }

    function handleDeleteClick(resume) {
        if (
            deletingResumeId ||
            viewingResumeId ||
            downloadResumeId ||
            isReplacing
        ) {
            return;
        }

        setError("");
        setSuccessMessage("");
        setResumeToDelete(resume);
    }

    function handleCancelDelete() {
        if (deletingResumeId) {
            return;
        }

        setResumeToDelete(null);
    }

    async function handleConfirmDelete() {
        if (!resumeToDelete || deletingResumeId) {
            return;
        }

        const resume = resumeToDelete;

        setDeletingResumeId(resume.id);
        setError("");
        setSuccessMessage("");

        try {
            await deleteResume(resume.id);

            setResumes((currentResumes) =>
                currentResumes.filter(
                    (currentResume) =>
                        currentResume.id !== resume.id
                )
            );

            setResumeToDelete(null);

            setSuccessMessage(
                "Resume deleted successfully."
            );
        } catch (requestError) {
            const status = requestError.response?.status;

            if (status === 401) {
                setError(
                    "Your session has expired. Please sign in again."
                );
            } else if (status === 404) {
                setError("Resume not found.");

                setResumeToDelete(null);

                void loadResumes();
            } else if (status >= 500) {
                setError(
                    "The server is unavailable. Please try again."
                );
            } else {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to delete your resume."
                );
            }
        } finally {
            setDeletingResumeId(null);
        }
    }

    async function handleViewResume(resume) {
        if (
            viewingResumeId ||
            downloadResumeId ||
            deletingResumeId ||
            isReplacing
        ) {
            return;
        }

        setViewingResumeId(resume.id);
        setError("");
        setSuccessMessage("");

        const resumeWindow = window.open(
            "",
            "_blank"
        );

        if (!resumeWindow) {
            setViewingResumeId(null);

            setError(
                "Unable to open the resume viewer."
            );

            return;
        }

        resumeWindow.document.title = "Opening resume...";

        try {
            const file = await getResumeFile(resume.id);

            const fileUrl = URL.createObjectURL(file);

            resumeWindow.location.href = fileUrl;

            window.setTimeout(() => {
                URL.revokeObjectURL(fileUrl);
            }, 60000);
        } catch (requestError) {
            resumeWindow.close();

            const status = requestError.response?.status;

            if (status === 401) {
                setError(
                    "Your session has expired. Please sign in again."
                );
            } else if (status === 404) {
                setError("Resume not found.");
            } else if (status >= 500) {
                setError(
                    "The server is unavailable. Please try again."
                );
            } else {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to open your resume."
                );
            }
        } finally {
            setViewingResumeId(null);
        }
    }

    async function handleDownloadResume(resume) {
        if (
            viewingResumeId ||
            downloadResumeId ||
            deletingResumeId ||
            isReplacing
        ) {
            return;
        }

        setDownloadResumeId(resume.id);
        setError("");
        setSuccessMessage("");

        try {
            const file = await getResumeFile(resume.id);

            const fileUrl = URL.createObjectURL(file);
            const link = document.createElement("a");

            link.href = fileUrl;
            link.download =
                resume.fileName || "resume";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.setTimeout(() => {
                URL.revokeObjectURL(fileUrl);
            }, 1000);
        } catch (requestError) {
            const status = requestError.response?.status;

            if (status === 401) {
                setError(
                    "Your session has expired. Please sign in again."
                );
            } else if (status === 404) {
                setError("Resume not found.");
            } else if (status >= 500) {
                setError(
                    "The server is unavailable. Please try again."
                );
            } else {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to download your resume."
                );
            }
        } finally {
            setDownloadResumeId(null);
        }
    }

    if (loading) {
        return (
            <section className="resume-manager">
                <div className="resume-manager-header">
                    <div>
                        <p className="resume-manager-label">
                            Resume
                        </p>

                        <h2>Your resume</h2>
                    </div>

                    <div className="resume-manager-header-icon">
                        <FileText size={19} />
                    </div>
                </div>

                <div
                    className="resume-manager-loading"
                    role="status"
                    aria-live="polite"
                >
                    <LoaderCircle
                        size={20}
                        className="resume-manager-spinner"
                    />

                    <span>
                        Loading your resume...
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section className="resume-manager">
            <div className="resume-manager-header">
                <div>
                    <p className="resume-manager-label">
                        Resume
                    </p>

                    <h2>Your resume</h2>

                    <p className="resume-manager-description">
                        Manage the resume used for your
                        placement profile.
                    </p>
                </div>

                <div className="resume-manager-header-icon">
                    <FileText size={19} />
                </div>
            </div>

            {error && (
                <div
                    className="resume-manager-message resume-manager-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {successMessage && (
                <div
                    className="resume-manager-message resume-manager-success"
                    role="status"
                >
                    <CheckCircle2 size={16} />

                    <span>
                        {successMessage}
                    </span>
                </div>
            )}

            {resumes.length === 0 ? (
                <div className="resume-manager-empty-state">
                    <ResumeUpload
                        onUploadSuccess={
                            handleUploadSuccess
                        }
                    />
                </div>
            ) : (
                <div className="resume-manager-list">
                    {resumes.map((resume) => (
                        <article
                            key={resume.id}
                            className="resume-manager-item"
                        >
                            <div className="resume-manager-file-icon">
                                <FileText size={19} />
                            </div>

                            <div className="resume-manager-file-info">
                                <h3>
                                    {resume.fileName}
                                </h3>

                                <div className="resume-manager-meta">
                                    <span>
                                        {getFileTypeLabel(
                                            resume.fileType
                                        )}
                                    </span>

                                    <span>
                                        {formatFileSize(
                                            resume.fileSize
                                        )}
                                    </span>

                                    <span>
                                        Uploaded{" "}
                                        {formatUploadedDate(
                                            resume.uploadedAt
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="resume-manager-actions">
                                <button
                                    type="button"
                                    className="resume-manager-action-button"
                                    onClick={() =>
                                        handleViewResume(
                                            resume
                                        )
                                    }
                                    disabled={
                                        viewingResumeId !==
                                        null ||
                                        downloadResumeId !==
                                        null ||
                                        deletingResumeId !==
                                        null ||
                                        isReplacing
                                    }
                                >
                                    {viewingResumeId ===
                                    resume.id ? (
                                        <LoaderCircle
                                            size={15}
                                            className="resume-manager-button-spinner"
                                        />
                                    ) : (
                                        <Eye size={15} />
                                    )}

                                    <span>
                                        View
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="resume-manager-action-button"
                                    onClick={() =>
                                        handleDownloadResume(
                                            resume
                                        )
                                    }
                                    disabled={
                                        viewingResumeId !==
                                        null ||
                                        downloadResumeId !==
                                        null ||
                                        deletingResumeId !==
                                        null ||
                                        isReplacing
                                    }
                                >
                                    {downloadResumeId ===
                                    resume.id ? (
                                        <LoaderCircle
                                            size={15}
                                            className="resume-manager-button-spinner"
                                        />
                                    ) : (
                                        <Download size={15} />
                                    )}

                                    <span>
                                        Download
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="resume-manager-action-button"
                                    onClick={
                                        handleReplaceClick
                                    }
                                    disabled={
                                        viewingResumeId !==
                                        null ||
                                        downloadResumeId !==
                                        null ||
                                        deletingResumeId !==
                                        null ||
                                        isReplacing
                                    }
                                >
                                    <Upload size={15} />

                                    <span>
                                        Replace
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="resume-manager-action-button"
                                    onClick={() =>
                                        handleDeleteClick(
                                            resume
                                        )
                                    }
                                    disabled={
                                        deletingResumeId !==
                                        null ||
                                        viewingResumeId !==
                                        null ||
                                        downloadResumeId !==
                                        null ||
                                        isReplacing
                                    }
                                >
                                    {deletingResumeId ===
                                    resume.id ? (
                                        <LoaderCircle
                                            size={15}
                                            className="resume-manager-button-spinner"
                                        />
                                    ) : (
                                        <Trash2 size={15} />
                                    )}

                                    <span>
                                        Delete
                                    </span>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {!isReplacing && (
                <ResumeAnalysis
                    resume={resumes[0] || null}
                />
            )}

            {isReplacing && (
                <div className="resume-manager-replace">
                    <div className="resume-manager-replace-header">
                        <div>
                            <p className="resume-manager-replace-label">
                                Replace resume
                            </p>

                            <h3>
                                Upload a new resume
                            </h3>

                            <p>
                                Your existing resume will be
                                replaced after a successful upload.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="resume-manager-cancel-button"
                            onClick={handleCancelReplace}
                            aria-label="Cancel resume replacement"
                        >
                            <X size={17} />
                        </button>
                    </div>

                    <ResumeUpload
                        onUploadSuccess={
                            handleUploadSuccess
                        }
                    />
                </div>
            )}

            {resumeToDelete && (
                <div
                    className="resume-manager-modal-backdrop"
                    role="presentation"
                >
                    <div
                        className="resume-manager-delete-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="resume-delete-title"
                        aria-describedby="resume-delete-description"
                    >
                        <div className="resume-manager-delete-modal-icon">
                            <AlertTriangle size={20} />
                        </div>

                        <div className="resume-manager-delete-modal-content">
                            <h3 id="resume-delete-title">
                                Delete resume?
                            </h3>

                            <p id="resume-delete-description">
                                Are you sure you want to delete{" "}
                                <strong>
                                    {resumeToDelete.fileName}
                                </strong>
                                ? This action will remove the
                                resume from your account.
                            </p>
                        </div>

                        <div className="resume-manager-delete-modal-actions">
                            <button
                                type="button"
                                className="resume-manager-modal-cancel-button"
                                onClick={
                                    handleCancelDelete
                                }
                                disabled={
                                    deletingResumeId !==
                                    null
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="resume-manager-modal-delete-button"
                                onClick={
                                    handleConfirmDelete
                                }
                                disabled={
                                    deletingResumeId !==
                                    null
                                }
                            >
                                {deletingResumeId ===
                                resumeToDelete.id ? (
                                    <LoaderCircle
                                        size={15}
                                        className="resume-manager-button-spinner"
                                    />
                                ) : (
                                    <Trash2 size={15} />
                                )}

                                <span>
                                    {deletingResumeId ===
                                    resumeToDelete.id
                                        ? "Deleting..."
                                        : "Delete resume"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ResumeManager;
