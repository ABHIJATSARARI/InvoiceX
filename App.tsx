import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { SMEUpload } from './components/SMEUpload.tsx';
import { InvoiceCard } from './components/InvoiceCard.tsx';
import { InvestModal } from './components/InvestModal.tsx';
import { Tour } from './components/Tour.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import { Invoice, UserRole, ViewState, Investment, InvoiceStatus, Notification, ActivityLog } from './types.ts';
import { Wallet, TrendingUp, AlertCircle, Activity, Search, X, Download, Clock } from 'lucide-react';
import { fetchEurUsdRate } from './services/forexService.ts';
import { MOCK_INVOICES, MOCK_INVESTMENTS } from './constants.ts';

// Simple CSS-only Bar Chart Component
const SimpleBarChart = ({ data }: { data: { name: string; yield: number }[] }) => {
  const maxVal = Math.max(...data.map(d => d.yield), 1);
  
  return (
    <div className="w-full h-full flex items-end justify-between px-2 gap-4 pt-6 pb-2">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center justify-end flex-1 h-full group relative">
          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-indigo-400 text-xs font-bold px-2 py-1 rounded border border-gray-700 pointer-events-none whitespace-nowrap z-10">
            Count: {item.yield}
          </div>
          <div 
            className="w-full max-w-[40px] bg-indigo-600 rounded-t-sm hover:bg-indigo-500 transition-all duration-300 relative"
            style={{ height: `${maxVal > 0 ? (item.yield / maxVal) * 85 : 0}%` }}
          ></div>
          <span className="text-xs text-gray-400 mt-3 font-medium">{item.name}</span>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gray-700 -z-10"></div>
        </div>
      ))}
    </div>
  );
};

