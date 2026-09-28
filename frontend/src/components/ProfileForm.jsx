import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    Save,
} from "lucide-react";
import {
    createStudentProfile,
    updateStudentProfile,
} from "../services/profileService";
import "./ProfileForm.css";

const initialFormData = {
    phone: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
    skills: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    profilePhotoUrl: "",
    careerObjective: "",
};

function GitHubIcon({ size = 16 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 0.6C5.73 0.6 0.65 5.68 0.65 11.95c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.01-2.1-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.66 1.23 3.31.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.61 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.44.11-3 0 0 .95-.3 3.12 1.16a10.8 10.8 0 0 1 5.68 0c2.17-1.46 3.12-1.16 3.12-1.16.62 1.56.23 2.71.11 3 .73.79 1.17 1.8 1.17 3.04 0 4.36-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.1 0 1.52-.01 2.75-.01 3.12 0 .3.21.65.79.54a11.36 11.36 0 0 0 7.77-10.78C23.35 5.68 18.27.6 12 .6Z" />
        </svg>
    );
}

function LinkedInIcon({ size = 16 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.68H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.37 4.28 5.46v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.56 20.45h3.57V8.99H3.56v11.46ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
        </svg>
    );
}

function RequiredMark() {
    return (
        <span
            className="profile-form-required-mark"
            aria-hidden="true"
        >
            *
        </span>
    );
}

function OptionalLabel() {
    return (
        <span className="profile-form-optional">
            (optional)
        </span>
    );
}

