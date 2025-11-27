import React, { useState } from 'react';
import { X, DollarSign, AlertTriangle } from 'lucide-react';
import { Invoice } from '../types.ts';

interface InvestModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  userBalance: number;
}

export const InvestModal: React.FC<InvestModalProps> = ({ invoice, isOpen, onClose, onConfirm, userBalance }) => {
  const [stakeAmount, setStakeAmount] = useState<string>('');
  
  if (!isOpen) return null;

  const remainingNeeded = invoice.amount - invoice.fundedAmount;
  const apr = invoice.risk?.recommendedApr || 0;
  
  // Calculate potential return: Amount * (1 + (APR/100 * (60/365))) - assuming 60 days maturity avg for demo
  const estimatedReturn = Number(stakeAmount) * (1 + (apr / 100) * (60 / 365));
  const profit = estimatedReturn - Number(stakeAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(Number(stakeAmount));
    setStakeAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-1">Fund Invoice</h3>
          <p className="text-gray-400 text-sm mb-6">Invest in {invoice.buyerName}</p>

          <div className="bg-gray-800 rounded-lg p-4 mb-6 space-y-3">
             <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Goal</span>
                <span className="text-white font-medium">{invoice.amount.toLocaleString()} {invoice.currency}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-400">Remaining</span>
                <span className="text-indigo-400 font-medium">{remainingNeeded.toLocaleString()} {invoice.currency}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-400">APR Yield</span>
                <span className="text-emerald-400 font-bold">{apr}%</span>
             </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Stake Amount (USDC)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="number"
                  required
                  min="5"
                  max={remainingNeeded}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-lg"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-between text-xs mt-2 text-gray-500">
                <span>Min: $5.00</span>
                <span>Balance: ${userBalance.toLocaleString()}</span>
              </div>
            </div>

            {Number(stakeAmount) > 0 && (
              <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-lg p-3 mb-6">
                 <div className="flex justify-between items-center">
                    <span className="text-emerald-200 text-sm">Est. Repayment</span>
                    <span className="text-emerald-400 font-bold text-lg">${estimatedReturn.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center mt-1">
                    <span className="text-emerald-200/60 text-xs">Net Profit (60 days)</span>
                    <span className="text-emerald-400/80 text-sm">+${profit.toFixed(2)}</span>
                 </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98]"
            >
              Confirm Stake
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};