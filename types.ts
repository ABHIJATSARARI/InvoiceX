export enum UserRole {
  SME = 'SME',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN'
}

export enum InvoiceStatus {
  PENDING_RISK = 'PENDING_RISK',
  READY_TO_MINT = 'READY_TO_MINT',
  FUNDING = 'FUNDING',
  FUNDED = 'FUNDED',
  REPAID = 'REPAID'
}

export interface RiskAnalysis {
  score: number; // 0-100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  justification: string;
  recommendedApr: number;
}

export interface Invoice {
  id: string;
  smeAddress: string;
  buyerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  description: string;
  status: InvoiceStatus;
  risk?: RiskAnalysis;
  fundedAmount: number;
  createdAt: string;
  file?: File | null;
}

export interface Investment {
  id: string;
  invoiceId: string;
  investorAddress: string;
  amount: number;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ActivityLog {
  id: string;
  type: 'MINT' | 'INVEST' | 'REPAY';
  message: string;
  timestamp: string;
  amount?: number;
}

export type ViewState = 'DASHBOARD' | 'MARKETPLACE' | 'UPLOAD' | 'PROFILE';

declare global {
  interface Window {
    ethereum: any;
  }
}