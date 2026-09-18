export type ProfileTab = "personal" | "emergency" | "health" | "medical-history";

const tabs: { label: string; value: ProfileTab }[] = [
	{ label: "Personal Information", value: "personal" },
	{ label: "Emergency Contact", value: "emergency" },
	{ label: "Health Overview", value: "health" },
	{ label: "Medical History", value: "medical-history" },
];

interface ProfileTabsProps {
	activeTab: ProfileTab;
	onChange: (tab: ProfileTab) => void;
}

export default function ProfileTabs({ activeTab, onChange }: ProfileTabsProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{tabs.map((tab) => (
				<button
					key={tab.value}
					type="button"
					onClick={() => onChange(tab.value)}
					className={`rounded-[8px] border px-4 py-1.5 text-sm font-medium duration-150
            ${
							activeTab === tab.value
								? "border-black bg-black text-white"
								: "border-[#E5E5E5] text-black hover:bg-[#FAFAFA]"
						}
          `}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
}
