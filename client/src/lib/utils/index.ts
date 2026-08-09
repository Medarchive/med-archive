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
		const response = error.response?.data;
		const message = response?.message;

		if (Array.isArray(message)) {
			return message.length > 0 ? message.join(" ") : fallback;
		}

		// Upload gateways may return `{ error: { code: "413", message: ... } }`
		// rather than the API's usual Nest response envelope.
		const nestedError = (response as { error?: unknown } | undefined)?.error;
		if (
			typeof nestedError === "object" &&
			nestedError !== null &&
			"message" in nestedError &&
			typeof nestedError.message === "string"
		) {
			const code = "code" in nestedError ? nestedError.code : undefined;
			return code === "413"
				? "One or more files exceed the 20MB upload limit."
				: nestedError.message;
		}

		if (error.response?.status === 413) {
			return "One or more files exceed the 20MB upload limit.";
		}

		return message ?? fallback;
	}

	return fallback;
}
