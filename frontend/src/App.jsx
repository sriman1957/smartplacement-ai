import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Mail,
  UserRound,
} from "lucide-react";
import api from "./services/api";
import "./App.css";

const initialRegisterFormData = {
  name: "",
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

  const [loggedInUser, setLoggedInUser] = useState(() => ({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    role: localStorage.getItem("userRole") || "",
  }));

  const [showRegisterPassword, setShowRegisterPassword] =
      useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
      useState(false);

  const [showLoginPassword, setShowLoginPassword] =
      useState(false);

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
  }

  function handleLoginChange(event) {
    const { name, value } = event.target;

    setLoginFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function validateRegisterForm() {
    if (
        !registerFormData.name.trim() ||
        !registerFormData.email.trim() ||
        !registerFormData.password ||
        !registerFormData.confirmPassword
    ) {
      return "All fields are required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(registerFormData.email)) {
      return "Enter a valid email address";
    }

    if (registerFormData.password.length < 6) {
      return "Password must be at least 6 characters long";
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
    if (
        !loginFormData.email.trim() ||
        !loginFormData.password
    ) {
      return "All fields are required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(loginFormData.email)) {
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

    setIsSubmitting(true);

    try {
      await api.post("/auth/register", {
        name: registerFormData.name.trim(),
        email: registerFormData.email.trim(),
        password: registerFormData.password,
      });

      setSuccessMessage(
          "Account created successfully. You may now sign in."
      );

      setRegisterFormData(initialRegisterFormData);

      setTimeout(() => {
        setIsLoginMode(true);
        setSuccessMessage("");
      }, 1200);
    } catch (error) {
      const backendMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";

      setErrorMessage(backendMessage);
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
        email: loginFormData.email.trim(),
        password: loginFormData.password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
          "userName",
          response.data.name || ""
      );

      localStorage.setItem(
          "userEmail",
          response.data.email || ""
      );

      localStorage.setItem(
          "userRole",
          response.data.role || ""
      );

      setLoggedInUser({
        name: response.data.name || "",
        email: response.data.email || "",
        role: response.data.role || "",
      });

      setLoginFormData(initialLoginFormData);
      setSuccessMessage("");

      setIsAuthenticated(true);
    } catch (error) {
      const backendMessage =
          error.response?.data?.message ||
          "Login failed. Please try again.";

      setErrorMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    setLoggedInUser({
      name: "",
      email: "",
      role: "",
    });

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
        <main className="auth-page">
          <section className="auth-shell">
            <aside className="auth-brand-panel">
              <div className="brand-mark">
                <div className="brand-mark-icon">
                  <ArrowRight size={20} strokeWidth={2.5} />
                </div>

                <span>SMARTPLACEMENT AI</span>
              </div>

              <div className="brand-content">
                <p className="brand-label">
                  AUTHENTICATED SESSION
                </p>

                <h2>
                  Welcome back
                  <span> {loggedInUser.name}</span>
                </h2>

                <p className="brand-description">
                  Your SmartPlacement account is authenticated
                  successfully.
                </p>
              </div>

              <div className="brand-footer">
                <div className="status-dot" />

                <span>JWT authentication active</span>
              </div>
            </aside>

            <section className="auth-form-panel">
              <div className="auth-form-container">
                <div className="auth-header">
                  <p className="auth-eyebrow">
                    AUTHENTICATED
                  </p>

                  <h1>You're signed in</h1>

                  <p>
                    Your JWT is stored and ready for protected
                    API requests.
                  </p>
                </div>

                <div className="auth-form">
                  <div className="form-group">
                    <label>Name</label>

                    <div className="input-wrapper">
                      <UserRound
                          className="input-icon"
                          size={19}
                      />

                      <input
                          type="text"
                          value={loggedInUser.name}
                          readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email address</label>

                    <div className="input-wrapper">
                      <Mail
                          className="input-icon"
                          size={19}
                      />

                      <input
                          type="email"
                          value={loggedInUser.email}
                          readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Role</label>

                    <div className="input-wrapper">
                      <UserRound
                          className="input-icon"
                          size={19}
                      />

                      <input
                          type="text"
                          value={loggedInUser.role}
                          readOnly
                      />
                    </div>
                  </div>

                  <button
                      className="primary-button"
                      type="button"
                      onClick={handleLogout}
                  >
                    <span>Logout</span>
                    <LogOut size={19} />
                  </button>
                </div>
              </div>
            </section>
          </section>
        </main>
    );
  }

  return (
      <main className="auth-page">
        <section className="auth-shell">
          <aside className="auth-brand-panel">
            <div className="brand-mark">
              <div className="brand-mark-icon">
                <ArrowRight size={20} strokeWidth={2.5} />
              </div>

              <span>SMARTPLACEMENT AI</span>
            </div>

            <div className="brand-content">
              <p className="brand-label">
                PLACEMENT PLATFORM
              </p>

              <h2>
                Build your career
                <span> with confidence.</span>
              </h2>

              <p className="brand-description">
                Manage your placement journey, strengthen your
                profile, and prepare for better opportunities.
              </p>
            </div>

            <div className="brand-footer">
              <div className="status-dot" />

              <span>Secure student authentication</span>
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

                      <h1>Sign in to your account</h1>

                      <p>
                        Enter your credentials to continue to your
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
                              value={loginFormData.email}
                              onChange={handleLoginChange}
                              placeholder="you@example.com"
                              disabled={isSubmitting}
                              autoComplete="email"
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
                              value={loginFormData.password}
                              onChange={handleLoginChange}
                              placeholder="Enter your password"
                              disabled={isSubmitting}
                              autoComplete="current-password"
                          />

                          <button
                              type="button"
                              className="password-toggle"
                              onClick={() =>
                                  setShowLoginPassword(
                                      (currentValue) => !currentValue
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

                      <h1>Create your account</h1>

                      <p>
                        Create your SmartPlacement account and start
                        building your placement profile.
                      </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleRegisterSubmit}
                        noValidate
                    >
                      <div className="form-group">
                        <label htmlFor="register-name">
                          Full name
                        </label>

                        <div className="input-wrapper">
                          <UserRound
                              className="input-icon"
                              size={19}
                          />

                          <input
                              id="register-name"
                              name="name"
                              type="text"
                              value={registerFormData.name}
                              onChange={handleRegisterChange}
                              placeholder="Enter your full name"
                              disabled={isSubmitting}
                              autoComplete="name"
                          />
                        </div>
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
                              value={registerFormData.email}
                              onChange={handleRegisterChange}
                              placeholder="you@example.com"
                              disabled={isSubmitting}
                              autoComplete="email"
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
                              value={registerFormData.password}
                              onChange={handleRegisterChange}
                              placeholder="Minimum 6 characters"
                              disabled={isSubmitting}
                              autoComplete="new-password"
                          />

                          <button
                              type="button"
                              className="password-toggle"
                              onClick={() =>
                                  setShowRegisterPassword(
                                      (currentValue) => !currentValue
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
                              onChange={handleRegisterChange}
                              placeholder="Re-enter your password"
                              disabled={isSubmitting}
                              autoComplete="new-password"
                          />

                          <button
                              type="button"
                              className="password-toggle"
                              onClick={() =>
                                  setShowConfirmPassword(
                                      (currentValue) => !currentValue
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