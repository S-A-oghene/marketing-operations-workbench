export type Unknownable<T> = T | "UNKNOWN" | "NOT_AVAILABLE";
export type DataClass = "PUBLIC" | "LOW_SENSITIVITY" | "CONFIDENTIAL" | "PERSONAL" | "RESTRICTED";
export type ApprovalState = "NOT_REQUIRED" | "PENDING" | "APPROVED" | "REJECTED";
export type ProviderOperationalState = "NOT_CONFIGURED" | "DISCONNECTED" | "CONNECTING" | "CONNECTED" | "READY" | "DEGRADED" | "RATE_LIMITED" | "QUOTA_LIMITED" | "AUTH_REQUIRED" | "APPROVAL_REQUIRED" | "UNAVAILABLE" | "MANUAL_ONLY" | "DISABLED";
export interface ApiError {
    code: string;
    message: string;
    retrySafe: boolean;
    workPreserved: boolean;
    publicationOccurred: boolean | "UNKNOWN";
    nextActions: string[];
}
