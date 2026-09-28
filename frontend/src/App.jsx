import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    UserRound,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "./services/api";
import StudentDashboard from "./pages/StudentDashboard";
import "./App.css";

const initialRegisterFormData = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const initialLoginFormData = {
    email: "",
    password: "",
};

function App() {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(
        () => Boolean(localStorage.getItem("token"))
    );

    const [registerFormData, setRegisterFormData] = useState(
        initialRegisterFormData
    );

    const [loginFormData, setLoginFormData] = useState(
        initialLoginFormData
    );

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [usernameAvailability, setUsernameAvailability] =
        useState("idle");

    const [showRegisterPassword, setShowRegisterPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [showLoginPassword, setShowLoginPassword] =
        useState(false);

    useEffect(() => {
        const username = registerFormData.username.trim();

        setUsernameAvailability("idle");

        if (!username) {
            return;
        }

        if (
            username.length < 3 ||
            username.length > 30 ||
            !/^[a-zA-Z0-9_]+$/.test(username)
        ) {
            return;
        }

        setUsernameAvailability("checking");

        let isCurrentRequest = true;

        const timeoutId = setTimeout(async () => {
            try {
                const response = await api.get(
                    "/auth/username-availability",
                    {
                        params: {
                            username,
                        },
                    }
                );

                if (!isCurrentRequest) {
                    return;
                }

                setUsernameAvailability(
                    response.data.available
                        ? "available"
                        : "taken"
                );
            } catch {
                if (!isCurrentRequest) {
                    return;
                }

                setUsernameAvailability("error");
            }
        }, 400);

        return () => {
            isCurrentRequest = false;
            clearTimeout(timeoutId);
        };
    }, [registerFormData.username]);

    function clearMessages() {
        setErrorMessage("");
        setSuccessMessage("");
    }

    function handleRegisterChange(event) {
        const { name, value } = event.target;

        setRegisterFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));

        clearMessages();
    }

    function handleLoginChange(event) {
        const { name, value } = event.target;

        setLoginFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));

        clearMessages();
    }

    function validateRegisterForm() {
        const firstName = registerFormData.firstName.trim();
        const lastName = registerFormData.lastName.trim();
        const username = registerFormData.username.trim();
        const email = registerFormData.email.trim();

        if (
            !firstName ||
            !lastName ||
            !username ||
            !email ||
            !registerFormData.password ||
            !registerFormData.confirmPassword
        ) {
            return "All fields are required";
        }

        if (firstName.length > 50) {
            return "First name must not exceed 50 characters";
        }

        if (lastName.length > 50) {
            return "Last name must not exceed 50 characters";
        }

        if (username.length < 3 || username.length > 30) {
            return "Username must be between 3 and 30 characters";
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return "Username may contain only letters, numbers, and underscores";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return "Enter a valid email address";
        }

        if (email.length > 100) {
            return "Email must not exceed 100 characters";
        }

        if (registerFormData.password.length < 6) {
            return "Password must be at least 6 characters long";
        }

        if (registerFormData.password.length > 100) {
            return "Password must not exceed 100 characters";
        }

        if (
            registerFormData.password !==
            registerFormData.confirmPassword
        ) {
            return "Password and Confirm Password must match";
        }

        return "";
    }

    function validateLoginForm() {
        const email = loginFormData.email.trim();

        if (!email || !loginFormData.password) {
            return "All fields are required";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return "Enter a valid email address";
        }

        return "";
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();

        clearMessages();

        const validationError = validateRegisterForm();

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        if (usernameAvailability === "checking") {
            setErrorMessage(
                "Please wait while we check username availability"
            );
            return;
        }

        if (usernameAvailability === "taken") {
            setErrorMessage("Username is already taken");
            return;
        }

        if (usernameAvailability === "error") {
            setErrorMessage(
                "Unable to verify username availability. Please try again."
            );
            return;
        }

        if (usernameAvailability !== "available") {
            setErrorMessage(
                "Please enter a valid username and wait for availability to be checked"
            );
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post("/auth/register", {
                firstName: registerFormData.firstName.trim(),
                lastName: registerFormData.lastName.trim(),
                username: registerFormData.username.trim(),
                email: registerFormData.email.trim().toLowerCase(),
                password: registerFormData.password,
            });

            setSuccessMessage(
                "Account created successfully. You may now sign in."
            );

            setRegisterFormData(initialRegisterFormData);
            setUsernameAvailability("idle");

            setTimeout(() => {
                setIsLoginMode(true);
                setSuccessMessage("");
            }, 1200);
        } catch (error) {
            const status = error.response?.status;

            if (status === 409) {
                const backendMessage =
                    error.response?.data?.message ||
                    "Email or username is already registered.";

                setErrorMessage(backendMessage);

                if (
                    backendMessage
                        .toLowerCase()
                        .includes("username")
                ) {
                    setUsernameAvailability("taken");
                }

                return;
            }

            if (status === 400) {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Please check your registration details."
                );
                return;
            }

            if (status >= 500) {
                setErrorMessage(
                    "The server could not create your account. Please try again."
                );
                return;
            }

            setErrorMessage(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();

        clearMessages();

        const validationError = validateLoginForm();

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.post("/auth/login", {
                email: loginFormData.email.trim().toLowerCase(),
                password: loginFormData.password,
            });

            localStorage.setItem(
                "token",
                response.data.token
            );

            const fullName = [
                response.data.firstName,
                response.data.lastName,
            ]
                .filter(Boolean)
                .join(" ");

            localStorage.setItem(
                "userName",
                fullName
            );

            localStorage.setItem(
                "firstName",
                response.data.firstName || ""
            );

            localStorage.setItem(
                "lastName",
                response.data.lastName || ""
            );

            localStorage.setItem(
                "username",
                response.data.username || ""
            );

            localStorage.setItem(
                "userEmail",
                response.data.email || ""
            );

            localStorage.setItem(
                "userRole",
                response.data.role || ""
            );

            setLoginFormData(initialLoginFormData);
            setSuccessMessage("");
            setErrorMessage("");

            setIsAuthenticated(true);
        } catch (error) {
            const status = error.response?.status;

            if (status === 401) {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Invalid email or password"
                );
                return;
            }

            if (status >= 500) {
                setErrorMessage(
                    "The server could not process your login. Please try again."
                );
                return;
            }

            setErrorMessage(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        setIsAuthenticated(false);
        setIsLoginMode(true);
        setLoginFormData(initialLoginFormData);

        clearMessages();
    }

    function showLoginPage() {
        clearMessages();
        setIsLoginMode(true);
    }

    function showRegisterPage() {
        clearMessages();
        setIsLoginMode(false);
    }

    if (isAuthenticated) {
        return (
            <StudentDashboard
                onLogout={handleLogout}
            />
        );
    }

    return (
        <main className="auth-page">
            <section className="auth-shell">
                <aside className="auth-brand-panel">
                    <div className="brand-mark">
                        <div className="brand-mark-icon">
                            <ArrowRight
                                size={20}
                                strokeWidth={2.5}
                            />
                        </div>

                        <span>
                            SMARTPLACEMENT AI
                        </span>
                    </div>

                    <div className="brand-content">
                        <p className="brand-label">
                            PLACEMENT PLATFORM
                        </p>

                        <h2>
                            Build your career
                            <span>
                                {" "}
                                with confidence.
                            </span>
                        </h2>

                        <p className="brand-description">
                            Manage your placement journey,
                            strengthen your profile, and prepare
                            for better opportunities.
                        </p>
                    </div>

                    <div className="brand-footer">
                        <div className="status-dot" />

                        <span>
                            Secure student authentication
                        </span>
                    </div>
                </aside>

                <section className="auth-form-panel">
                    <div className="auth-form-container">
                        {isLoginMode ? (
                            <>
                                <div className="auth-header">
                                    <p className="auth-eyebrow">
                                        WELCOME BACK
                                    </p>

                                    <h1>
                                        Sign in to your account
                                    </h1>

                                    <p>
                                        Enter your credentials to
                                        continue to your
                                        SmartPlacement dashboard.
                                    </p>
                                </div>

                                <form
                                    className="auth-form"
                                    onSubmit={handleLoginSubmit}
                                    noValidate
                                >
                                    <div className="form-group">
                                        <label htmlFor="login-email">
                                            Email address
                                        </label>

                                        <div className="input-wrapper">
                                            <Mail
                                                className="input-icon"
                                                size={19}
                                            />

                                            <input
                                                id="login-email"
                                                name="email"
                                                type="email"
                                                value={
                                                    loginFormData.email
                                                }
                                                onChange={
                                                    handleLoginChange
                                                }
                                                placeholder="you@example.com"
                                                disabled={isSubmitting}
                                                autoComplete="off"
                                                spellCheck={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="login-password">
                                            Password
                                        </label>

                                        <div className="input-wrapper">
                                            <LockKeyhole
                                                className="input-icon"
                                                size={19}
                                            />

                                            <input
                                                id="login-password"
                                                name="password"
                                                type={
                                                    showLoginPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    loginFormData.password
                                                }
                                                onChange={
                                                    handleLoginChange
                                                }
                                                placeholder="Enter your password"
                                                disabled={isSubmitting}
                                                autoComplete="current-password"
                                            />

                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowLoginPassword(
                                                        (currentValue) =>
                                                            !currentValue
                                                    )
                                                }
                                                disabled={isSubmitting}
                                                aria-label={
                                                    showLoginPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showLoginPassword ? (
                                                    <EyeOff size={19} />
                                                ) : (
                                                    <Eye size={19} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {errorMessage && (
                                        <div
                                            className="message error-message"
                                            role="alert"
                                        >
                                            {errorMessage}
                                        </div>
                                    )}

                                    {successMessage && (
                                        <div
                                            className="message success-message"
                                            role="status"
                                        >
                                            {successMessage}
                                        </div>
                                    )}

                                    <button
                                        className="primary-button"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <span>
                                            {isSubmitting
                                                ? "Signing in..."
                                                : "Sign in"}
                                        </span>

                                        {!isSubmitting && (
                                            <ArrowRight size={19} />
                                        )}
                                    </button>
                                </form>

                                <div className="auth-switch">
                                    <span>
                                        Don't have an account?
                                    </span>

                                    <button
                                        type="button"
                                        onClick={showRegisterPage}
                                        disabled={isSubmitting}
                                    >
                                        Create account
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="auth-header">
                                    <p className="auth-eyebrow">
                                        GET STARTED
                                    </p>

                                    <h1>
                                        Create your account
                                    </h1>

                                    <p>
                                        Create your SmartPlacement
                                        account and start building
                                        your placement profile.
                                    </p>
                                </div>

                                <form
                                    className="auth-form"
                                    onSubmit={handleRegisterSubmit}
                                    noValidate
                                >
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="register-first-name">
                                                First name
                                            </label>

                                            <div className="input-wrapper">
                                                <UserRound
                                                    className="input-icon"
                                                    size={19}
                                                />

                                                <input
                                                    id="register-first-name"
                                                    name="firstName"
                                                    type="text"
                                                    value={
                                                        registerFormData.firstName
                                                    }
                                                    onChange={
                                                        handleRegisterChange
                                                    }
                                                    placeholder="Srii"
                                                    disabled={isSubmitting}
                                                    autoComplete="off"
                                                    maxLength={50}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="register-last-name">
                                                Last name
                                            </label>

                                            <div className="input-wrapper">
                                                <UserRound
                                                    className="input-icon"
                                                    size={19}
                                                />

                                                <input
                                                    id="register-last-name"
                                                    name="lastName"
                                                    type="text"
                                                    value={
                                                        registerFormData.lastName
                                                    }
                                                    onChange={
                                                        handleRegisterChange
                                                    }
                                                    placeholder="Test"
                                                    disabled={isSubmitting}
                                                    autoComplete="off"
                                                    maxLength={50}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="register-username">
                                            Username
                                        </label>

                                        <div
                                            className={`input-wrapper username-input-wrapper ${
                                                usernameAvailability ===
                                                "available"
                                                    ? "username-available"
                                                    : ""
                                            } ${
                                                usernameAvailability ===
                                                "taken"
                                                    ? "username-taken"
                                                    : ""
                                            }`}
                                        >
                                            <UserRound
                                                className="input-icon"
                                                size={19}
                                            />

                                            <input
                                                id="register-username"
                                                name="username"
                                                type="text"
                                                value={
                                                    registerFormData.username
                                                }
                                                onChange={
                                                    handleRegisterChange
                                                }
                                                placeholder="srii_test"
                                                disabled={isSubmitting}
                                                autoComplete="off"
                                                maxLength={30}
                                                spellCheck={false}
                                            />

                                            <div className="username-status">
                                                {usernameAvailability ===
                                                    "checking" && (
                                                        <span
                                                            className="username-checking"
                                                            aria-label="Checking username availability"
                                                        >
                                                            <span className="username-spinner" />
                                                        </span>
                                                    )}

                                                {usernameAvailability ===
                                                    "available" && (
                                                        <CheckCircle2
                                                            size={20}
                                                            aria-label="Username available"
                                                        />
                                                    )}

                                                {usernameAvailability ===
                                                    "taken" && (
                                                        <XCircle
                                                            size={20}
                                                            aria-label="Username already taken"
                                                        />
                                                    )}
                                            </div>
                                        </div>

                                        {usernameAvailability ===
                                        "available" ? (
                                            <span className="field-help username-success">
                                                Username is available
                                            </span>
                                        ) : usernameAvailability ===
                                        "taken" ? (
                                            <span className="field-help username-error">
                                                Username is already taken
                                            </span>
                                        ) : usernameAvailability ===
                                        "error" ? (
                                            <span className="field-help username-error">
                                                Unable to check username
                                                availability
                                            </span>
                                        ) : (
                                            <span className="field-help">
                                                3 to 30 characters. Use
                                                letters, numbers, and
                                                underscores.
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="register-email">
                                            Email address
                                        </label>

                                        <div className="input-wrapper">
                                            <Mail
                                                className="input-icon"
                                                size={19}
                                            />

                                            <input
                                                id="register-email"
                                                name="email"
                                                type="email"
                                                value={
                                                    registerFormData.email
                                                }
                                                onChange={
                                                    handleRegisterChange
                                                }
                                                placeholder="you@example.com"
                                                disabled={isSubmitting}
                                                autoComplete="off"
                                                spellCheck={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="register-password">
                                            Password
                                        </label>

                                        <div className="input-wrapper">
                                            <LockKeyhole
                                                className="input-icon"
                                                size={19}
                                            />

                                            <input
                                                id="register-password"
                                                name="password"
                                                type={
                                                    showRegisterPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    registerFormData.password
                                                }
                                                onChange={
                                                    handleRegisterChange
                                                }
                                                placeholder="Minimum 6 characters"
                                                disabled={isSubmitting}
                                                autoComplete="new-password"
                                            />

                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowRegisterPassword(
                                                        (currentValue) =>
                                                            !currentValue
                                                    )
                                                }
                                                disabled={isSubmitting}
                                                aria-label={
                                                    showRegisterPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showRegisterPassword ? (
                                                    <EyeOff size={19} />
                                                ) : (
                                                    <Eye size={19} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">
                                            Confirm password
                                        </label>

                                        <div className="input-wrapper">
                                            <LockKeyhole
                                                className="input-icon"
                                                size={19}
                                            />

                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    registerFormData.confirmPassword
                                                }
                                                onChange={
                                                    handleRegisterChange
                                                }
                                                placeholder="Re-enter your password"
                                                disabled={isSubmitting}
                                                autoComplete="new-password"
                                            />

                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (currentValue) =>
                                                            !currentValue
                                                    )
                                                }
                                                disabled={isSubmitting}
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={19} />
                                                ) : (
                                                    <Eye size={19} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {errorMessage && (
                                        <div
                                            className="message error-message"
                                            role="alert"
                                        >
                                            {errorMessage}
                                        </div>
                                    )}

                                    {successMessage && (
                                        <div
                                            className="message success-message"
                                            role="status"
                                        >
                                            {successMessage}
                                        </div>
                                    )}

                                    <button
                                        className="primary-button"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <span>
                                            {isSubmitting
                                                ? "Creating account..."
                                                : "Create account"}
                                        </span>

                                        {!isSubmitting && (
                                            <ArrowRight size={19} />
                                        )}
                                    </button>
                                </form>

                                <div className="auth-switch">
                                    <span>
                                        Already have an account?
                                    </span>

                                    <button
                                        type="button"
                                        onClick={showLoginPage}
                                        disabled={isSubmitting}
                                    >
                                        Sign in
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </section>
        </main>
    );
}

export default App;
