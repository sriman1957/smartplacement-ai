import api from "./api";

export async function getResumes() {
    const response = await api.get("/resumes");
    return response.data;
}

export async function getResume(resumeId) {
    const response = await api.get(`/resumes/${resumeId}`);
    return response.data;
}

export async function uploadResume(file, onUploadProgress) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
        "/resumes/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        }
    );

    return response.data;
}

export async function deleteResume(resumeId) {
    await api.delete(`/resumes/${resumeId}`);
}

export async function getResumeFile(resumeId) {
    const response = await api.get(
        `/resumes/${resumeId}/file`,
        {
            responseType: "blob",
        }
    );

    return response.data;
}

export async function analyzeResume(resumeId, jobTitle) {
    const response = await api.post(
        `/ai/resume-analyze/${resumeId}`,
        null,
        {
            params: {
                jobTitle,
            },
        }
    );

    return response.data;
}
