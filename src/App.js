import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Components/Home/Home';
import Header from './Components/Header/Header';
import LeftSidebar from './Components/LeftSidebar/LeftSidebar';
import LogIn from './Components/LogIn/LogIn';
import { DataProvider } from './Components/Context/Context';
import MerchantsList from './Components/MerchantManagement/MerchantsList';
import MerchantDetails from './Components/MerchantManagement/MerchantDetails';
import CustomerList from './Components/MerchantManagement/CustomerList';
import Credits from './Components/MerchantManagement/Credits';
import APIKey from './Components/MerchantManagement/APIKey';
import GoldTransaction from './Components/Transactions/GoldTransaction';
import SilverTransaction from './Components/Transactions/SilverTransaction';
import CreditTransaction from './Components/Transactions/CreditTransaction';
import Approval from './Components/MerchantManagement/Approval';
import Transaction from './Components/Transactions/Transaction';
import Permission from './Components/AccessManagement/Permission';
import Role from './Components/AccessManagement/Role';
import Users from './Components/UserManagement/Users';
import Bank from './Components/BankManagement/Bank';
import UPI from './Components/BankManagement/UPI';
import Global from './Components/MarginManagement/Global';
import MerchantMargin from './Components/MarginManagement/Merchant';
import CreditDetails from './Components/MerchantManagement/CreditDetails';
import Exchange from './Components/RateManagement/Exchange';
import AuxiRate from './Components/RateManagement/AuxiRate';
import Support from './Components/SupportManagement/Support';
import SupportDetails from './Components/SupportManagement/SupportDetails';
import Metal from './Components/Metal_Inventory/Metal';
import PendingMerchants from './Components/MerchantManagement/PendingMerchants';
import PendingMerchantDetails from './Components/MerchantManagement/PendingMerchantDetails';
import AutoRefreshList from './Components/AutoRefresh/AutoRefresh';
import NewHome from './Components/Home/NewHome';
import MetalLogs from './Components/Metal_Inventory/Metal_Logs';
import SideBar from './Components/LeftSidebar/NewLeftSidebar';
import NewHeader from './Components/Header/NewHeader';
import NewLogIn from './Components/LogIn/NewLogIn';
import TDSReports from './Components/Reports/MerchantTDSReports';
import MerchantsReports from './Components/Reports/MerchantsReports';
import CustomerReports from './Components/Reports/CustomerReports';
import CreditsReports from './Components/Reports/CreditsReports';
import MerchantsTDSReports from './Components/Reports/MerchantTDSReports';
import ReportsDetails from './Components/Reports/ReportsDetails';

function App() {
  const [open, setOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);//

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
      // console.log("token",storedToken)
    }
    else {
      setIsAuthenticated(false);
    }

  }, []);

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleLogIn = () => {
    setIsAuthenticated(true);
  }
  const handleLogOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token")
  }

  return (
    <div className="App">
      <DataProvider>
        <Router>
          {/* {isAuthenticated && <Header open={open} handleOpen={handleOpen} handleLogOut={handleLogOut} />} */}
          <div className="app_layout">
            {/* {isAuthenticated && <LeftSidebar open={open} />} */}
            {isAuthenticated && <SideBar open={open} handleLogOut={handleLogOut} />}
            <div className='app_content'>
              {isAuthenticated && <NewHeader open={open} handleOpen={handleOpen} handleLogOut={handleLogOut} />}
              <Routes>
                {!isAuthenticated ? (
                  <>
                    <Route path="*" element={<NewLogIn handleLogIn={handleLogIn} />} />
                  </>
                ) : (
                  <>
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/" element={<NewHome />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                    {/* ------------------------- Merchants Services-------------------------------- */}
                    <Route path="/approved-merchants" element={<MerchantsList />} />
                    <Route path="/approved-merchants/:merchantId" element={<MerchantDetails />} />
                    <Route path='/pending_merchants' element={<PendingMerchants />} />
                    <Route path='/pending_merchants/:Id' element={<PendingMerchantDetails />} />

                    <Route path='/customer_list' element={<CustomerList />} />
                    <Route path='/approved_credits' element={<Credits />} />
                    <Route path='/requested_credits' element={<Approval />} />
                    <Route path='/credit/:id' element={<CreditDetails />} />
                    <Route path='/merchant_api' element={<APIKey />} />
                    {/* ------------------------- Transactions ---------------------------- */}
                    <Route path='/transaction' element={<Transaction />} />
                    <Route path='/gold_transactions' element={<GoldTransaction />} />
                    <Route path='/silver_transactions' element={<SilverTransaction />} />
                    <Route path='/credits_transactions' element={<CreditTransaction />} />
                    {/* --------------- Reports --------------------------  */}
                    <Route path='/credits-report' element={<CreditsReports />} />
                    <Route path='/merchant-tds-reports' element={<MerchantsTDSReports />} />
                    <Route path='/merchant-reports' element={< MerchantsReports />} />
                    <Route path='/customer-reports' element={<CustomerReports />} />
                    <Route path='/customer-reports/details' element={<ReportsDetails />} />
                    {/* ---------------------------- Merchant Management ------------------------ */}
                    {/* ----------------------------Access Management ------------------------ */}
                    <Route path='/permissions_list' element={<Permission />} />
                    <Route path='/departments_list' element={<Role />} />
                    {/* ---------------------------User Management ------------------------- */}
                    <Route path='/user_list' element={<Users />} />
                    {/* -------------------- Bank management ------------------------- */}
                    <Route path='/bank_list' element={<Bank />} />
                    <Route path='/upi_list' element={<UPI />} />
                    {/* ------------------------- Margin Management ----------------- */}
                    {/* <Route path='/margin' element={<Global />}> */}
                    <Route path='/global_scheme' element={<Global />} />
                    <Route path='/scheme_list' element={<MerchantMargin />} />
                    {/* ---------------------Rate Management ------------ */}
                    <Route path='/exchange' element={<Exchange />} />
                    <Route path='/auxi_rates' element={<AuxiRate />} />
                    {/* ---------- Metal Inventory --------------- */}
                    <Route path='/metal' element={<Metal />} />
                    <Route path='/metal_logs' element={<MetalLogs />} />
                    {/* ----------- Refreh Rate--------- */}
                    <Route path='/refresh_rate' element={<AutoRefreshList />} />
                    {/* -------------- Support Management ----------------- */}
                    <Route path='/raised_tickets' element={<Support />} />
                    <Route path='/support/:id' element={<SupportDetails />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                  </>
                )}
              </Routes>
            </div>
          </div>
        </Router>
      </DataProvider>
    </div>
  );
}

export default App;
