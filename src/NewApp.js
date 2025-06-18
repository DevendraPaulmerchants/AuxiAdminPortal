import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { DataProvider } from './Components/Context/Context';

import NewLogIn from './Components/LogIn/NewLogIn';
import NewHome from './Components/Home/NewHome';
import Loader from './Components/Loader/Loader';

// Lazy-loaded components
const Layout = lazy(() => import('./Components/Layout/Layout'));
const MerchantsList = lazy(() => import('./Components/MerchantManagement/MerchantsList'));
const MerchantDetails = lazy(() => import('./Components/MerchantManagement/MerchantDetails'));
const PendingMerchants = lazy(() => import('./Components/MerchantManagement/PendingMerchants'));
const PendingMerchantDetails = lazy(() => import('./Components/MerchantManagement/PendingMerchantDetails'));
const CustomerList = lazy(() => import('./Components/MerchantManagement/CustomerList'));
const Credits = lazy(() => import('./Components/MerchantManagement/Credits'));
const CreditDetails = lazy(() => import('./Components/MerchantManagement/CreditDetails'));
const APIKey = lazy(() => import('./Components/MerchantManagement/APIKey'));
const Approval = lazy(() => import('./Components/MerchantManagement/Approval'));

const Users = lazy(() => import('./Components/UserManagement/Users'));

const GoldTransaction = lazy(() => import('./Components/Transactions/GoldTransaction'));
const SilverTransaction = lazy(() => import('./Components/Transactions/SilverTransaction'));
const CreditTransaction = lazy(() => import('./Components/Transactions/CreditTransaction'));

const Metal = lazy(() => import('./Components/Metal_Inventory/Metal'));
const MetalLogs = lazy(() => import('./Components/Metal_Inventory/Metal_Logs'));

const Bank = lazy(() => import('./Components/BankManagement/Bank'));
const UPI = lazy(() => import('./Components/BankManagement/UPI'));

const Exchange = lazy(() => import('./Components/RateManagement/Exchange'));
const AuxiRate = lazy(() => import('./Components/RateManagement/AuxiRate'));

const Global = lazy(() => import('./Components/MarginManagement/Global'));
const MerchantMargin = lazy(() => import('./Components/MarginManagement/Merchant'));

const Permission = lazy(() => import('./Components/AccessManagement/Permission'));
const Role = lazy(() => import('./Components/AccessManagement/Role'));

const ReportsDetails = lazy(() => import('./Components/Reports/ReportsDetails'));
const MerchantsTDSReports = lazy(() => import('./Components/Reports/MerchantTDSReports'));
const CustomerReports = lazy(() => import('./Components/Reports/CustomerReports'));
const CreditsReports =lazy(()=>import('./Components/Reports/CreditsReports'));

const AutoRefreshList = lazy(() => import('./Components/AutoRefresh/AutoRefresh'));

const Support = lazy(() => import('./Components/SupportManagement/Support'));
const SupportDetails = lazy(() => import('./Components/SupportManagement/SupportDetails'));


function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setIsAuthenticated(!!storedToken);
  }, []);

  const handleLogIn = () => setIsAuthenticated(true);
  const handleLogOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="App">
      <DataProvider>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              {!isAuthenticated ? (
                <Route path="*" element={<NewLogIn handleLogIn={handleLogIn} />} />
              ) : (
                <Route element={<Layout handleLogOut={handleLogOut} />}>
                  <Route path="/" element={<NewHome />} />
                  {/* Merchant Services */}
                  <Route path="/approved-merchants" element={<MerchantsList />} />
                  <Route path="/approved-merchants/:merchantId" element={<MerchantDetails />} />
                  <Route path="/pending_merchants" element={<PendingMerchants />} />
                  <Route path="/pending_merchants/:Id" element={<PendingMerchantDetails />} />
                  <Route path='/customer_list' element={<CustomerList />} />
                  <Route path='/approved_credits' element={<Credits />} />
                  <Route path='/requested_credits' element={<Approval />} />
                  <Route path='/credit/:id' element={<CreditDetails />} />
                  <Route path='/merchant_api' element={<APIKey />} />
                  {/* Users */}
                  <Route path='/user_list' element={<Users />} />
                  {/* Transactions */}
                  <Route path='/gold_transactions' element={<GoldTransaction />} />
                  <Route path='/silver_transactions' element={<SilverTransaction />} />
                  <Route path='/credits_transactions' element={<CreditTransaction />} />
                  {/* Metal Vault and Metals-log */}
                  <Route path='/metal' element={<Metal />} />
                  <Route path='/metal_logs' element={<MetalLogs />} />
                  {/* Beneficiary Accounts */}
                  <Route path='/bank_list' element={<Bank />} />
                  <Route path='/upi_list' element={<UPI />} />
                  {/* Exchange Rate */}
                  <Route path='/exchange' element={<Exchange />} />
                  <Route path='/applied_margin' element={<Global />} />
                  <Route path='/auxi_rates' element={<AuxiRate />} />
                  {/* Margin and Scheme */}
                  <Route path='/scheme_list' element={<MerchantMargin />} />
                  {/* Role and Permissions */}
                  <Route path='/permissions_list' element={<Permission />} />
                  <Route path='/departments_list' element={<Role />} />
                  {/* Reports */}
                  <Route path="/customer-reports" element={<CustomerReports />} />
                  <Route path='/credits-report' element={<CreditsReports />} />
                  <Route path="/customer-reports/details" element={<ReportsDetails />} />
                  <Route path="/merchant-tds-reports" element={<MerchantsTDSReports />} />
                  {/*Environment SetUp  */}
                  <Route path='/refresh_rate' element={<AutoRefreshList />} />
                  {/* Raised Ticket */}
                  <Route path='/raised_tickets' element={<Support />} />
                  <Route path='/support/:id' element={<SupportDetails />} />
                  <Route path="*" element={<Navigate replace to="/" />} />
                </Route>
              )}
            </Routes>
          </Suspense>
        </Router>
      </DataProvider>
    </div>
  );
}

export default App;


