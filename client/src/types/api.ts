export interface ApiSuccessResponse<T = unknown> {
	statusCode: number;
	message: string;
	timestamp: string;
	data: T;
}

export interface ApiErrorResponse {
	statusCode: number;
	// NestJS's ValidationPipe returns an array of per-field messages on 400s
	// (e.g. ["firstName must be longer than or equal to 2 characters"]) —
	// every other error path returns a single string.
	message: string | string[];
	timestamp: string;
	error?: string;
}

export interface AuthTokensData {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	walletRequired?: boolean;
}

export type UserRole = "PATIENT" | "PROVIDER" | "ADMIN";

export interface UserProfileData {
	id: string;
	fullName: string;
	email: string;
	phone: string | null;
	role: UserRole;
	walletAddress: string | null;
	emailVerifiedAt: string | null;
	createdAt: string;
	updatedAt: string;
	// GET /users/me and the admin user-detail endpoint both mention this
	// nested patient/provider sub-profile, but its exact fields aren't
	// detailed in the spec — best guess at what a provider's sub-profile
	// carries (verifiedAt drives the admin "verify provider" action).
	profile?: {
		verifiedAt?: string | null;
		specialty?: string | null;
		licenseNumber?: string | null;
	} | null;
}

export interface PaginationMeta {
	totalCount: number;
	currentCount: number;
	page: number;
	totalPages: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

export interface PaginatedData<T> {
	data: T[];
	meta: PaginationMeta;
}

export interface PaginationParams {
	page?: number;
	take?: number;
	sortOrder?: "asc" | "desc";
	sortBy?: string;
	search?: string;
}
