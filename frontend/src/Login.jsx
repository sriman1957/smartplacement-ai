import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";

function Login({
                   formData,
                   errorMessage,
                   successMessage,
                   isSubmitting,
                   showPassword,
                   onChange,
                   onSubmit,
                   onTogglePassword,
                   onShowRegister,
               }) {
    return (
        <div className="auth-form-container auth-screen">
            <div className="auth-header">
                <p className="auth-eyebrow">WELCOME BACK</p>

                <h1>Sign in to your account</h1>

                <p>
                    Enter your credentials to continue to your
                    SmartPlacement dashboard.
                </p>
            </div>

            <form
                className="auth-form"
                onSubmit={onSubmit}
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
                            value={formData.email}
                            onChange={onChange}
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
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={onChange}
                            placeholder="Enter your password"
                            disabled={isSubmitting}
                            autoComplete="current-password"
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
                <span>Don't have an account?</span>

                <button
                    type="button"
                    onClick={onShowRegister}
                    disabled={isSubmitting}
                >
                    Create account
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

export default Login;
