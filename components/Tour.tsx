import React, { useState } from 'react';
import { X, ChevronRight, Check, Zap } from 'lucide-react';

interface TourProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo: () => void;
}

export const Tour: React.FC<TourProps> = ({ isOpen, onClose, onStartDemo }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to InvoiceX",
      content: "InvoiceX is a decentralized invoice financing protocol. SMEs tokenize invoices into NFTs to get immediate liquidity, while investors earn stable yields.",
      icon: <Zap className="w-12 h-12 text-indigo-400 mb-4" />
    },
    {
      title: "Live vs Demo Mode",
      content: "We've added a toggle in the sidebar! Switch between 'Live Mode' (Real Web3 wallet & storage) and 'Demo Mode' (Pre-loaded mock data) to explore safely.",
      icon: <div className="w-12 h-12 rounded-full bg-gray-700 border border-gray-600 mb-4 flex items-center justify-center text-xs text-white font-mono">LIVE/DEMO</div>
    },
    {
      title: "For Investors",
      content: "Browse the Marketplace, review AI-generated risk scores, and stake stablecoins (USDC) to fund invoices and earn APR.",
      icon: <div className="text-4xl mb-4">💰</div>
    },
    {
      title: "For SMEs",
      content: "Upload invoice details, get instant AI underwriting, mint a digital asset (NFT), and receive funding from the global pool.",
      icon: <div className="text-4xl mb-4">🏭</div>
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center text-center mb-8">
          {steps[step].icon}
          <h3 className="text-2xl font-bold text-white mb-3">{steps[step].title}</h3>
          <p className="text-gray-400 leading-relaxed">{steps[step].content}</p>
        </div>

        <div className="flex flex-col gap-3">
           <div className="flex space-x-1 justify-center mb-4">
             {steps.map((_, i) => (
               <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-indigo-500' : 'bg-gray-700'}`}></div>
             ))}
          </div>

           <button 
             onClick={handleNext}
             className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center"
           >
             {step === steps.length - 1 ? 'Get Started' : 'Next'} <ChevronRight className="w-4 h-4 ml-2" />
           </button>
           
           {step === 0 && (
               <button onClick={onStartDemo} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium py-2">
                   Skip Tour & Enable Demo Mode
               </button>
           )}
        </div>
      </div>
    </div>
  );
};
