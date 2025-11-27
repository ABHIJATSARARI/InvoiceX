import React, { useState } from 'react';
import { Calendar, DollarSign, TrendingUp, Info, Clock, ChevronUp, FileText, Eye } from 'lucide-react';
import { Invoice, InvoiceStatus, UserRole } from '../types.ts';

interface InvoiceCardProps {
  invoice: Invoice;
  role: UserRole;
  onAction?: (invoice: Invoice) => void;
  actionLabel?: string;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, role, onAction, actionLabel }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fundingPercentage = Math.min(100, (invoice.fundedAmount / invoice.amount) * 100);
  
  const getRiskGradient = (grade?: string) => {
    if (!grade) return 'from-gray-600 to-gray-700';
    if (['A+', 'A'].includes(grade)) return 'from-emerald-400 to-emerald-700 shadow-emerald-500/30';
    if (['B'].includes(grade)) return 'from-blue-400 to-blue-700 shadow-blue-500/30';
    if (['C'].includes(grade)) return 'from-yellow-400 to-yellow-700 shadow-yellow-500/30';
    return 'from-red-400 to-red-700 shadow-red-500/30';
  };

  const getCardStyle = (grade?: string) => {
    if (!grade) return 'border-gray-700 hover:border-gray-500 shadow-xl';
    if (['A+', 'A'].includes(grade)) return 'border-emerald-500/30 hover:border-emerald-400 shadow-lg hover:shadow-emerald-500/20';
    if (['B'].includes(grade)) return 'border-blue-500/30 hover:border-blue-400 shadow-lg hover:shadow-blue-500/20';
    if (['C'].includes(grade)) return 'border-yellow-500/30 hover:border-yellow-400 shadow-lg hover:shadow-yellow-500/20';
    return 'border-red-500/30 hover:border-red-400 shadow-lg hover:shadow-red-500/20';
  };

  const getRiskLabel = (grade?: string) => {
    if (!grade) return 'Unknown';
    if (['A+', 'A'].includes(grade)) return 'Low Risk';
    if (['B'].includes(grade)) return 'Medium Risk';
    if (['C'].includes(grade)) return 'High Risk';
    return 'Critical Risk';
  };

  const calculateDaysRemaining = (dueDateStr: string) => {
    const today = new Date();
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining(invoice.dueDate);
  const termDisplay = daysRemaining > 0 ? `${daysRemaining}` : "0";

  // Calculate estimated yield (Simple Interest: Principal * Rate * Time)
  const estYield = invoice.risk?.recommendedApr 
    ? (invoice.amount * (invoice.risk.recommendedApr / 100) * (Math.max(daysRemaining, 0) / 365)) 
    : 0;

  return (
    <div className={`bg-gray-800 rounded-xl border transition-all duration-300 group flex flex-col h-full ${getCardStyle(invoice.risk?.grade)}`}>
      <div className="p-5 flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle background glow based on risk */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getRiskGradient(invoice.risk?.grade).split(' ')[0]} opacity-5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none`}></div>

        <div className="flex justify-between items-start mb-4 relative z-10 min-h-[5rem]">
          <div className="pr-20 w-full">
            <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2">
              {invoice.buyerName}
            </h3>
            <p className="text-xs text-gray-400 font-mono mb-2">{invoice.invoiceNumber}</p>
          </div>
          
          {invoice.risk && (
            <div className="absolute -top-1 -right-1 flex flex-col items-center z-20">
              <div className={`relative group/badge flex flex-col items-center justify-center w-16 h-16 rounded-2xl shadow-xl bg-gradient-to-br ${getRiskGradient(invoice.risk.grade)} transform transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 ring-4 ring-gray-800`}>
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover/badge:opacity-20 transition-opacity duration-300"></div>
                
                <span className="text-2xl font-black text-white leading-none drop-shadow-md">{invoice.risk.grade}</span>
                <div className="h-px w-8 bg-white/30 my-0.5"></div>
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">{invoice.risk.score}</span>
              </div>
              
              <div className={`mt-2 px-2 py-0.5 rounded-full bg-gray-900/80 backdrop-blur border border-gray-700 shadow-sm`}>
                 <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                    ['A+', 'A'].includes(invoice.risk.grade) ? 'text-emerald-400' : 
                    ['B'].includes(invoice.risk.grade) ? 'text-blue-400' :
                    ['C'].includes(invoice.risk.grade) ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {getRiskLabel(invoice.risk.grade)}
                  </span>
              </div>
            </div>
          )}
        </div>

        {/* Description Preview with Tooltip */}
        <div className="mb-5 relative group/desc z-20">
          <div className="flex items-start">
             <FileText className="w-3 h-3 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
             <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed cursor-help hover:text-gray-300 transition-colors">
               {invoice.description}
             </p>
          </div>
          {/* Tooltip Popup */}
          <div className="absolute bottom-full left-0 mb-2 w-64 hidden group-hover/desc:block z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-200">
             <div className="bg-gray-950/95 backdrop-blur text-xs text-gray-300 p-3 rounded-lg border border-gray-700 shadow-2xl relative">
               {invoice.description}
               <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-700"></div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-700/50">
            <div className="flex items-center text-gray-400 mb-1 text-[10px] font-bold uppercase tracking-wider">
              <DollarSign className="w-3 h-3 mr-1" />
              Value
            </div>
            <div className="text-sm font-bold text-white truncate">
              {invoice.amount.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">{invoice.currency}</span>
            </div>
          </div>

          <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-700/50">
            <div className="flex items-center text-gray-400 mb-1 text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3 mr-1" />
              Term
            </div>
            <div className="text-sm font-bold text-white truncate">
              {termDisplay} <span className="text-[10px] font-normal text-gray-400">{daysRemaining > 0 ? 'Days' : 'Due'}</span>
            </div>
          </div>

          <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-700/50 relative group/yield">
            <div className="flex items-center text-gray-400 mb-1 text-[10px] font-bold uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 mr-1" />
              Yield
            </div>
            <div className="text-sm font-bold text-emerald-400 truncate">
              {invoice.risk?.recommendedApr}%
            </div>
            
            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/yield:block z-20 w-max max-w-[150px]">
                <div className="bg-gray-900 text-xs text-emerald-300 px-3 py-2 rounded-lg border border-emerald-500/30 shadow-xl text-center">
                    <p className="font-bold text-emerald-100 mb-0.5">Est. Total Return</p>
                    <p className="font-mono text-emerald-400">+${estYield.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
              Due Date
            </span>
            <span className="text-gray-200 font-medium">{invoice.dueDate}</span>
          </div>
        </div>

        {/* Enhanced Visual Progress Bar */}
        <div className="mb-4 bg-gray-900/40 p-3 rounded-lg border border-gray-700/30">
          <div className="flex justify-between text-xs text-gray-300 mb-2 font-medium">
             <span className="flex items-center">
               Progress
               {invoice.status === InvoiceStatus.FUNDING && (
                 <span className="flex h-2 w-2 ml-2 relative">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                 </span>
               )}
             </span>
             <span className={`${fundingPercentage >= 100 ? 'text-emerald-400' : 'text-indigo-300'}`}>
                {fundingPercentage.toFixed(1)}%
             </span>
          </div>
          
          <div className="w-full bg-gray-950 rounded-full h-4 border border-gray-700 relative overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                  invoice.status === InvoiceStatus.REPAID 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' 
                  : 'bg-gradient-to-r from-indigo-900 via-indigo-600 to-indigo-400'
              }`}
              style={{ width: `${fundingPercentage}%` }}
            >
                {/* Striped overlay for texture */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
            </div>
          </div>
          
          <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 font-mono">
             <span>{invoice.fundedAmount.toLocaleString()} {invoice.currency} Raised</span>
             <span>Goal: {invoice.amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Expanded Details Section */}
        {isExpanded && (
           <div className="mt-4 pt-4 border-t border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="mb-4">
                   <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                      <FileText className="w-3 h-3 mr-1" /> Description
                   </h4>
                   <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                       {invoice.description}
                   </p>
               </div>
               
               {invoice.risk?.justification && (
                   <div className="mb-4">
                       <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                           <Info className="w-3 h-3 mr-1" /> Risk Analysis
                       </h4>
                       <div className="bg-blue-900/10 p-3 rounded-lg border border-blue-900/30">
                           <p className="text-sm text-blue-200/80 italic leading-relaxed">
                               {invoice.risk.justification}
                           </p>
                       </div>
                   </div>
               )}
               
               <div className="grid grid-cols-2 gap-4 text-xs">
                   <div className="bg-gray-900/30 p-2 rounded border border-gray-800">
                       <span className="block text-gray-500 mb-0.5">Invoice ID</span>
                       <span className="font-mono text-indigo-300">{invoice.id}</span>
                   </div>
                   <div className="bg-gray-900/30 p-2 rounded border border-gray-800">
                       <span className="block text-gray-500 mb-0.5">Seller Address</span>
                       <span className="font-mono text-indigo-300 truncate">{invoice.smeAddress}</span>
                   </div>
               </div>
           </div>
        )}
      </div>

      <div className="p-5 pt-0 mt-auto grid gap-3">
        {onAction ? (
             <div className="grid grid-cols-2 gap-3">
                 <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-center py-3 rounded-lg text-sm font-bold border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all focus:outline-none"
                 >
                    {isExpanded ? 'Hide Details' : 'View Details'}
                 </button>
                 <button
                    onClick={() => onAction(invoice)}
                    disabled={
                      (invoice.status === InvoiceStatus.FUNDED && role !== UserRole.SME) || 
                      invoice.status === InvoiceStatus.REPAID
                    }
                    className={`flex items-center justify-center py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all shadow-lg ${
                        invoice.status === InvoiceStatus.REPAID
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                        : invoice.status === InvoiceStatus.FUNDED
                          ? (role === UserRole.SME 
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' 
                              : 'bg-emerald-900/30 text-emerald-500 cursor-not-allowed border border-emerald-900')
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20 hover:shadow-indigo-900/40 translate-y-0 hover:-translate-y-0.5'
                    }`}
                 >
                    {invoice.status === InvoiceStatus.REPAID ? 'Repaid' : 
                     invoice.status === InvoiceStatus.FUNDED ? (role === UserRole.SME ? 'Repay Loan' : 'Funded') : 
                     actionLabel}
                 </button>
             </div>
         ) : (
             <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center py-3 rounded-lg text-sm font-medium border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all bg-gray-800/50"
             >
                {isExpanded ? (
                    <>
                        <ChevronUp className="w-4 h-4 mr-2" /> Hide Details
                    </>
                ) : (
                    <>
                        <Eye className="w-4 h-4 mr-2" /> View Details
                    </>
                )}
             </button>
         )}
      </div>
    </div>
  );
};