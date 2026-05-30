export type SettlementStatus = "Pending" | "Processed";

export interface SettlementData {
  id: string;
  requestDate: string;
  userName: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  status: SettlementStatus;
  remark?: string;
  slipUrl?: string;
}

export const BANK_OPTIONS = ["KBank", "SCB", "BBL", "Krungthai", "TMB", "Bay", "CIMB", "UOB"] as const;

export const STATUS_OPTIONS = ["All", "Pending", "Processed"] as const;

export function formatBaht(amount: number): string {
  return `฿${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatBankDetails(bankName: string, accountNumber: string): string {
  return `${bankName} - ${accountNumber}`;
}

export const MOCK_SETTLEMENTS: SettlementData[] = [
  {
    id: "STL-001",
    requestDate: "2024-11-01",
    userName: "Somchai Jaidee",
    bankName: "KBank",
    accountNumber: "1234567890",
    amount: 15000.0,
    status: "Pending",
  },
  {
    id: "STL-002",
    requestDate: "2024-11-02",
    userName: "Niran Suwannarat",
    bankName: "SCB",
    accountNumber: "9876543210",
    amount: 32500.5,
    status: "Pending",
  },
  {
    id: "STL-003",
    requestDate: "2024-11-03",
    userName: "Ploy Chaisri",
    bankName: "BBL",
    accountNumber: "4567891230",
    amount: 8750.25,
    status: "Processed",
    slipUrl: "/slips/stl-003.png",
  },
  {
    id: "STL-004",
    requestDate: "2024-11-04",
    userName: "Arthit Panyakij",
    bankName: "Krungthai",
    accountNumber: "3216549870",
    amount: 42000.0,
    status: "Pending",
  },
  {
    id: "STL-005",
    requestDate: "2024-11-05",
    userName: "Wipa Srinuan",
    bankName: "TMB",
    accountNumber: "6549873210",
    amount: 5600.75,
    status: "Pending",
  },
  {
    id: "STL-006",
    requestDate: "2024-11-06",
    userName: "Kanya Rattana",
    bankName: "KBank",
    accountNumber: "7891234560",
    amount: 12000.0,
    status: "Processed",
    slipUrl: "/slips/stl-006.png",
  },
  {
    id: "STL-007",
    requestDate: "2024-11-07",
    userName: "Tanawat Petchsri",
    bankName: "SCB",
    accountNumber: "1472583690",
    amount: 27350.0,
    status: "Pending",
  },
  {
    id: "STL-008",
    requestDate: "2024-11-08",
    userName: "Malai Thongkam",
    bankName: "BBL",
    accountNumber: "2583691470",
    amount: 9800.5,
    status: "Pending",
  },
  {
    id: "STL-009",
    requestDate: "2024-11-09",
    userName: "Prasong Homklin",
    bankName: "Krungthai",
    accountNumber: "3691472580",
    amount: 18500.0,
    status: "Processed",
    slipUrl: "/slips/stl-009.png",
  },
  {
    id: "STL-010",
    requestDate: "2024-11-10",
    userName: "Suwannee Poonpol",
    bankName: "TMB",
    accountNumber: "7418529630",
    amount: 6200.25,
    status: "Pending",
  },
  {
    id: "STL-011",
    requestDate: "2024-11-11",
    userName: "Chaiyaporn Vongvip",
    bankName: "KBank",
    accountNumber: "8529637410",
    amount: 51000.0,
    status: "Pending",
  },
  {
    id: "STL-012",
    requestDate: "2024-11-12",
    userName: "Siriporn Kwanmuang",
    bankName: "SCB",
    accountNumber: "9637418520",
    amount: 13750.75,
    status: "Processed",
    slipUrl: "/slips/stl-012.png",
  },
];