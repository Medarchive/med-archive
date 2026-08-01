// Per-notification field names beyond `read` (confirmed on the PATCH body)
// aren't detailed in the OpenAPI spec — kept loose and rendered defensively.
export interface NotificationData {
	id: string;
	title?: string;
	message?: string;
	body?: string;
	read?: boolean;
	isRead?: boolean;
	type?: string;
	createdAt?: string;
	[key: string]: unknown;
}

export const isNotificationRead = (notification: NotificationData) =>
	notification.read ?? notification.isRead ?? false;

export const getNotificationText = (notification: NotificationData) =>
	notification.message ?? notification.body ?? notification.title ?? "Notification";
