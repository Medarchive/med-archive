export type TransactionStatus = "approved" | "declined" | "pending";

export interface Transaction {
	id: string;
	transactionId: string;
	type: string;
	amount: string;
	status: TransactionStatus;
}

export const initialTransactions: Transaction[] = [
	{
		id: "1",
		transactionId: "P2CXDOIM4333AUNCZ2NUA2EKV",
		type: "Lab Request",
		amount: "$10.45",
		status: "approved",
	},
	{
		id: "2",
		transactionId: "P2CXDOIM4333AUNCZ2NUA2EKV",
		type: "Lab Request",
		amount: "$10.45",
		status: "approved",
	},
	{
		id: "3",
		transactionId: "P2CXDOIM4333AUNCZ2NUA2EKV",
		type: "Lab Request",
		amount: "$10.45",
		status: "approved",
	},
	{
		id: "4",
		transactionId: "P2CXDOIM4333AUNCZ2NUA2EKV",
		type: "Lab Request",
		amount: "$20.99",
		status: "declined",
	},
	{
		id: "5",
		transactionId: "P2CXDOIM4333AUNCZ2NUA2EKV",
		type: "Lab Request",
		amount: "$10.45",
		status: "approved",
	},
	{
		id: "6",
		transactionId: "P2CXDOIM4333AUNCZ2NUA2EKV",
		type: "Lab Request",
		amount: "$300.45",
		status: "pending",
	},
	{
		id: "7",
		transactionId: "P2CXDOIM4333AUNCZ2NUA2EKV",
		type: "Lab Request",
		amount: "$10.45",
		status: "approved",
	},
	{
		id: "8",
		transactionId: "P2CXDOIM4333AUNCZ2NUA2EKV",
		type: "Deposit",
		amount: "$300.00",
		status: "approved",
	},
];
