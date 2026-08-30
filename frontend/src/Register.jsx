import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    UserRound,
} from "lucide-react";

function Register({
                      formData,
                      errorMessage,
                      successMessage,
                      isSubmitting,
                      showPassword,
                      showConfirmPassword,
                      onChange,
                      onSubmit,
                      onTogglePassword,
                      onToggleConfirmPassword,
                      onShowLogin,
                  }) {
    return (
        <div className="auth-form-container auth-screen">
            <div className="auth-header">
                <p className="auth-eyebrow">GET STARTED</p>

                <h1>Create your account</h1>

                <p>
                    Create your SmartPlacement account and start
                    building your placement profile.
                </p>
            </div>

            <form
                className="auth-form"
                onSubmit={onSubmit}
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
                            value={formData.name}
                            onChange={onChange}
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
                            value={formData.email}
                            onChange={onChange}
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
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={formData.password}
                            onChange={onChange}
                            placeholder="Minimum 6 characters"
                            disabled={isSubmitting}
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={onTogglePassword}
                            disabled={isSubmitting}
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
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
                            value={formData.confirmPassword}
                            onChange={onChange}
                            placeholder="Re-enter your password"
                            disabled={isSubmitting}
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={onToggleConfirmPassword}
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
                <span>Already have an account?</span>

                <button
                    type="button"
                    onClick={onShowLogin}
                    disabled={isSubmitting}
                >
                    Sign in
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

export default Register;