"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import {
	useNotifications,
	useMarkNotification,
	useDeleteNotification,
} from "../hooks";
import { getNotificationText, isNotificationRead } from "../types";

const formatDate = (value?: string) => {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleString();
};

export default function NotificationsPanel() {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const { data } = useNotifications({ take: 10 });
	const { mutate: markNotification } = useMarkNotification();
	const { mutate: deleteNotification } = useDeleteNotification();

	const notifications = data?.data ?? [];
	const unreadCount = notifications.filter((n) => !isNotificationRead(n)).length;

	useEffect(() => {
		if (!open) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	return (
		<div className="relative" ref={containerRef}>
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="relative flex size-10 items-center justify-center rounded-full border border-[#F5F5F5] text-gray-600 duration-150 hover:bg-[#FAFAFA]"
			>
				<Bell className="size-4.5" />

				{unreadCount > 0 && (
					<span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-error text-[10px] font-semibold text-white">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{open && (
				<div className="absolute right-0 top-12 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-[12px] border border-[#F5F5F5] bg-white shadow-lg">
					<div className="border-b border-[#F5F5F5] px-4 py-3">
						<p className="font-semibold">Notifications</p>
					</div>

					<div className="max-h-96 divide-y divide-[#F5F5F5] overflow-y-auto">
						{notifications.length === 0 && (
							<p className="px-4 py-6 text-center text-sm text-[#9B9B9B]">
								No notifications yet
							</p>
						)}

						{notifications.map((notification) => {
							const read = isNotificationRead(notification);

							return (
								<div
									key={notification.id}
									onClick={() =>
										!read && markNotification({ id: notification.id, read: true })
									}
									className={`flex items-start justify-between gap-2 px-4 py-3 text-sm duration-150 hover:bg-[#FAFAFA] ${
										read ? "" : "cursor-pointer bg-primary/5"
									}`}
								>
									<div>
										<p className={read ? "text-[#9B9B9B]" : "font-medium"}>
											{getNotificationText(notification)}
										</p>
										<p className="mt-1 text-xs text-[#9B9B9B]">
											{formatDate(notification.createdAt)}
										</p>
									</div>

									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											deleteNotification(notification.id);
										}}
										className="shrink-0 text-[#9B9B9B] hover:text-error"
										aria-label="Delete notification"
									>
										<Trash2 className="size-4" />
									</button>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
