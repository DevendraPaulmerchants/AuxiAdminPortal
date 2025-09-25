import { BiTransferAlt } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
import { FaBalanceScale } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { GiGoldBar, GiMetalBar, GiSilverBullet } from "react-icons/gi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { HiOutlineBuildingOffice, HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAccountBalanceWallet, MdOutlineCreditScore, MdOutlineLockPerson, MdOutlineSettingsSystemDaydream, MdPayment } from "react-icons/md";
import { PiSealPercent } from "react-icons/pi";
import { RiPercentLine, RiShieldUserLine, RiUserSearchLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbCurrencyDollar, TbCurrencyDollarOff, TbFileDollar, TbReportMoney, TbUserSearch } from "react-icons/tb";
import { VscKey } from "react-icons/vsc";

 export const sidebarItems = [
    { name: "Dashboard", path: '/', icon: <RxDashboard title='Dashboard' /> },
    {
        name: "Merchant Management", path: '--', icon: <HiOutlineBuildingOffice title='Merchant Management' />,
        subItems: [
            { name: "Approved Merchant List", path: '/approved-merchants', icon: <HiOutlineUserGroup title="Approved Merchant List" /> },
            { name: "Pending Merchant List", path: '/pending_merchants', icon: <RiUserSearchLine title="Pending Merchant List" /> },
            { name: "Merchant`s Credit", path: '/approved_credits', icon: <MdOutlineAccountBalanceWallet title="Merchant`s Credit" /> },
            { name: "Pending Credit Request", path: '/requested_credits', icon: <TbCurrencyDollarOff title="Pending Credit Request" /> },
            { name: "Customers", path: "/customer_list", icon: <FiUsers title='Customer List' /> },
            { name: "API Key", path: '/merchant_api', icon: <VscKey title="API Key" /> },
        ]
    },
    {
        name: "Transactions", path: '--', icon: <BiTransferAlt title='Transactions' />,
        subItems: [
            { name: "Gold Transactions", path: '/gold_transactions', icon: <GiGoldBar title="Gold Transactions List" /> },
            { name: "Silver Transactions", path: '/silver_transactions', icon: <GiSilverBullet title="Silver Transactions List" /> },
            { name: "Credits Transactions", path: '/credits_transactions', icon: <MdOutlineCreditScore title="Credits Transactions List" /> },
        ]
    },
    {
        name: "Metal Inventory",
        path: '--',
        icon: <GiMetalBar title='Metal Inventory' />,
        subItems: [
            { name: "Metal", path: "/metal", icon: <GiMetalBar title='Metal Vault List' /> },
            // { name: "Metal logs", path: "/metal_logs", icon: <MdInventory2 title='Metals log List' /> }
        ]
    },
    // {
    //     name: "Beneficiary Accounts", path: '--', icon: <BiSolidBank title='Accounts' />,
    //     subItems: [
    //         { name: "Bank", path: "/bank_list", icon: <FaRegCreditCard title='Bank List' /> },
    //         { name: "UPI", path: "/upi_list", icon: <MdPayment title='UPI List' /> }
    //     ]
    // },
    {
        name: "Exchange & Rates", path: '--', icon: <MdOutlineAccountBalanceWallet title='Exchange & Rates' />,
        subItems: [
            {
                name: "Exchange", path: '/exchange', icon: <MdOutlineAccountBalanceWallet title='Exchange Rate' />,
            },
            {
                name: "Apply Margin & GST", path: "/applied_margin", icon: <RiPercentLine title='Apply Margin & GST' />
            },

            {
                name: "Final Metal Rates", path: '/auxi_rates', icon: <TbCurrencyDollar title='Final Metal Rates' />,
            },
        ]
    },
    {
        name: "Margins/Scheme", path: '--', icon: <PiSealPercent title='Margins/Scheme' />,
        subItems: [
            { name: "Schemes", path: "/scheme_list", icon: <FaBalanceScale title='Scheme List' /> }
        ]
    },
    {
        name: "Roles & Permission", path: '--', icon: <MdOutlineLockPerson title='Role and Permission' />,
        subItems: [
            { name: "Departments", path: '/departments_list', icon: <HiOutlineBuildingOffice title="Departments List" /> },
            { name: "Permissions", path: '/permissions_list', icon: <RiShieldUserLine title="Permissions List" /> },

        ]
    },
    {
        name: "Reports", path: '--', icon: <HiOutlineDocumentReport title='Reports' />,
        subItems: [
            { name: " Merchants TDS Reports", path: '/merchant-tds-reports', icon: <TbFileDollar title='Merchant TDS Report' /> },
            { name: "Customer Reports", path: '/customer-reports', icon: <TbUserSearch title='Customer Report' /> },
            { name: "Credits Report", path: '/credits-report', icon: <TbReportMoney title='Credits Report' /> },
        ]
    },
    { name: "Portal Users", path: '/user_list', icon: <HiOutlineUsers title='Portal Users' /> },
    // {
    //     name: "Env Setup",
    //     path: "/refresh_rate",
    //     icon: <MdOutlineSettingsSystemDaydream title='Environment Setting' />,
    // },
    {
        name: "Settings", path: '--', icon: <IoSettingsOutline title='Settings' />,
        subItems: [
            { name: "Env Setup", path: "/refresh_rate", icon: <MdOutlineSettingsSystemDaydream title='Environment Setting' /> },
            { name: "Bank Accounts", path: "/bank_list", icon: <FaRegCreditCard title='Added Bank' /> },
            { name: "UPI Accounts", path: "/upi_list", icon: <MdPayment title='Added UPI' /> }
        ]
    },
    { name: "Raised Ticket", path: '/raised_tickets', icon: <BsQuestionCircle title='Raised Ticket' /> },
]; 