function ProfileForm({
                         existingProfile = null,
                         onSuccess,
                         onCancel,
                     }) {
    const [formData, setFormData] = useState(initialFormData);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = Boolean(existingProfile);

    useEffect(() => {
        if (!existingProfile) {
            setFormData(initialFormData);
            return;
        }

        setFormData({
            phone: existingProfile.phone || "",
            college: existingProfile.college || "",
            degree: existingProfile.degree || "",
            branch: existingProfile.branch || "",
            graduationYear: existingProfile.graduationYear
                ? String(existingProfile.graduationYear)
                : "",
            skills: existingProfile.skills || "",
            githubUrl: existingProfile.githubUrl || "",
            linkedinUrl: existingProfile.linkedinUrl || "",
            portfolioUrl: existingProfile.portfolioUrl || "",
            profilePhotoUrl:
                existingProfile.profilePhotoUrl || "",
            careerObjective:
                existingProfile.careerObjective || "",
        });
    }, [existingProfile]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));

        setErrorMessage("");
        setSuccessMessage("");
    }

    function isValidUrl(value) {
        try {
            const url = new URL(value);

            return (
                url.protocol === "http:" ||
                url.protocol === "https:"
            );
        } catch {
            return false;
        }
    }

    function validateForm() {
        if (!formData.phone.trim()) {
            return "Phone number is required";
        }

        if (
            !/^[0-9+\-()\s]{10,15}$/.test(
                formData.phone.trim()
            )
        ) {
            return "Enter a valid phone number";
        }

        if (!formData.college.trim()) {
            return "College is required";
        }

        if (!formData.degree.trim()) {
            return "Degree is required";
        }

        if (!formData.branch.trim()) {
            return "Branch is required";
        }

        if (!formData.graduationYear.trim()) {
            return "Graduation year is required";
        }

        const graduationYear = Number(
            formData.graduationYear
        );

        const currentYear = new Date().getFullYear();

        if (
            !Number.isInteger(graduationYear) ||
            graduationYear < currentYear - 10 ||
            graduationYear > currentYear + 10
        ) {
            return "Enter a valid graduation year";
        }

        if (!formData.skills.trim()) {
            return "Add at least one skill";
        }

        if (
            formData.githubUrl.trim() &&
            !isValidUrl(formData.githubUrl)
        ) {
            return "Enter a valid GitHub URL";
        }

        if (
            formData.linkedinUrl.trim() &&
            !isValidUrl(formData.linkedinUrl)
        ) {
            return "Enter a valid LinkedIn URL";
        }

        if (
            formData.portfolioUrl.trim() &&
            !isValidUrl(formData.portfolioUrl)
        ) {
            return "Enter a valid portfolio URL";
        }

        if (
            formData.profilePhotoUrl.trim() &&
            !isValidUrl(formData.profilePhotoUrl)
        ) {
            return "Enter a valid profile photo URL";
        }

        if (!formData.careerObjective.trim()) {
            return "Career objective is required";
        }

        return "";
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        const validationError = validateForm();

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        const profileData = {
            phone: formData.phone.trim(),
            college: formData.college.trim(),
            degree: formData.degree.trim(),
            branch: formData.branch.trim(),
            graduationYear: Number(
                formData.graduationYear
            ),
            skills: formData.skills.trim(),
            githubUrl: formData.githubUrl.trim(),
            linkedinUrl: formData.linkedinUrl.trim(),
            portfolioUrl: formData.portfolioUrl.trim(),
            profilePhotoUrl:
                formData.profilePhotoUrl.trim(),
            careerObjective:
                formData.careerObjective.trim(),
        };

        setIsSubmitting(true);

        try {
            const savedProfile = isEditMode
                ? await updateStudentProfile(profileData)
                : await createStudentProfile(profileData);

            setSuccessMessage(
                isEditMode
                    ? "Profile updated successfully."
                    : "Profile created successfully."
            );

            if (!isEditMode) {
                setFormData(initialFormData);
            }

            setTimeout(() => {
                onSuccess(savedProfile);
            }, 600);
        } catch (error) {
            if (error.response?.status === 400) {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Please check the profile information."
                );
                return;
            }

            if (error.response?.status === 401) {
                setErrorMessage(
                    "Your session has expired. Please log in again."
                );
                return;
            }

            if (error.response?.status === 409) {
                setErrorMessage(
                    error.response?.data?.message ||
                    "A student profile already exists."
                );
                return;
            }

            if (error.response?.status >= 500) {
                setErrorMessage(
                    "The server could not save your profile. Please try again."
                );
                return;
            }

            setErrorMessage(
                error.response?.data?.message ||
                "Unable to save your profile. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="profile-form-page">
            <div className="profile-form-container">
                <div className="profile-form-header">
                    <button
                        type="button"
                        className="profile-form-back-button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        <ArrowLeft size={17} />
                        <span>Back to dashboard</span>
                    </button>

                    <p className="profile-form-eyebrow">
                        {isEditMode
                            ? "EDIT PROFILE"
                            : "PROFILE SETUP"}
                    </p>

                    <h1>
                        {isEditMode
                            ? "Update your profile"
                            : "Create your placement profile"}
                    </h1>

                    <p>
                        Add accurate information about your education,
                        skills, and professional presence.
                    </p>
                </div>

                <form
                    className="profile-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <section className="profile-form-section">
                        <div className="profile-form-section-header">
                            <div>
                                <p className="profile-form-section-label">
                                    Personal
                                </p>

                                <h2>Contact information</h2>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="profile-form-field">
                                <label htmlFor="phone">
                                    Phone number{" "}
                                    <RequiredMark />
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    disabled={isSubmitting}
                                    autoComplete="tel"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="profile-form-section">
                        <div className="profile-form-section-header">
                            <div>
                                <p className="profile-form-section-label">
                                    Education
                                </p>

                                <h2>Academic information</h2>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="profile-form-field profile-form-field-full">
                                <label htmlFor="college">
                                    College{" "}
                                    <RequiredMark />
                                </label>

                                <input
                                    id="college"
                                    name="college"
                                    type="text"
                                    value={formData.college}
                                    onChange={handleChange}
                                    placeholder="Your college or university"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div className="profile-form-field">
                                <label htmlFor="degree">
                                    Degree{" "}
                                    <RequiredMark />
                                </label>

                                <input
                                    id="degree"
                                    name="degree"
                                    type="text"
                                    value={formData.degree}
                                    onChange={handleChange}
                                    placeholder="B.Tech"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div className="profile-form-field">
                                <label htmlFor="branch">
                                    Branch{" "}
                                    <RequiredMark />
                                </label>

                                <input
                                    id="branch"
                                    name="branch"
                                    type="text"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    placeholder="Computer Science and Engineering"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div className="profile-form-field">
                                <label htmlFor="graduationYear">
                                    Graduation year{" "}
                                    <RequiredMark />
                                </label>

                                <input
                                    id="graduationYear"
                                    name="graduationYear"
                                    type="number"
                                    value={formData.graduationYear}
                                    onChange={handleChange}
                                    placeholder="2027"
                                    disabled={isSubmitting}
                                    min="2016"
                                    max="2036"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="profile-form-section">
                        <div className="profile-form-section-header">
                            <div>
                                <p className="profile-form-section-label">
                                    Skills
                                </p>

                                <h2>Technical skills</h2>
                            </div>
                        </div>

                        <div className="profile-form-field profile-form-field-full">
                            <label htmlFor="skills">
                                Skills{" "}
                                <RequiredMark />
                            </label>

                            <input
                                id="skills"
                                name="skills"
                                type="text"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="Go, Java, Spring Boot, React, MySQL"
                                disabled={isSubmitting}
                                required
                            />

                            <span className="profile-form-help">
                                Separate multiple skills with commas.
                            </span>
                        </div>
                    </section>

                    <section className="profile-form-section">
                        <div className="profile-form-section-header">
                            <div>
                                <p className="profile-form-section-label">
                                    Professional
                                </p>

                                <h2>Online presence</h2>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="profile-form-field">
                                <label htmlFor="githubUrl">
                                    <GitHubIcon size={15} />
                                    GitHub URL{" "}
                                    <OptionalLabel />
                                </label>

                                <input
                                    id="githubUrl"
                                    name="githubUrl"
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="profile-form-field">
                                <label htmlFor="linkedinUrl">
                                    <LinkedInIcon size={15} />
                                    LinkedIn URL{" "}
                                    <OptionalLabel />
                                </label>

                                <input
                                    id="linkedinUrl"
                                    name="linkedinUrl"
                                    type="url"
                                    value={formData.linkedinUrl}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="profile-form-field profile-form-field-full">
                                <label htmlFor="portfolioUrl">
                                    Portfolio URL{" "}
                                    <OptionalLabel />
                                </label>

                                <input
                                    id="portfolioUrl"
                                    name="portfolioUrl"
                                    type="url"
                                    value={formData.portfolioUrl}
                                    onChange={handleChange}
                                    placeholder="https://yourportfolio.com"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="profile-form-field profile-form-field-full">
                                <label htmlFor="profilePhotoUrl">
                                    Profile photo URL{" "}
                                    <OptionalLabel />
                                </label>

                                <input
                                    id="profilePhotoUrl"
                                    name="profilePhotoUrl"
                                    type="url"
                                    value={formData.profilePhotoUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/profile-photo.jpg"
                                    disabled={isSubmitting}
                                />

                                <span className="profile-form-help">
                                    Enter a direct HTTPS URL to your profile
                                    photo.
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="profile-form-section">
                        <div className="profile-form-section-header">
                            <div>
                                <p className="profile-form-section-label">
                                    Career
                                </p>

                                <h2>Career objective</h2>
                            </div>
                        </div>

                        <div className="profile-form-field profile-form-field-full">
                            <label htmlFor="careerObjective">
                                Career objective{" "}
                                <RequiredMark />
                            </label>

                            <textarea
                                id="careerObjective"
                                name="careerObjective"
                                value={formData.careerObjective}
                                onChange={handleChange}
                                placeholder="Describe the type of role you want and the kind of software work you want to pursue."
                                disabled={isSubmitting}
                                rows="5"
                                required
                            />

                            <span className="profile-form-help">
                                Keep this focused on your career direction and
                                professional goals.
                            </span>
                        </div>
                    </section>

                    {errorMessage && (
                        <div
                            className="profile-form-message profile-form-error"
                            role="alert"
                        >
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div
                            className="profile-form-message profile-form-success"
                            role="status"
                        >
                            <CheckCircle2 size={17} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <div className="profile-form-actions">
                        <button
                            type="button"
                            className="profile-form-cancel-button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="profile-form-submit-button"
                            disabled={isSubmitting}
                        >
                            <Save size={17} />

                            <span>
                                {isSubmitting
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Creating..."
                                    : isEditMode
                                        ? "Save changes"
                                        : "Create profile"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ProfileForm;