// Simple CSS-only Pie Chart Component
const SimplePieChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  let accumulatedDeg = 0;

  const gradientParts = data.map(item => {
    const deg = (item.value / total) * 360;
    const start = accumulatedDeg;
    const end = accumulatedDeg + deg;
    accumulatedDeg = end;
    return `${item.color} ${start}deg ${end}deg`;
  });

  const backgroundStyle = data.length > 0 
    ? `conic-gradient(${gradientParts.join(', ')})` 
    : '#1f2937'; // Gray-800 fallback

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around h-full gap-4">
        {/* The Chart */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex-shrink-0 shadow-xl" style={{ background: backgroundStyle }}>
           {/* Inner hole for Donut effect */}
           <div className="absolute inset-4 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700/50 shadow-inner">
              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Total Staked</span>
                <div className="text-xs sm:text-sm font-bold text-white">${total.toLocaleString()}</div>
              </div>
           </div>
        </div>
        {/* The Legend */}
        <div className="flex flex-col gap-2 w-full sm:w-auto overflow-y-auto max-h-32 pr-2 custom-scrollbar">
            {data.map((item, i) => (
                <div key={i} className="flex items-center text-xs text-gray-300 justify-between sm:justify-start">
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></div>
                      <span className="truncate max-w-[80px] sm:max-w-[100px]" title={item.name}>{item.name}</span>
                    </div>
                    <span className="ml-3 font-mono text-gray-400">${item.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- UI State ---
  const [showSplash, setShowSplash] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.INVESTOR);
  const [currentView, setCurrentView] = useState<ViewState>('MARKETPLACE');
  const [searchQuery, setSearchQuery] = useState('');
  const [exchangeRate, setExchangeRate] = useState(1.08);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // --- Mode State ---
  const [isMockMode, setIsMockMode] = useState<boolean>(false);

  // --- Real Data (LocalStorage) ---
  const [realInvoices, setRealInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoiceX_invoices');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [realInvestments, setRealInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('invoiceX_investments');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [realWalletBalance, setRealWalletBalance] = useState(() => {
     const saved = localStorage.getItem('invoiceX_balance');
     return saved ? parseFloat(saved) : 1000;
  });

  const [realActivityLog, setRealActivityLog] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('invoiceX_activity');
    return saved ? JSON.parse(saved) : [];
  });

  const [realWalletAddress, setRealWalletAddress] = useState<string | null>(null);

  // --- Mock Data (In-Memory for Session) ---
  const [mockInvoices, setMockInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [mockInvestments, setMockInvestments] = useState<Investment[]>(MOCK_INVESTMENTS);
  const [mockWalletBalance, setMockWalletBalance] = useState(5000);
  const [mockActivityLog, setMockActivityLog] = useState<ActivityLog[]>([]);

  // --- Derived State (Switch based on Mode) ---
  const invoices = isMockMode ? mockInvoices : realInvoices;
  const investments = isMockMode ? mockInvestments : realInvestments;
  const walletBalance = isMockMode ? mockWalletBalance : realWalletBalance;
  const activityLog = isMockMode ? mockActivityLog : realActivityLog;
  const walletAddress = isMockMode ? '0xDemoWallet...8A2' : realWalletAddress;

  // --- Modal State ---
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
    // Show Tour on first visit if no real data
    const hasSeenTour = localStorage.getItem('invoiceX_tour_seen');
    if (!hasSeenTour && !showSplash) {
      setIsTourOpen(true);
      localStorage.setItem('invoiceX_tour_seen', 'true');
    }
  }, [showSplash]);

  useEffect(() => {
    setSearchQuery('');
  }, [currentView, userRole]);

  // Persist Real Data
  useEffect(() => {
    localStorage.setItem('invoiceX_invoices', JSON.stringify(realInvoices));
  }, [realInvoices]);

  useEffect(() => {
    localStorage.setItem('invoiceX_investments', JSON.stringify(realInvestments));
  }, [realInvestments]);

  useEffect(() => {
    localStorage.setItem('invoiceX_balance', realWalletBalance.toString());
  }, [realWalletBalance]);

  useEffect(() => {
    localStorage.setItem('invoiceX_activity', JSON.stringify(realActivityLog));
  }, [realActivityLog]);

  // Fetch Live Forex
  useEffect(() => {
    const getRate = async () => {
      const rate = await fetchEurUsdRate();
      setExchangeRate(rate);
    };
    getRate();
    const interval = setInterval(getRate, 60000); 
    return () => clearInterval(interval);
  }, []);

  // --- Helpers ---

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const logActivity = (type: 'MINT' | 'INVEST' | 'REPAY', message: string, amount?: number) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
      amount
    };
    if (isMockMode) {
      setMockActivityLog(prev => [newLog, ...prev]);
    } else {
      setRealActivityLog(prev => [newLog, ...prev]);
    }
  };

  // --- Handlers ---

  const handleConnectWallet = async () => {
    if (isMockMode) {
      addNotification('info', "In Demo Mode, wallet is simulated.");
      return;
    }

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setRealWalletAddress(accounts[0]);
        addNotification('success', "Wallet connected successfully!");
      } catch (error) {
        console.error("User denied account access");
        addNotification('error', "Connection rejected. Please approve the connection.");
      }
    } else {
      addNotification('error', "Please install MetaMask or a Web3 wallet.");
    }
  };

  const handleDisconnect = () => {
     if (isMockMode) {
         addNotification('info', "Switch to Live Mode to disconnect wallet.");
     } else {
         setRealWalletAddress(null);
         addNotification('info', "Wallet disconnected.");
     }
  };

  const handleMintInvoice = (newInvoice: Invoice) => {
    if (isMockMode) {
        setMockInvoices(prev => [newInvoice, ...prev]);
    } else {
        setRealInvoices(prev => [newInvoice, ...prev]);
    }
    logActivity('MINT', `Minted Invoice #${newInvoice.invoiceNumber}`, newInvoice.amount);
    setCurrentView('DASHBOARD');
    addNotification('success', `Invoice NFT Minted successfully!`);
  };

  const handleOpenInvestModal = (invoice: Invoice) => {
    if (!walletAddress) {
      if (isMockMode) {
          // Should always have wallet in mock mode
      } else {
          addNotification('error', "Please connect wallet to invest.");
          return;
      }
    }
    setSelectedInvoice(invoice);
    setIsInvestModalOpen(true);
  };

  const handleInvest = (amount: number) => {
    if (!selectedInvoice || !walletAddress) return;
    
    const newInvestment: Investment = {
      id: `tx_${Date.now()}`,
      invoiceId: selectedInvoice.id,
      investorAddress: walletAddress,
      amount: amount,
      timestamp: new Date().toISOString()
    };

    // Helper to update specific invoice list
    const updateInvoiceStatus = (invList: Invoice[]) => {
        return invList.map(inv => {
            if (inv.id === selectedInvoice.id) {
              const newFunded = inv.fundedAmount + amount;
              return {
                ...inv,
                fundedAmount: newFunded,
                status: newFunded >= inv.amount ? InvoiceStatus.FUNDED : InvoiceStatus.FUNDING
              };
            }
            return inv;
        });
    };

    if (isMockMode) {
        setMockInvestments(prev => [...prev, newInvestment]);
        setMockWalletBalance(prev => prev - amount);
        setMockInvoices(prev => updateInvoiceStatus(prev));
    } else {
        setRealInvestments(prev => [...prev, newInvestment]);
        setRealWalletBalance(prev => prev - amount);
        setRealInvoices(prev => updateInvoiceStatus(prev));
    }
    
    logActivity('INVEST', `Invested in ${selectedInvoice.buyerName}`, amount);
    setIsInvestModalOpen(false);
    addNotification('success', 'Investment staked successfully!');
  };

  const handleRepay = (invoice: Invoice) => {
    if (!walletAddress) {
       addNotification('error', "Please connect wallet to repay.");
       return;
    }

    if (walletBalance < invoice.amount) {
        addNotification('error', `Insufficient balance. Need ${invoice.amount} to repay.`);
        return;
    }

    const updateRepaidStatus = (invList: Invoice[]) => {
        return invList.map(inv => {
            if (inv.id === invoice.id) {
                return { ...inv, status: InvoiceStatus.REPAID };
            }
            return inv;
        });
    };

    if (isMockMode) {
        setMockWalletBalance(prev => prev - invoice.amount);
        setMockInvoices(prev => updateRepaidStatus(prev));
    } else {
        setRealWalletBalance(prev => prev - invoice.amount);
        setRealInvoices(prev => updateRepaidStatus(prev));
    }

    logActivity('REPAY', `Repaid loan for ${invoice.invoiceNumber}`, invoice.amount);
    addNotification('success', `Loan repaid! Liquidity returned to pool.`);
  };

  const handleExportCSV = () => {
    if (investments.length === 0) {
      addNotification('info', "No investments to export.");
      return;
    }

    const headers = ["Investment ID", "Date", "Invoice Number", "Buyer", "Amount (USDC)", "Invoice Status"];
    const rows = investments.map(inv => {
      const invoice = invoices.find(i => i.id === inv.invoiceId);
      return [
        inv.id,
        new Date(inv.timestamp).toLocaleDateString(),
        `"${invoice?.invoiceNumber || 'N/A'}"`,
        `"${invoice?.buyerName || 'N/A'}"`,
        inv.amount,
        invoice?.status || 'UNKNOWN'
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invoice_portfolio_${isMockMode ? 'demo' : 'live'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('success', 'Portfolio exported successfully');
  };

  // --- Render Helpers ---

  const renderActivityFeed = () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-6">
        <h3 className="text-gray-400 text-sm font-medium mb-4 flex items-center">
            <Clock className="w-4 h-4 mr-2" /> Recent Protocol Activity
        </h3>
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {activityLog.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No activity recorded yet.</p>
            ) : (
                activityLog.map(log => (
                    <div key={log.id} className="flex items-start text-sm border-b border-gray-700/50 pb-3 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 flex-shrink-0 ${
                            log.type === 'MINT' ? 'bg-blue-500' :
                            log.type === 'INVEST' ? 'bg-indigo-500' : 'bg-emerald-500'
                        }`}></div>
                        <div>
                            <p className="text-white">
                                <span className="font-bold text-gray-400 text-xs uppercase tracking-wide mr-1">{log.type}</span>
                                {log.message}
                            </p>
                            <div className="flex justify-between items-center w-full mt-1">
                                <span className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                {log.amount && <span className="text-gray-300 font-mono text-xs">${log.amount.toLocaleString()}</span>}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );

  const renderSMEView = () => {
    if (currentView === 'UPLOAD') {
      return <SMEUpload onMint={handleMintInvoice} walletAddress={walletAddress || ''} exchangeRate={exchangeRate} notify={addNotification} />;
    }

    const myInvoices = walletAddress ? invoices.filter(inv => inv.smeAddress.toLowerCase() === walletAddress.toLowerCase()) : [];
    const totalRaised = myInvoices.reduce((acc, curr) => acc + curr.fundedAmount, 0);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!walletAddress && !isMockMode && (
           <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-xl text-center">
             <p className="text-blue-200">Please connect your wallet to view your dashboard and upload invoices.</p>
           </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gray-600 transition-colors">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-gray-400 text-sm font-medium">Total Liquidity Raised</h3>
                   <Wallet className="text-indigo-500 w-5 h-5" />
                 </div>
                 <p className="text-3xl font-bold text-white">${totalRaised.toLocaleString()}</p>
                 <p className="text-emerald-400 text-xs mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> Real-time</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gray-600 transition-colors">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-gray-400 text-sm font-medium">Active Invoices</h3>
                   <Activity className="text-blue-500 w-5 h-5" />
                 </div>
                 <p className="text-3xl font-bold text-white">{myInvoices.filter(i => i.status !== InvoiceStatus.REPAID).length}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gray-600 transition-colors">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-gray-400 text-sm font-medium">Wallet Balance</h3>
                   <AlertCircle className="text-orange-500 w-5 h-5" />
                 </div>
                 <p className="text-3xl font-bold text-white">${walletBalance.toLocaleString()}</p>
              </div>
           </div>
           
           {/* Activity Feed in SME Dashboard */}
           <div className="lg:col-span-1">
               {renderActivityFeed()}
           </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-6">Your Invoices</h2>
          {myInvoices.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-800 border-dashed">
              <p className="text-gray-400 mb-4">No invoices found.</p>
              {walletAddress ? (
                <button onClick={() => setCurrentView('UPLOAD')} className="text-indigo-400 hover:text-indigo-300 font-semibold">Upload your first invoice</button>
              ) : (
                <span className="text-gray-500">Connect wallet to see data.</span>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myInvoices.map(inv => (
                <InvoiceCard 
                    key={inv.id} 
                    invoice={inv} 
                    role={UserRole.SME} 
                    actionLabel="View Details"
                    onAction={handleRepay} // Pass Repay handler
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInvestorView = () => {
    let displayInvoices = currentView === 'MARKETPLACE' 
      ? invoices.filter(i => i.status === InvoiceStatus.FUNDING)
      : invoices.filter(i => investments.some(inv => inv.invoiceId === i.id));

    if (searchQuery) {
      displayInvoices = displayInvoices.filter(inv => 
        inv.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // --- Chart Data Preparation ---
    const repaidCount = investments.filter(inv => {
        const invDetails = invoices.find(i => i.id === inv.invoiceId);
        return invDetails?.status === InvoiceStatus.REPAID;
    }).length;

    // Bar Chart: Active vs Repaid count
    const barChartData = [
        { name: 'Active', yield: investments.length - repaidCount },
        { name: 'Repaid', yield: repaidCount },
    ];

    // Pie Chart: Allocation by Buyer
    const investmentsByBuyer = investments.reduce((acc, inv) => {
        const invDetails = invoices.find(i => i.id === inv.invoiceId);
        const name = invDetails ? invDetails.buyerName : 'Unknown';
        if (!acc[name]) acc[name] = 0;
        acc[name] += inv.amount;
        return acc;
    }, {} as Record<string, number>);

    // Pie colors palette
    const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    const pieChartData = Object.entries(investmentsByBuyer).map(([name, value], index) => ({
        name,
        value,
        color: PIE_COLORS[index % PIE_COLORS.length]
    })).sort((a, b) => b.value - a.value); // Sort largest first

    const totalStaked = investments.reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentView === 'DASHBOARD' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6">Portfolio Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    {/* Column 1: Bar Chart */}
                    <div className="flex flex-col h-full">
                         <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice Status</h4>
                         <div className="h-48 w-full flex-1">
                             <SimpleBarChart data={barChartData} />
                         </div>
                    </div>
                    
                    {/* Column 2: Pie Chart */}
                    <div className="flex flex-col h-full">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Capital Allocation</h4>
                        <div className="h-48 w-full flex-1">
                            {pieChartData.length > 0 ? (
                                <SimplePieChart data={pieChartData} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 border border-dashed border-gray-800 rounded-lg">
                                    <p className="text-xs">No investments found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Stats Cards & Activity */}
             <div className="space-y-6 flex flex-col">
                <div className="bg-gradient-to-br from-indigo-900 to-gray-900 p-6 rounded-xl border border-indigo-500/30 shadow-lg">
                    <p className="text-indigo-200 text-sm font-medium mb-1">Total Staked</p>
                    <p className="text-3xl font-bold text-white mb-4">${totalStaked.toLocaleString()}</p>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-indigo-400 h-full w-full"></div>
                    </div>
                </div>
                {/* Activity Feed in Investor Dashboard */}
                <div className="flex-1">
                    {renderActivityFeed()}
                </div>
             </div>
           </div>
        )}

        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-white">
              {currentView === 'MARKETPLACE' ? 'Live Invoice Opportunities' : 'Your Portfolio'}
            </h2>
            {currentView === 'MARKETPLACE' ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by buyer or ID..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 bg-gray-800 border border-gray-700 text-sm text-white rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500 transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 whitespace-nowrap">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span>1 EUR = {exchangeRate.toFixed(4)} USD</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleExportCSV}
                disabled={investments.length === 0}
                className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayInvoices.map(inv => (
              <InvoiceCard 
                key={inv.id} 
                invoice={inv} 
                role={UserRole.INVESTOR}
                onAction={handleOpenInvestModal}
                actionLabel="Fund Now"
              />
            ))}
            {displayInvoices.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 bg-gray-800/30 rounded-xl border border-gray-800 border-dashed">
                {searchQuery 
                  ? 'No invoices match your search query.' 
                  : (currentView === 'MARKETPLACE' 
                      ? (invoices.length === 0 ? 'Marketplace is empty. Be the first SME to upload!' : 'No active invoices available.') 
                      : 'You haven\'t invested yet.')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Layout
      userRole={userRole}
      currentView={currentView}
      setView={setCurrentView}
      walletAddress={walletAddress}
      onConnect={handleConnectWallet}
      onDisconnect={handleDisconnect}
      onSwitchRole={(role) => {
        setUserRole(role);
        setCurrentView(role === UserRole.SME ? 'DASHBOARD' : 'MARKETPLACE');
      }}
      isMockMode={isMockMode}
      toggleMockMode={() => setIsMockMode(!isMockMode)}
      onStartTour={() => setIsTourOpen(true)}
      notifications={notifications}
      removeNotification={removeNotification}
    >
      {userRole === UserRole.SME ? renderSMEView() : renderInvestorView()}

      {selectedInvoice && (
        <InvestModal
          invoice={selectedInvoice}
          isOpen={isInvestModalOpen}
          onClose={() => setIsInvestModalOpen(false)}
          onConfirm={handleInvest}
          userBalance={walletBalance}
        />
      )}
      
      <Tour 
        isOpen={isTourOpen} 
        onClose={() => setIsTourOpen(false)} 
        onStartDemo={() => {
            setIsMockMode(true);
            setIsTourOpen(false);
        }}
      />
    </Layout>
  );
};

export default App;