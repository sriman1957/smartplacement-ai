import {
    AlertCircle,
    CheckCircle2,
    Code2,
    FileText,
    Lightbulb,
    LoaderCircle,
    Sparkles,
    Target,
    TrendingUp,
    X,
} from "lucide-react";

import {
    SiDjango,
    SiFastapi,
    SiGit,
    SiHtml5,
    SiJavascript,
    SiMysql,
    SiPostgresql,
    SiPython,
    SiReact,
    SiSpring,
    SiTypescript,
} from "react-icons/si";

import { DiJava } from "react-icons/di";

import { useEffect, useState } from "react";
import { analyzeResume } from "../services/resumeService";
import "./ResumeAnalysis.css";

const JOB_ROLES = [
    "",
    "Java Full Stack Developer",
    "Python Backend Developer",
    "Golang Developer",
    "Rust Developer",
    "iOS Developer",
    "Android Developer",
    "React Developer",
    "Frontend Developer",
    "Backend Developer",
    "Software Developer",
];

const NAV_ITEMS = [
    {
        id: "overview",
        label: "Overview",
        icon: Target,
    },
    {
        id: "skills",
        label: "Skills",
        icon: Code2,
    },
    {
        id: "strengths",
        label: "Strengths",
        icon: TrendingUp,
    },
    {
        id: "gaps",
        label: "Gaps",
        icon: AlertCircle,
    },
    {
        id: "recommendations",
        label: "Recommendations",
        icon: Lightbulb,
    },
];

const SKILL_ICONS = {
    java: DiJava,
    "spring boot": SiSpring,
    mysql: SiMysql,
    react: SiReact,
    javascript: SiJavascript,
    typescript: SiTypescript,
    git: SiGit,
    python: SiPython,
    django: SiDjango,
    fastapi: SiFastapi,
    postgresql: SiPostgresql,
    html: SiHtml5,
};

function getSkillIcon(skill) {
    const normalizedSkill = String(skill)
        .trim()
        .toLowerCase();

    return SKILL_ICONS[normalizedSkill] || Code2;
}

