import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAxiosError } from "axios";
import { ApiErrorResponse } from "../../types/api";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getApiErrorMessage(
	error: unknown,
	fallback = "Something went wrong. Please try again.",
) {
	if (isAxiosError<ApiErrorResponse>(error)) {
		return error.response?.data?.message ?? fallback;
	}

	return fallback;
}
