import React from 'react';
import { LayoutDashboard, Wallet, PieChart, ShieldCheck, LogOut, Menu, X, HelpCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { UserRole, ViewState, Notification } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onSwitchRole: (role: UserRole) => void;
  isMockMode: boolean;
  toggleMockMode: () => void;
  onStartTour: () => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  userRole,
  currentView,
  setView,
  walletAddress,
  onConnect,
  onDisconnect,
  onSwitchRole,
  isMockMode,
  toggleMockMode,
  onStartTour,
  notifications,
  removeNotification
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => { setView(view); setIsMobileMenuOpen(false); }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        currentView === view
          ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-900/20 translate-x-1'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:translate-x-1'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${currentView === view ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex font-sans relative overflow-hidden">
      {/* Premium Background Gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-gray-900 to-gray-950 z-0"></div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-950/95 backdrop-blur-xl border-r border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
                <span className="font-black text-white text-lg">IX</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">InvoiceX</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-4 pt-2">
              {userRole === UserRole.SME ? 'SME Workspace' : 'Investor Portal'}
            </div>
            
            {userRole === UserRole.SME ? (
              <>
                <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Overview" />
                <NavItem view="UPLOAD" icon={Wallet} label="New Invoice" />
              </>
            ) : (
              <>
                <NavItem view="MARKETPLACE" icon={PieChart} label="Marketplace" />
                <NavItem view="DASHBOARD" icon={ShieldCheck} label="Portfolio" />
              </>
            )}

            <div className="mt-8">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">
                 App Settings
               </div>
               
               {/* Demo Mode Toggle */}
               <div className="px-4 mb-3">
                 <div className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${isMockMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-gray-900/50 border-gray-800'}`}>
                    <div className="flex flex-col">
                       <span className={`text-xs font-bold ${isMockMode ? 'text-indigo-400' : 'text-gray-400'}`}>Demo Mode</span>
                       <span className="text-[10px] text-gray-500">{isMockMode ? 'Using Mock Data' : 'Using Local Storage'}</span>
                    </div>
                    <button 
                      onClick={toggleMockMode}
                      className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none ${isMockMode ? 'bg-indigo-500' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${isMockMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                 </div>
               </div>

               <button 
                 onClick={onStartTour}
                 className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors group"
               >
                 <HelpCircle className="w-4 h-4 mr-3 text-gray-500 group-hover:text-white" />
                 Show Tour
               </button>
            </div>
          </div>

          <div className="p-4 border-t border-gray-800/50 bg-gray-900/30">
            <div className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-800">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Switch Role</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => onSwitchRole(UserRole.SME)}
                  className={`flex-1 text-xs py-1.5 rounded font-medium transition-colors ${userRole === UserRole.SME ? 'bg-indigo-600 text-white shadow' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  SME
                </button>
                <button 
                  onClick={() => onSwitchRole(UserRole.INVESTOR)}
                  className={`flex-1 text-xs py-1.5 rounded font-medium transition-colors ${userRole === UserRole.INVESTOR ? 'bg-indigo-600 text-white shadow' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  Investor
                </button>
              </div>
            </div>

            {walletAddress ? (
              <div className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-300 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex flex-col">
                   <span className="text-[10px] text-gray-500 uppercase font-bold">Connected</span>
                   <span className="truncate w-24 font-mono text-xs text-emerald-400">{walletAddress}</span>
                </div>
                <button onClick={onDisconnect} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 active:translate-y-0.5"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative z-10">
        <header className="h-16 bg-gray-900/90 backdrop-blur border-b border-gray-800 flex items-center justify-between px-6 lg:hidden sticky top-0 z-40">
          <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">IX</span>
              </div>
              <span className="text-xl font-bold text-white">InvoiceX</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto relative">
          {/* Demo Mode Indicator Banner */}
          {isMockMode && (
             <div className="absolute top-0 left-0 right-0 bg-indigo-900/90 backdrop-blur-sm text-indigo-200 text-xs font-bold text-center py-2 border-b border-indigo-500/20 shadow-lg z-30">
               DEMO MODE ACTIVE • Transactions are simulated locally.
             </div>
          )}
          <div className={`max-w-7xl mx-auto transition-all duration-300 ${isMockMode ? 'mt-8' : ''}`}>
            {children}
          </div>
        </main>

        {/* Toast Notifications Container */}
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
          {notifications.map(n => (
            <div key={n.id} className={`pointer-events-auto flex items-start w-80 p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-full duration-300 ${
              n.type === 'success' ? 'bg-gray-900/90 border-emerald-500/50 text-white' :
              n.type === 'error' ? 'bg-gray-900/90 border-red-500/50 text-white' :
              'bg-gray-900/90 border-blue-500/50 text-white'
            }`}>
              {n.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />}
              {n.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />}
              {n.type === 'info' && <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />}
              <div className="flex-1 mr-2">
                <p className="text-sm font-medium leading-tight">{n.message}</p>
              </div>
              <button onClick={() => removeNotification(n.id)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};