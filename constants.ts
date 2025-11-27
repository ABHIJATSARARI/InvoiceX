import { Invoice, InvoiceStatus, RiskAnalysis } from './types.ts';

// Application Constraints
export const QIE_ORACLE_STATUS = "ONLINE";

// Mock Data for Demo Mode
export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_mock_1',
    smeAddress: '0x71C...9A21',
    buyerName: 'TechCorp International',
    invoiceNumber: 'INV-2024-001',
    amount: 15000,
    currency: 'USD',
    dueDate: '2024-12-31',
    description: 'Electronics components batch #452 for Q4 production run.',
    status: InvoiceStatus.FUNDING,
    fundedAmount: 8500,
    createdAt: new Date().toISOString(),
    risk: {
      score: 85,
      grade: 'A',
      justification: 'Strong balance sheet, consistent payment history from buyer.',
      recommendedApr: 8.5
    }
  },
  {
    id: 'inv_mock_2',
    smeAddress: '0x82D...4B12',
    buyerName: 'Global Retail Solutions',
    invoiceNumber: 'INV-2024-002',
    amount: 50000,
    currency: 'EUR',
    dueDate: '2025-01-15',
    description: 'Textile shipment for Spring collection. Verified shipping documents.',
    status: InvoiceStatus.FUNDING,
    fundedAmount: 12000,
    createdAt: new Date().toISOString(),
    risk: {
      score: 72,
      grade: 'B',
      justification: 'Large volume transaction, buyer sector has moderate volatility.',
      recommendedApr: 11.2
    }
  },
   {
    id: 'inv_mock_3',
    smeAddress: '0x93E...5C34',
    buyerName: 'StartUp Inc',
    invoiceNumber: 'INV-2024-003',
    amount: 8000,
    currency: 'USD',
    dueDate: '2024-11-20',
    description: 'Consulting services for software architecture.',
    status: InvoiceStatus.PENDING_RISK,
    fundedAmount: 0,
    createdAt: new Date().toISOString(),
     risk: {
      score: 65,
      grade: 'C',
      justification: 'New entity, limited credit history available.',
      recommendedApr: 14.5
    }
  },
  {
    id: 'inv_mock_4',
    smeAddress: '0xA4F...6D45',
    buyerName: 'Omega Construct',
    invoiceNumber: 'INV-2024-004',
    amount: 125000,
    currency: 'USD',
    dueDate: '2025-03-01',
    description: 'Structural steel beams for City Center project phase 2.',
    status: InvoiceStatus.FUNDING,
    fundedAmount: 45000,
    createdAt: new Date().toISOString(),
    risk: {
      score: 92,
      grade: 'A+',
      justification: 'Government contracted project, secured payment terms.',
      recommendedApr: 6.8
    }
  },
  {
    id: 'inv_mock_5',
    smeAddress: '0xB5G...7E56',
    buyerName: 'Fresh Foods Market',
    invoiceNumber: 'INV-2024-005',
    amount: 12000,
    currency: 'EUR',
    dueDate: '2024-11-30',
    description: 'Organic produce wholesale delivery.',
    status: InvoiceStatus.FUNDED,
    fundedAmount: 12000,
    createdAt: new Date().toISOString(),
    risk: {
      score: 78,
      grade: 'B',
      justification: 'Perishable goods risk, but buyer has high credit rating.',
      recommendedApr: 9.5
    }
  },
  {
    id: 'inv_mock_6',
    smeAddress: '0xC6H...8F67',
    buyerName: 'Crypto Mining Co',
    invoiceNumber: 'INV-2024-006',
    amount: 45000,
    currency: 'USD',
    dueDate: '2024-12-15',
    description: 'ASIC mining hardware supply.',
    status: InvoiceStatus.FUNDING,
    fundedAmount: 1500,
    createdAt: new Date().toISOString(),
    risk: {
      score: 45,
      grade: 'D',
      justification: 'High volatility sector, regulatory uncertainty.',
      recommendedApr: 22.0
    }
  },
  {
    id: 'inv_mock_7',
    smeAddress: '0xD7I...9G78',
    buyerName: 'Apex Logistics',
    invoiceNumber: 'INV-2024-007',
    amount: 28500,
    currency: 'USD',
    dueDate: '2025-02-10',
    description: 'Fleet maintenance and parts supply.',
    status: InvoiceStatus.REPAID,
    fundedAmount: 28500,
    createdAt: new Date().toISOString(),
    risk: {
      score: 88,
      grade: 'A',
      justification: 'Long-standing relationship, auto-pay enabled.',
      recommendedApr: 7.9
    }
  },
  {
    id: 'inv_mock_8',
    smeAddress: '0xE8J...0H89',
    buyerName: 'Novelty Gifts LLC',
    invoiceNumber: 'INV-2024-008',
    amount: 3500,
    currency: 'USD',
    dueDate: '2024-11-15',
    description: 'Holiday season inventory stock.',
    status: InvoiceStatus.FUNDING,
    fundedAmount: 3000,
    createdAt: new Date().toISOString(),
    risk: {
      score: 55,
      grade: 'C',
      justification: 'Seasonal business model, cash flow gaps common.',
      recommendedApr: 16.5
    }
  }
];

export const MOCK_INVESTMENTS = [
    {
        id: 'tx_mock_1',
        invoiceId: 'inv_mock_7',
        investorAddress: '0xDemoWallet...8A2',
        amount: 5000,
        timestamp: new Date(Date.now() - 86400000 * 30).toISOString() // 30 days ago
    },
    {
        id: 'tx_mock_2',
        invoiceId: 'inv_mock_1',
        investorAddress: '0xDemoWallet...8A2',
        amount: 2500,
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    }
];