function ResumeAnalysis({ resume = null }) {
    const [jobTitle, setJobTitle] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] =
        useState("overview");

    async function handleAnalyze() {
        if (!resume?.id) {
            return;
        }

        if (!jobTitle.trim()) {
            setError("Please select a job title.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await analyzeResume(
                resume.id,
                jobTitle.trim(),
            );

            setAnalysis(result);
            setActiveSection("overview");
            setIsOpen(true);
        } catch (requestError) {
            const status = requestError.response?.status;

            if (status === 400) {
                setError(
                    requestError.response?.data?.message ||
                    "Please provide a valid job title.",
                );
            } else if (status === 401) {
                setError(
                    "Your session has expired. Please sign in again.",
                );
            } else if (status === 404) {
                setError(
                    "Resume not found. Please refresh and try again.",
                );
            } else if (status === 503) {
                setError(
                    requestError.response?.data?.message ||
                    "AI analysis is temporarily unavailable. Please try again later.",
                );
            } else if (status >= 500) {
                setError(
                    "The server is unavailable. Please try again.",
                );
            } else {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to analyze your resume. Please try again.",
                );
            }
        } finally {
            setLoading(false);
        }
    }

    function parseSkills(value) {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value
                .map((item) => String(item).trim())
                .filter(Boolean);
        }

        return String(value)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    function parseStatements(value) {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value
                .map((item) => String(item).trim())
                .filter(Boolean);
        }

        return String(value)
            .split(/\.\s+/)
            .map((item) => item.trim())
            .map((item) => item.replace(/\.$/, ""))
            .filter(Boolean);
    }

    function getScoreLabel(score) {
        if (score >= 80) {
            return "Strong alignment";
        }

        if (score >= 60) {
            return "Moderate alignment";
        }

        return "Needs improvement";
    }

    function formatDate(value) {
        if (!value) {
            return "";
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(value));
    }

    function closeAnalysis() {
        setIsOpen(false);
    }

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                closeAnalysis();
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape,
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape,
            );
        };
    }, [isOpen]);

    function renderEmpty(message) {
        return (
            <div className="resume-analysis-empty">
                <span>{message}</span>
            </div>
        );
    }

    function renderSkillTags(skills) {
        if (skills.length === 0) {
            return renderEmpty(
                "No technical skills were identified.",
            );
        }

        return (
            <div className="resume-analysis-skill-list">
                {skills.map((skill, index) => {
                    const SkillIcon = getSkillIcon(skill);

                    return (
                        <span
                            className="resume-analysis-skill"
                            key={`${skill}-${index}`}
                        >
                            <SkillIcon size={13} />
                            <span>{skill}</span>
                        </span>
                    );
                })}
            </div>
        );
    }

    function renderScore() {
        if (!analysis) {
            return null;
        }

        return (
            <div className="resume-analysis-score-panel">
                <div className="resume-analysis-score-left">
                    <span className="resume-analysis-small-label">
                        RESUME ALIGNMENT
                    </span>

                    <div className="resume-analysis-score-value">
                        <strong>{analysis.score}</strong>
                        <span>/100</span>
                    </div>

                    <span className="resume-analysis-score-label">
                        {getScoreLabel(analysis.score)}
                    </span>
                </div>

                <div className="resume-analysis-score-right">
                    <div className="resume-analysis-progress">
                        <span
                            style={{
                                width: `${Math.min(
                                    Math.max(
                                        analysis.score,
                                        0,
                                    ),
                                    100,
                                )}%`,
                            }}
                        />
                    </div>

                    <div className="resume-analysis-score-meta">
                        <span>Role match</span>
                        <strong>
                            {analysis.score}%
                        </strong>
                    </div>
                </div>
            </div>
        );
    }

    function renderOverview() {
        const skills = parseSkills(
            analysis?.technicalSkills,
        );

        const strengths = parseStatements(
            analysis?.strengths,
        );

        const weaknesses = parseStatements(
            analysis?.weaknesses,
        );

        const missingSkills = parseSkills(
            analysis?.missingSkills,
        );

        const recommendations = parseStatements(
            analysis?.recommendations,
        );

        return (
            <div className="resume-analysis-overview">
                {renderScore()}

                <div className="resume-analysis-overview-grid">
                    <section className="resume-analysis-content-section resume-analysis-summary-section">
                        <div className="resume-analysis-section-heading">
                            <CheckCircle2 size={17} />

                            <div>
                                <h3>Analysis summary</h3>

                                <p>
                                    Overall assessment of your resume.
                                </p>
                            </div>
                        </div>

                        <p className="resume-analysis-summary">
                            {analysis.summary}
                        </p>
                    </section>

                    <section className="resume-analysis-content-section">
                        <div className="resume-analysis-section-heading">
                            <Code2 size={17} />

                            <div>
                                <h3>Technical skills</h3>

                                <p>
                                    Skills identified for this role.
                                </p>
                            </div>
                        </div>

                        {renderSkillTags(skills)}
                    </section>

                    <section className="resume-analysis-content-section">
                        <div className="resume-analysis-section-heading">
                            <TrendingUp size={17} />

                            <div>
                                <h3>Strengths</h3>

                                <p>
                                    What your resume does well.
                                </p>
                            </div>
                        </div>

                        {strengths.length > 0 ? (
                            <div className="resume-analysis-mini-list">
                                {strengths.map(
                                    (item, index) => (
                                        <div
                                            key={`${item}-${index}`}
                                            className="resume-analysis-mini-item"
                                        >
                                            <CheckCircle2
                                                size={14}
                                            />

                                            <span>{item}</span>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            renderEmpty(
                                "No strengths identified.",
                            )
                        )}
                    </section>

                    <section className="resume-analysis-content-section">
                        <div className="resume-analysis-section-heading">
                            <AlertCircle size={17} />

                            <div>
                                <h3>Gaps</h3>

                                <p>
                                    Areas that need attention.
                                </p>
                            </div>
                        </div>

                        {weaknesses.length > 0 && (
                            <div className="resume-analysis-mini-list">
                                {weaknesses.map(
                                    (item, index) => (
                                        <div
                                            key={`${item}-${index}`}
                                            className="resume-analysis-mini-item"
                                        >
                                            <AlertCircle
                                                size={14}
                                            />

                                            <span>{item}</span>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}

                        {missingSkills.length > 0 && (
                            <div className="resume-analysis-missing-inline">
                                {missingSkills.map(
                                    (skill, index) => {
                                        const SkillIcon =
                                            getSkillIcon(
                                                skill,
                                            );

                                        return (
                                            <span
                                                key={`${skill}-${index}`}
                                                className="resume-analysis-missing-tag"
                                            >
                                                <SkillIcon
                                                    size={12}
                                                />

                                                {skill}
                                            </span>
                                        );
                                    },
                                )}
                            </div>
                        )}

                        {weaknesses.length === 0 &&
                            missingSkills.length === 0 &&
                            renderEmpty(
                                "No major gaps identified.",
                            )}
                    </section>

                    <section className="resume-analysis-content-section resume-analysis-recommendation-section">
                        <div className="resume-analysis-section-heading">
                            <Lightbulb size={17} />

                            <div>
                                <h3>Recommendations</h3>

                                <p>
                                    Suggested improvements for your resume.
                                </p>
                            </div>
                        </div>

                        {recommendations.length > 0 ? (
                            <div className="resume-analysis-mini-list">
                                {recommendations.map(
                                    (item, index) => (
                                        <div
                                            key={`${item}-${index}`}
                                            className="resume-analysis-mini-item"
                                        >
                                            <span className="resume-analysis-number">
                                                {String(
                                                    index + 1,
                                                ).padStart(
                                                    2,
                                                    "0",
                                                )}
                                            </span>

                                            <span>{item}</span>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            renderEmpty(
                                "No recommendations generated.",
                            )
                        )}
                    </section>
                </div>
            </div>
        );
    }

    function renderSkills() {
        const skills = parseSkills(
            analysis?.technicalSkills,
        );

        return (
            <div className="resume-analysis-single-section">
                <div className="resume-analysis-page-heading">
                    <Code2 size={20} />

                    <div>
                        <h2>Technical Skills</h2>

                        <p>
                            Technical skills identified for{" "}
                            {analysis.jobTitle}.
                        </p>
                    </div>
                </div>

                {skills.length > 0 ? (
                    <div className="resume-analysis-large-skill-list">
                        {skills.map((skill, index) => {
                            const SkillIcon =
                                getSkillIcon(skill);

                            return (
                                <div
                                    key={`${skill}-${index}`}
                                    className="resume-analysis-large-skill"
                                >
                                    <div className="resume-analysis-large-skill-icon">
                                        <SkillIcon size={19} />
                                    </div>

                                    <span>{skill}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    renderEmpty(
                        "No technical skills were identified.",
                    )
                )}
            </div>
        );
    }

    function renderStrengths() {
        const strengths = parseStatements(
            analysis?.strengths,
        );

        return (
            <div className="resume-analysis-single-section">
                <div className="resume-analysis-page-heading">
                    <TrendingUp size={20} />

                    <div>
                        <h2>Strengths</h2>

                        <p>
                            Areas where your resume aligns well with{" "}
                            {analysis.jobTitle}.
                        </p>
                    </div>
                </div>

                {strengths.length > 0 ? (
                    <div className="resume-analysis-detail-list">
                        {strengths.map((item, index) => (
                            <div
                                key={`${item}-${index}`}
                                className="resume-analysis-detail-item"
                            >
                                <div className="resume-analysis-detail-icon">
                                    <CheckCircle2 size={17} />
                                </div>

                                <div>
                                    <span className="resume-analysis-detail-number">
                                        {String(
                                            index + 1,
                                        ).padStart(2, "0")}
                                    </span>

                                    <p>{item}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    renderEmpty(
                        "No strengths were identified.",
                    )
                )}
            </div>
        );
    }

    function renderGaps() {
        const weaknesses = parseStatements(
            analysis?.weaknesses,
        );

        const missingSkills = parseSkills(
            analysis?.missingSkills,
        );

        return (
            <div className="resume-analysis-single-section">
                <div className="resume-analysis-page-heading">
                    <AlertCircle size={20} />

                    <div>
                        <h2>Resume Gaps</h2>

                        <p>
                            Areas that may need improvement for{" "}
                            {analysis.jobTitle}.
                        </p>
                    </div>
                </div>

                <div className="resume-analysis-gap-block">
                    <h3>Weaknesses</h3>

                    {weaknesses.length > 0 ? (
                        <div className="resume-analysis-detail-list">
                            {weaknesses.map((item, index) => (
                                <div
                                    key={`${item}-${index}`}
                                    className="resume-analysis-detail-item"
                                >
                                    <div className="resume-analysis-detail-icon">
                                        <AlertCircle size={17} />
                                    </div>

                                    <div>
                                        <span className="resume-analysis-detail-number">
                                            {String(
                                                index + 1,
                                            ).padStart(
                                                2,
                                                "0",
                                            )}
                                        </span>

                                        <p>{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        renderEmpty(
                            "No weaknesses were identified.",
                        )
                    )}
                </div>

                <div className="resume-analysis-gap-block">
                    <h3>Missing skills</h3>

                    {missingSkills.length > 0 ? (
                        <div className="resume-analysis-large-skill-list">
                            {missingSkills.map(
                                (skill, index) => {
                                    const SkillIcon =
                                        getSkillIcon(
                                            skill,
                                        );

                                    return (
                                        <div
                                            key={`${skill}-${index}`}
                                            className="resume-analysis-large-skill"
                                        >
                                            <div className="resume-analysis-large-skill-icon">
                                                <SkillIcon
                                                    size={17}
                                                />
                                            </div>

                                            <span>
                                                {skill}
                                            </span>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        renderEmpty(
                            "No major role-specific skills were identified as missing.",
                        )
                    )}
                </div>
            </div>
        );
    }

    function renderRecommendations() {
        const recommendations = parseStatements(
            analysis?.recommendations,
        );

        return (
            <div className="resume-analysis-single-section">
                <div className="resume-analysis-page-heading">
                    <Lightbulb size={20} />

                    <div>
                        <h2>Recommendations</h2>

                        <p>
                            Suggested improvements based on the AI
                            analysis.
                        </p>
                    </div>
                </div>

                {recommendations.length > 0 ? (
                    <div className="resume-analysis-recommendation-list">
                        {recommendations.map(
                            (item, index) => (
                                <div
                                    key={`${item}-${index}`}
                                    className="resume-analysis-recommendation"
                                >
                                    <span className="resume-analysis-recommendation-number">
                                        {String(
                                            index + 1,
                                        ).padStart(
                                            2,
                                            "0",
                                        )}
                                    </span>

                                    <div>
                                        <h3>
                                            Recommendation{" "}
                                            {index + 1}
                                        </h3>

                                        <p>{item}</p>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                ) : (
                    renderEmpty(
                        "No recommendations were generated.",
                    )
                )}
            </div>
        );
    }

    function renderActiveContent() {
        switch (activeSection) {
            case "skills":
                return renderSkills();

            case "strengths":
                return renderStrengths();

            case "gaps":
                return renderGaps();

            case "recommendations":
                return renderRecommendations();

            case "overview":
            default:
                return renderOverview();
        }
    }

    return (
        <>
            <section className="resume-analysis">
                <div className="resume-analysis-trigger">
                    <div className="resume-analysis-trigger-info">
                        <div className="resume-analysis-trigger-icon">
                            <Sparkles size={17} />
                        </div>

                        <div>
                            <strong>
                                AI Resume Analysis
                            </strong>

                            <p>
                                Evaluate your resume against a
                                target job role.
                            </p>
                        </div>
                    </div>

                    <div className="resume-analysis-trigger-action">
                        <select
                            value={jobTitle}
                            onChange={(event) => {
                                setJobTitle(event.target.value);
                                setError("");
                            }}
                            disabled={loading}
                            aria-label="Target job role"
                        >
                            <option value="">Select a job title</option>

                            {JOB_ROLES.filter(Boolean).map((role) => (
                                <option
                                    key={role}
                                    value={role}
                                >
                                    {role}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={handleAnalyze}
                            disabled={
                                loading ||
                                !resume?.id
                            }
                            className="resume-analysis-open-button"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={15}
                                        className="resume-analysis-spinner"
                                    />
                                    <span>
                                        Analyzing...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={15} />
                                    <span>
                                        Analyze with AI
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {!resume && (
                    <div
                        className="resume-analysis-message"
                        role="status"
                    >
                        <FileText size={17} />

                        <div>
                            <strong>
                                Upload a resume to start
                                analysis
                            </strong>

                            <p>
                                Your resume is required before
                                AI analysis can be performed.
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div
                        className="resume-analysis-error"
                        role="alert"
                    >
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}
            </section>

            {isOpen && analysis && (
                <div className="resume-analysis-overlay">
                    <div
                        className="resume-analysis-window"
                        role="dialog"
                        aria-modal="true"
                        aria-label="AI Resume Analysis"
                    >
                        <header className="resume-analysis-window-header">
                            <div className="resume-analysis-window-brand">
                                <div className="resume-analysis-window-logo">
                                    <Sparkles size={17} />
                                </div>

                                <div>
                                    <strong>
                                        SmartPlacement AI
                                    </strong>

                                    <span>
                                        Resume Analysis
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="resume-analysis-close"
                                onClick={closeAnalysis}
                                aria-label="Close analysis"
                                title="Close"
                            >
                                <X size={19} />
                            </button>
                        </header>

                        <div className="resume-analysis-window-body">
                            <aside className="resume-analysis-sidebar">
                                <div className="resume-analysis-sidebar-heading">
                                    <span>
                                        ANALYSIS
                                    </span>
                                </div>

                                <nav>
                                    {NAV_ITEMS.map(
                                        (item) => {
                                            const Icon =
                                                item.icon;

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        item.id
                                                    }
                                                    className={
                                                        activeSection ===
                                                        item.id
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setActiveSection(
                                                            item.id,
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        size={
                                                            16
                                                        }
                                                    />

                                                    <span>
                                                        {
                                                            item.label
                                                        }
                                                    </span>
                                                </button>
                                            );
                                        },
                                    )}
                                </nav>

                                <div className="resume-analysis-sidebar-divider" />

                                <div className="resume-analysis-sidebar-info">
                                    <span>
                                        RESUME
                                    </span>

                                    <strong
                                        title={
                                            resume.fileName ||
                                            resume.originalFileName ||
                                            "Selected resume"
                                        }
                                    >
                                        {resume.fileName ||
                                            resume.originalFileName ||
                                            "Selected resume"}
                                    </strong>
                                </div>
                            </aside>

                            <main className="resume-analysis-main">
                                <div className="resume-analysis-main-header">
                                    <div>
                                        <span>
                                            AI RESUME
                                            ANALYSIS
                                        </span>

                                        <h1>
                                            {analysis.jobTitle ||
                                                jobTitle}
                                        </h1>

                                        <p>
                                            {resume.fileName ||
                                                resume.originalFileName ||
                                                "Selected resume"}
                                        </p>
                                    </div>

                                    <div className="resume-analysis-main-status">
                                        <CheckCircle2 size={15} />
                                        Analysis complete
                                    </div>
                                </div>

                                <div className="resume-analysis-main-content">
                                    {renderActiveContent()}
                                </div>

                                <div className="resume-analysis-footer">
                                    <span>
                                        Analyzed{" "}
                                        {formatDate(
                                            analysis.createdAt,
                                        )}
                                    </span>

                                    <span>
                                        Target role:{" "}
                                        <strong>
                                            {analysis.jobTitle ||
                                                jobTitle}
                                        </strong>
                                    </span>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ResumeAnalysis;
