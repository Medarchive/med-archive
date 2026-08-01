export interface ApiSuccessResponse<T = unknown> {
	statusCode: number;
	message: string;
	timestamp: string;
	data: T;
}

export interface ApiErrorResponse {
	statusCode: number;
	message: string;
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
