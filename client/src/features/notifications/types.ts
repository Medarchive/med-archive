// Confirmed against a real GET /api/v1/notifications response — the
// OpenAPI spec doesn't define this endpoint's data shape at all. Unread is
// derived from `readAt` being null, not a separate `read`/`isRead` boolean
// (that boolean only exists on the PATCH request body, confirmed as
// `UpdateNotificationDto.read` in the spec).
export interface NotificationData {
	id: string;
	userId: string;
	// No enum for this is documented anywhere in the spec — only
	// "ZK_PROOF_FAILED" has actually been observed. Kept as a loose string
	// and rendered defensively rather than assuming an exhaustive list.
	type: string;
	title: string;
	body: string;
	// Per-type payload, e.g. { recordId: string } for ZK_PROOF_FAILED.
	data?: Record<string, unknown> | null;
	readAt?: string | null;
	createdAt: string;
}

export const isNotificationRead = (notification: NotificationData) =>
	Boolean(notification.readAt);

export const getNotificationText = (notification: NotificationData) =>
	notification.body || notification.title;
