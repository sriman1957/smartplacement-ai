import {
    ArrowUpRight,
    ChevronRight,
    Edit3,
    LogOut,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { getStudentProfile } from "../services/profileService";
import ResumeManager from "../components/ResumeManager";
import ProfileForm from "../components/ProfileForm";
import "./StudentDashboard.css";

function getInitials(name) {
    if (!name) {
        return "S";
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function formatSkills(skills) {
    if (!skills) {
        return [];
    }

    return skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
}

function calculateProfileCompletion(profile) {
    if (!profile) {
        return 0;
    }

    const fields = [
        profile.name,
        profile.username,
        profile.email,
        profile.phone,
        profile.college,
        profile.degree,
        profile.branch,
        profile.graduationYear,
        profile.skills,
        profile.githubUrl,
        profile.linkedinUrl,
        profile.portfolioUrl,
        profile.careerObjective,
    ];

    const completedFields = fields.filter(
        (field) =>
            field !== null &&
            field !== undefined &&
            String(field).trim() !== ""
    ).length;

    return Math.round(
        (completedFields / fields.length) * 100
    );
}

function StudentDashboard({ onLogout }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profileNotFound, setProfileNotFound] = useState(false);
    const [isProfileFormOpen, setIsProfileFormOpen] =
        useState(false);
    const [isProfilePhotoBroken, setIsProfilePhotoBroken] =
        useState(false);

    const loadProfile = useCallback(async () => {
        setLoading(true);
        setError("");
        setProfileNotFound(false);
        setIsProfilePhotoBroken(false);

        try {
            const data = await getStudentProfile();

            setProfile(data);
        } catch (requestError) {
            const status = requestError.response?.status;

            if (status === 404) {
                setProfileNotFound(true);
                return;
            }

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
                "Unable to load your profile."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    const skills = useMemo(
        () => formatSkills(profile?.skills),
        [profile?.skills]
    );

    const profileCompletion = useMemo(
        () => calculateProfileCompletion(profile),
        [profile]
    );

    function handleProfileSuccess(savedProfile) {
        setProfile(savedProfile);
        setProfileNotFound(false);
        setIsProfileFormOpen(false);
        setIsProfilePhotoBroken(false);
        setError("");
    }

    function handleCreateProfile() {
        setIsProfileFormOpen(true);
    }

    function handleEditProfile() {
        setIsProfileFormOpen(true);
    }

    function handleCancelProfileForm() {
        setIsProfileFormOpen(false);
    }

    function handleProfilePhotoError() {
        setIsProfilePhotoBroken(true);
    }

    function renderProfileAvatar(className) {
        const initials = getInitials(profile?.name);

        if (
            profile?.profilePhotoUrl &&
            !isProfilePhotoBroken
        ) {
            return (
                <img
                    src={profile.profilePhotoUrl}
                    alt={`${profile.name || "Student"} profile`}
                    className={`${className} dashboard-profile-photo`}
                    onError={handleProfilePhotoError}
                />
            );
        }

        return (
            <span className={className}>
                {initials}
            </span>
        );
    }

    if (loading) {
        return (
            <main className="dashboard-page">
                <div
                    className="dashboard-loading"
                    role="status"
                    aria-live="polite"
                >
                    <div className="dashboard-loading-spinner" />

                    <p>Loading your profile...</p>
                </div>
            </main>
        );
    }

    if (isProfileFormOpen) {
        return (
            <ProfileForm
                existingProfile={profile}
                onSuccess={handleProfileSuccess}
                onCancel={handleCancelProfileForm}
            />
        );
    }

    if (error) {
        return (
            <main className="dashboard-page">
                <header className="dashboard-header">
                    <div className="dashboard-brand">
                        <span className="dashboard-brand-mark">
                            S
                        </span>

                        <span>SmartPlacement AI</span>
                    </div>

                    <button
                        type="button"
                        className="dashboard-logout-button"
                        onClick={onLogout}
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </header>

                <div className="dashboard-state-wrapper">
                    <div
                        className="dashboard-state-card"
                        role="alert"
                    >
                        <div className="dashboard-state-content">
                            <p className="dashboard-state-label">
                                Profile
                            </p>

                            <h1>
                                Unable to load your profile
                            </h1>

                            <p>{error}</p>
                        </div>

                        <button
                            type="button"
                            className="dashboard-primary-button"
                            onClick={loadProfile}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (profileNotFound) {
        return (
            <main className="dashboard-page">
                <header className="dashboard-header">
                    <div className="dashboard-brand">
                        <span className="dashboard-brand-mark">
                            S
                        </span>

                        <span>SmartPlacement AI</span>
                    </div>

                    <button
                        type="button"
                        className="dashboard-logout-button"
                        onClick={onLogout}
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </header>

                <div className="dashboard-state-wrapper">
                    <section className="dashboard-state-card dashboard-empty-card">
                        <div className="dashboard-empty-icon">
                            <Edit3 size={20} />
                        </div>

                        <div className="dashboard-state-content">
                            <p className="dashboard-state-label">
                                Placement profile
                            </p>

                            <h1>
                                Complete your profile
                            </h1>

                            <p>
                                Add your education, skills, and
                                professional information to build
                                your placement profile.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="dashboard-primary-button"
                            onClick={handleCreateProfile}
                        >
                            Create profile
                            <ChevronRight size={16} />
                        </button>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <span className="dashboard-brand-mark">
                        S
                    </span>

                    <span>SmartPlacement AI</span>
                </div>

                <div className="dashboard-header-actions">
                    <div className="dashboard-user-context">
                        {renderProfileAvatar(
                            "dashboard-user-avatar"
                        )}

                        <div className="dashboard-user-details">
                            <span className="dashboard-user-name">
                                {profile.name}
                            </span>

                            <span className="dashboard-user-role">
                                {profile.role}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="dashboard-logout-button"
                        onClick={onLogout}
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <section className="dashboard-introduction">
                    <div className="dashboard-introduction-copy">
                        <p className="dashboard-eyebrow">
                            Student dashboard
                        </p>

                        <h1>
                            Welcome, {profile.name}
                        </h1>

                        <p>
                            Keep your placement profile complete
                            and ready for opportunities.
                        </p>
                    </div>

                    <div className="dashboard-introduction-actions">
                        <div className="dashboard-completion">
                            <div className="dashboard-completion-header">
                                <span>
                                    Profile completion
                                </span>

                                <strong>
                                    {profileCompletion}%
                                </strong>
                            </div>

                            <div
                                className="dashboard-progress"
                                role="progressbar"
                                aria-valuenow={
                                    profileCompletion
                                }
                                aria-valuemin="0"
                                aria-valuemax="100"
                                aria-label={`Profile completion ${profileCompletion}%`}
                            >
                                <span
                                    style={{
                                        width: `${profileCompletion}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="dashboard-secondary-button"
                            onClick={handleEditProfile}
                        >
                            <Edit3 size={16} />
                            <span>Edit profile</span>
                        </button>
                    </div>
                </section>

                <div className="dashboard-grid">
                    <section className="dashboard-card dashboard-profile-card">
                        <div className="dashboard-card-header">
                            <p className="dashboard-section-label">
                                Profile
                            </p>

                            <h2>Basic information</h2>
                        </div>

                        <div className="dashboard-profile-identity">
                            {renderProfileAvatar(
                                "dashboard-large-avatar"
                            )}

                            <div className="dashboard-identity-content">
                                <h3>{profile.name}</h3>

                                <p className="dashboard-username">
                                    @{profile.username}
                                </p>

                                <p className="dashboard-email">
                                    {profile.email}
                                </p>

                                <span className="dashboard-role-badge">
                                    {profile.role}
                                </span>
                            </div>
                        </div>

                        <div className="dashboard-details">
                            <div>
                                <span>Phone</span>

                                <strong>
                                    {profile.phone ||
                                        "Not provided"}
                                </strong>
                            </div>

                            <div>
                                <span>College</span>

                                <strong>
                                    {profile.college ||
                                        "Not provided"}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className="dashboard-card">
                        <div className="dashboard-card-header">
                            <p className="dashboard-section-label">
                                Academic
                            </p>

                            <h2>Education</h2>
                        </div>

                        <div className="dashboard-details dashboard-academic-details">
                            <div>
                                <span>Degree</span>

                                <strong>
                                    {profile.degree ||
                                        "Not provided"}
                                </strong>
                            </div>

                            <div>
                                <span>Branch</span>

                                <strong>
                                    {profile.branch ||
                                        "Not provided"}
                                </strong>
                            </div>

                            <div>
                                <span>Graduation year</span>

                                <strong>
                                    {profile.graduationYear ||
                                        "Not provided"}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className="dashboard-card">
                        <div className="dashboard-card-header">
                            <p className="dashboard-section-label">
                                Skills
                            </p>

                            <h2>Technical skills</h2>
                        </div>

                        {skills.length > 0 ? (
                            <div className="dashboard-skills">
                                {skills.map((skill, index) => (
                                    <span
                                        key={`${String(skill)}-${index}`}
                                        className="dashboard-skill"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="dashboard-muted">
                                No skills added yet.
                            </p>
                        )}
                    </section>

                    <section className="dashboard-card">
                        <div className="dashboard-card-header">
                            <p className="dashboard-section-label">
                                Professional presence
                            </p>

                            <h2>Links</h2>
                        </div>

                        <div className="dashboard-links">
                            <a
                                href={
                                    profile.githubUrl || "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={
                                    !profile.githubUrl
                                        ? "disabled"
                                        : ""
                                }
                                onClick={(event) => {
                                    if (!profile.githubUrl) {
                                        event.preventDefault();
                                    }
                                }}
                                aria-disabled={
                                    !profile.githubUrl
                                }
                            >
                                <span className="dashboard-link-content">
                                    <span className="dashboard-link-name">
                                        GitHub
                                    </span>

                                    {profile.githubUrl && (
                                        <span className="dashboard-link-url">
                                            {profile.githubUrl}
                                        </span>
                                    )}
                                </span>

                                <ArrowUpRight size={16} />
                            </a>

                            <a
                                href={
                                    profile.linkedinUrl || "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={
                                    !profile.linkedinUrl
                                        ? "disabled"
                                        : ""
                                }
                                onClick={(event) => {
                                    if (!profile.linkedinUrl) {
                                        event.preventDefault();
                                    }
                                }}
                                aria-disabled={
                                    !profile.linkedinUrl
                                }
                            >
                                <span className="dashboard-link-content">
                                    <span className="dashboard-link-name">
                                        LinkedIn
                                    </span>

                                    {profile.linkedinUrl && (
                                        <span className="dashboard-link-url">
                                            {profile.linkedinUrl}
                                        </span>
                                    )}
                                </span>

                                <ArrowUpRight size={16} />
                            </a>

                            <a
                                href={
                                    profile.portfolioUrl || "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={
                                    !profile.portfolioUrl
                                        ? "disabled"
                                        : ""
                                }
                                onClick={(event) => {
                                    if (!profile.portfolioUrl) {
                                        event.preventDefault();
                                    }
                                }}
                                aria-disabled={
                                    !profile.portfolioUrl
                                }
                            >
                                <span className="dashboard-link-content">
                                    <span className="dashboard-link-name">
                                        Portfolio
                                    </span>

                                    {profile.portfolioUrl && (
                                        <span className="dashboard-link-url">
                                            {profile.portfolioUrl}
                                        </span>
                                    )}
                                </span>

                                <ArrowUpRight size={16} />
                            </a>
                        </div>
                    </section>

                    <ResumeManager />

                    <section className="dashboard-card dashboard-career-card">
                        <div className="dashboard-card-header">
                            <p className="dashboard-section-label">
                                Career
                            </p>

                            <h2>Career objective</h2>
                        </div>

                        <p className="dashboard-career-objective">
                            {profile.careerObjective ||
                                "No career objective added yet."}
                        </p>
                    </section>
                </div>

                <footer className="dashboard-footer">
                    <span>
                        © 2026 SmartPlacement AI
                    </span>

                    <span className="dashboard-footer-dot">
                        ·
                    </span>

                    <span>
                        Your placement profile
                    </span>
                </footer>
            </div>
        </main>
    );
}

export default StudentDashboard;
