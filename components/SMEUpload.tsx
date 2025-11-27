import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Cpu, Shield, Search, BarChart3, Lock } from 'lucide-react';
import { analyzeInvoiceRisk } from '../services/geminiService.ts';
import { Invoice, InvoiceStatus } from '../types.ts';

interface SMEUploadProps {
  onMint: (invoice: Invoice) => void;
  walletAddress: string;
  exchangeRate: number;
  notify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const SMEUpload: React.FC<SMEUploadProps> = ({ onMint, walletAddress, exchangeRate, notify }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [analyzedInvoice, setAnalyzedInvoice] = useState<Partial<Invoice> | null>(null);
  
  // AI Terminal State
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisLog, setAnalysisLog] = useState<string[]>([]);

  // Ref to track interval for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    buyerName: '',
    invoiceNumber: '',
    amount: '',
    currency: 'USD',
    dueDate: '',
    description: ''
  });

  const analysisSteps = [
    { text: "Connecting to Gemini Pro 1.5 Risk Engine...", icon: Cpu },
    { text: `Parsing entity data for "${formData.buyerName}"...`, icon: Search },
    { text: "Cross-referencing global credit ledgers...", icon: GlobeIcon },
    { text: "Evaluating macroeconomic sector volatility...", icon: BarChart3 },
    { text: "Calculating probability of default...", icon: Lock },
    { text: "Finalizing risk score and yield pricing...", icon: Shield },
  ];

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      notify('error', "Please connect wallet first");
      return;
    }

    // Clear any running interval before starting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setLoading(true);
    setAnalysisStep(0);
    setAnalysisLog([]);
    
    // Simulate the visual steps while the actual API call happens
    let currentStep = 0;
    
    intervalRef.current = setInterval(() => {
        if (currentStep < analysisSteps.length) {
            setAnalysisStep(prev => prev + 1);
            
            // Safety check to prevent accessing undefined index
            const stepData = analysisSteps[currentStep];
            if (stepData) {
                setAnalysisLog(prev => [...prev, stepData.text]);
            }
            
            currentStep++;
        } else {
            // Clear interval if we've gone through all steps
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, 800); // 800ms per step visual delay

    try {
      // Actual API Call
      const risk = await analyzeInvoiceRisk(
        formData.buyerName,
        Number(formData.amount),
        formData.currency,
        formData.dueDate,
        formData.description
      );

      // Ensure animation finishes before showing result
      // Wait for animation duration + buffer
      const animationDuration = (analysisSteps.length * 800) + 500;
      
      setTimeout(() => {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setAnalyzedInvoice({
            ...formData,
            amount: Number(formData.amount),
            risk
          });
          setStep(2);
          notify('success', 'AI Analysis Complete');
          setLoading(false);
      }, animationDuration);

    } catch (err) {
      console.error(err);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLoading(false);
      notify('error', 'Analysis failed. Please try again.');
    }
  };

  const handleMint = () => {
    if (!analyzedInvoice || !analyzedInvoice.risk) return;

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      smeAddress: walletAddress,
      buyerName: analyzedInvoice.buyerName!,
      invoiceNumber: analyzedInvoice.invoiceNumber!,
      amount: analyzedInvoice.amount!,
      currency: analyzedInvoice.currency!,
      dueDate: analyzedInvoice.dueDate!,
      description: analyzedInvoice.description!,
      status: InvoiceStatus.FUNDING,
      fundedAmount: 0,
      createdAt: new Date().toISOString(),
      risk: analyzedInvoice.risk
    };

    onMint(newInvoice);
  };

  // Render the AI Terminal Overlay
  if (loading) {
    return (
        <div className="max-w-3xl mx-auto min-h-[500px] flex items-center justify-center">
            <div className="w-full bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl relative">
                <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2 border-b border-gray-700">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-400 font-mono">gemini_risk_engine_v2.exe</span>
                </div>
                <div className="p-8 font-mono h-96 flex flex-col relative">
                    {/* Background Matrix Effect */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(32, 255, 77, .1) 25%, rgba(32, 255, 77, .1) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .1) 75%, rgba(32, 255, 77, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 77, .1) 25%, rgba(32, 255, 77, .1) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .1) 75%, rgba(32, 255, 77, .1) 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}></div>

                    <div className="space-y-4 z-10">
                        {analysisLog.map((log, index) => {
                           const StepIcon = analysisSteps[index]?.icon || CheckCircle;
                           return (
                            <div key={index} className="flex items-center text-emerald-400 animate-in fade-in slide-in-from-left-4 duration-300">
                                <StepIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="text-sm">{log}</span>
                                {index === analysisLog.length - 1 && (
                                    <span className="ml-2 inline-block w-2 h-4 bg-emerald-500 animate-pulse"></span>
                                )}
                            </div>
                           );
                        })}
                        {analysisLog.length < analysisSteps.length && (
                             <div className="flex items-center text-gray-500 animate-pulse mt-2 pl-8">
                                <span className="text-xs">Processing data blocks...</span>
                             </div>
                        )}
                    </div>
                    
                    <div className="mt-auto border-t border-gray-700 pt-4">
                        <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                            <span>Analysis Progress</span>
                            <span>{Math.round((analysisLog.length / analysisSteps.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-300 ease-out" style={{ width: `${(analysisLog.length / analysisSteps.length) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Tokenize Invoice</h2>
        <p className="text-gray-400">Convert your receivable into a liquid digital asset on QIE Blockchain.</p>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Progress Steps */}
        <div className="flex border-b border-gray-700">
          <div className={`flex-1 py-4 text-center text-sm font-medium ${step === 1 ? 'text-indigo-400 bg-gray-900/50' : 'text-gray-500'}`}>
            1. Details & Analysis
          </div>
          <div className={`flex-1 py-4 text-center text-sm font-medium ${step === 2 ? 'text-indigo-400 bg-gray-900/50' : 'text-gray-500'}`}>
            2. Review & Mint NFT
          </div>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleAnalyze} className="space-y-6">
              
              {/* Oracle Rate Display */}
              <div className="flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-3">
                   <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </div>
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">QIE Oracle Live Feed</span>
                </div>
                <div className="flex items-center text-sm font-mono text-gray-400">
                  <RefreshCw className="w-3.5 h-3.5 mr-2 text-gray-500" />
                  <span>EUR/USD: <span className="text-white font-bold ml-1">{exchangeRate.toFixed(4)}</span></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Buyer/Client Name</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Global Corp Ltd"
                    value={formData.buyerName}
                    onChange={e => setFormData({...formData, buyerName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Invoice Number</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="e.g. INV-2024-001"
                    value={formData.invoiceNumber}
                    onChange={e => setFormData({...formData, invoiceNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                    <select 
                      className="absolute right-2 top-2 bg-gray-800 text-xs text-white px-2 py-1 rounded border border-gray-600 focus:outline-none"
                      value={formData.currency}
                      onChange={e => setFormData({...formData, currency: e.target.value})}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                   {formData.currency === 'EUR' && formData.amount && (
                    <p className="text-xs text-indigo-400 mt-1.5 flex items-center font-mono">
                      ≈ {(Number(formData.amount) * exchangeRate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description / Goods Sold</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Describe the goods or services provided..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                <p className="text-sm text-blue-200">
                  By proceeding, you agree that this invoice is valid and verifiable. The AI Risk Engine will analyze these details to assign a credit score.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Running AI Risk Analysis...
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Run Gemini AI Analysis
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/30 text-emerald-500 mb-4 border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
                <p className="text-gray-400">Your invoice is ready for the marketplace.</p>
              </div>

              {analyzedInvoice?.risk && (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheckIcon className="w-32 h-32" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 relative z-10">
                    <div>
                       <p className="text-gray-500 text-sm mb-1">Risk Grade</p>
                       <div className="text-4xl font-black text-white">{analyzedInvoice.risk.grade}</div>
                    </div>
                    <div>
                       <p className="text-gray-500 text-sm mb-1">Score</p>
                       <div className="text-4xl font-black text-white">{analyzedInvoice.risk.score}<span className="text-lg text-gray-500 font-normal">/100</span></div>
                    </div>
                    <div>
                       <p className="text-gray-500 text-sm mb-1">Recommended APR</p>
                       <div className="text-2xl font-bold text-emerald-400">{analyzedInvoice.risk.recommendedApr}%</div>
                    </div>
                    <div>
                       <p className="text-gray-500 text-sm mb-1">Market Interest</p>
                       <div className="text-2xl font-bold text-indigo-400">High</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <div className="flex items-start">
                        <Cpu className="w-5 h-5 text-indigo-400 mr-2 mt-0.5" />
                        <p className="text-sm text-gray-300 italic">" {analyzedInvoice.risk.justification} "</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleMint}
                  className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-bold shadow-lg shadow-indigo-900/20"
                >
                  Mint Invoice NFT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ShieldCheckIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
)

const GlobeIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
)