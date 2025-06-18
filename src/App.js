import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useReducer, useState } from 'react';
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
import MerchantsReports from './Components/Reports/MerchantsReports';
import CustomerReports from './Components/Reports/CustomerReports';
import CreditsReports from './Components/Reports/CreditsReports';
import MerchantsTDSReports from './Components/Reports/MerchantTDSReports';
import ReportsDetails from './Components/Reports/ReportsDetails';
import Layout from './Components/Layout/Layout';

const initialState = {
  open: true,
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        open: !state.open
      };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
    }
    else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleOpen = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
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
          <div className="app_layout">
            {isAuthenticated && <SideBar open={state.open} handleLogOut={handleLogOut} />}
            <div className='app_content'>
              {isAuthenticated && <NewHeader open={state.open} handleOpen={handleOpen} handleLogOut={handleLogOut} />}
              <Routes>
                {!isAuthenticated ? (
                  <>
                    <Route path="*" element={<NewLogIn handleLogIn={handleLogIn} />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<NewHome />} />
                    <Route path="/login" element={<Navigate to="/" />} />

                    <Route path="/approved-merchants" element={<MerchantsList />} />
                    <Route path="/approved-merchants/:merchantId" element={<MerchantDetails />} />
                    <Route path='/pending_merchants' element={<PendingMerchants />} />
                    <Route path='/pending_merchants/:Id' element={<PendingMerchantDetails />} />

                    <Route path='/customer_list' element={<CustomerList />} />
                    <Route path='/approved_credits' element={<Credits />} />
                    <Route path='/requested_credits' element={<Approval />} />
                    <Route path='/credit/:id' element={<CreditDetails />} />
                    <Route path='/merchant_api' element={<APIKey />} />

                    <Route path='/transaction' element={<Transaction />} />
                    <Route path='/gold_transactions' element={<GoldTransaction />} />
                    <Route path='/silver_transactions' element={<SilverTransaction />} />
                    <Route path='/credits_transactions' element={<CreditTransaction />} />

                    <Route path='/credits-report' element={<CreditsReports />} />
                    <Route path='/merchant-tds-reports' element={<MerchantsTDSReports />} />
                    <Route path='/merchant-reports' element={< MerchantsReports />} />
                    <Route path='/customer-reports' element={<CustomerReports />} />
                    <Route path='/customer-reports/details' element={<ReportsDetails />} />

                    <Route path='/permissions_list' element={<Permission />} />
                    <Route path='/departments_list' element={<Role />} />

                    <Route path='/user_list' element={<Users />} />

                    <Route path='/bank_list' element={<Bank />} />
                    <Route path='/upi_list' element={<UPI />} />

                    <Route path='/global_scheme' element={<Global />} />
                    <Route path='/scheme_list' element={<MerchantMargin />} />

                    <Route path='/exchange' element={<Exchange />} />
                    <Route path='/auxi_rates' element={<AuxiRate />} />

                    <Route path='/metal' element={<Metal />} />
                    <Route path='/metal_logs' element={<MetalLogs />} />

                    <Route path='/refresh_rate' element={<AutoRefreshList />} />

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
