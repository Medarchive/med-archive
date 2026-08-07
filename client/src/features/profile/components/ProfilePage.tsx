"use client";
import { useState } from "react";
import ProfileTabs, { ProfileTab } from "./ProfileTabs";
import PersonalInfoTab from "./PersonalInfoTab";
import EmergencyContactTab from "./EmergencyContactTab";
import HealthOverviewTab from "./HealthOverviewTab";
import MedicalHistoryTab from "./MedicalHistoryTab";

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState<ProfileTab>("personal");

	return (
		<div>
			<h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>

			<div className="mt-4">
				<ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
			</div>

			{activeTab === "personal" && <PersonalInfoTab />}
			{activeTab === "emergency" && <EmergencyContactTab />}
			{activeTab === "health" && <HealthOverviewTab />}
			{activeTab === "medical-history" && <MedicalHistoryTab />}
		</div>
	);
}
