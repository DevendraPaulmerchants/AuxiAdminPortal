import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./LeftSidebar.css";
import style from './NewLeftSidebar.module.css';
import { RxDashboard } from "react-icons/rx";
import { FiCheckCircle, FiChevronDown, FiChevronRight, FiUsers } from 'react-icons/fi';
import { HiOutlineBuildingOffice, HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi2";
import { BiUndo } from "react-icons/bi";
import { BiTransferAlt } from "react-icons/bi";
import { PiSealPercent } from 'react-icons/pi';
import { MdListAlt, MdLogout, MdOutlineAccountBalanceWallet, MdOutlineCreditScore, MdOutlineLockPerson, MdOutlineSettingsSystemDaydream, MdPayment } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import { BsQuestionCircle } from 'react-icons/bs';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { VscKey } from 'react-icons/vsc';
import { RiPercentLine, RiShieldUserLine, RiUserSearchLine } from 'react-icons/ri';
import { FaBalanceScale, FaMoneyBillWave, FaRegCreditCard } from 'react-icons/fa';
import { GiGoldBar, GiMetalBar, GiSilverBullet } from 'react-icons/gi';
import { TbCurrencyDollar, TbCurrencyDollarOff, TbFileDollar, TbReportMoney, TbUserSearch } from 'react-icons/tb';
// import useLogInStore from '../../store/loginStore';

const sidebarItems = [
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
                name: "Applied Margin", path: "/applied_margin", icon: <RiPercentLine title='Applied Margin' />
            },

            {
                name: "Auxi Rates", path: '/auxi_rates', icon: <TbCurrencyDollar title='Auxi Rates' />,
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
    { name: "Users", path: '/user_list', icon: <HiOutlineUsers title='Portal Users' /> },
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

const SideBar = ({ open, handleLogOut }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const location = useLocation();

    useEffect(() => {
        sidebarItems.forEach((navItem) => {
            if (navItem.subItems?.some(sub => sub.path === location.pathname)) {
                setOpenDropdown(navItem.name);
            }
        });
    }, [location.pathname]);

    const handleDropdownClick = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };


    return (
        <div className={open ? style.sidebar_container : style.sidebar_container_collapsed}>
            <div className={style.logo_container}>
                <div className={style.logo_image_container}>
                    <img src="/SIdebar_logo.png" alt="Logo" className={style.logo} />
                </div>
            </div>
            <div className={style.sidebar_menu_container}>
                <h2>MENU</h2>
            </div>
            <div className={style.sidebar_items}>
                {sidebarItems?.slice(0, sidebarItems.length - 2).map((item, i) => (
                    <div className={`${style.sidebar_item_container} ${openDropdown === item.name ? style.horizontal_line : ''}`} key={i}>
                        {item.path === '--' ? (
                            <div className={`${style.sidebar_item_parent}`} onClick={() => handleDropdownClick(item.name)}>
                                <div className={style.sidebar_item}>
                                    <span className={style.sidebar_icon}>{item.icon}</span>
                                    <span className={open ? style.sidebar_item_name : style.sidebar_item_name_collapsed}>{item.name}</span>
                                </div>
                                <p>{openDropdown === item.name ? <FiChevronDown /> : <FiChevronRight />}</p>
                            </div>
                        ) : (
                            <NavLink
                                className={`${style.sidebar_item}`}
                                to={item.path}
                            >
                                <span className={style.sidebar_icon}>{item.icon}</span>
                                <span className={open ? style.sidebar_item_name : style.sidebar_item_name_collapsed}>{item.name}</span>
                            </NavLink>

                        )}
                        {item.subItems && openDropdown === item.name && (
                            <div
                                className={style.sub_items_container}
                            >
                                {item.subItems.map((subItem, subIndex) => (
                                    <NavLink className={style.sub_item} to={subItem.path} key={subIndex}>
                                        <span className={style.sidebar_icon}>{subItem.icon}</span>
                                        <span className={open ? style.sidebar_item_name : style.sidebar_item_name_collapsed}>{subItem.name}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={style.sidebar_menu_container}>
                <h2>GENERAL</h2>
            </div>
            <div className={style.sidebar_items}>
                {sidebarItems?.slice(sidebarItems.length - 2, sidebarItems.length).map((item, i) => (
                    <div className={`${style.sidebar_item_container} ${openDropdown === item.name ? style.horizontal_line : ''}`} key={i}>
                        {item.path === '--' ? (
                            <div className={`${style.sidebar_item_parent}`} onClick={() => handleDropdownClick(item.name)}>
                                <div className={style.sidebar_item}>
                                    <span className={style.sidebar_icon}>{item.icon}</span>
                                    <span className={open ? style.sidebar_item_name : style.sidebar_item_name_collapsed}>{item.name}</span>
                                </div>
                                <p>{openDropdown === item.name ? <FiChevronDown /> : <FiChevronRight />}</p>
                            </div>
                        ) : (
                            <NavLink
                                className={`${style.sidebar_item}`}
                                to={item.path}
                            >
                                <span className={style.sidebar_icon}>{item.icon}</span>
                                <span className={open ? style.sidebar_item_name : style.sidebar_item_name_collapsed}>{item.name}</span>
                            </NavLink>

                        )}
                        {item.subItems && openDropdown === item.name && (
                            <div className={style.sub_items_container}>
                                {item.subItems.map((subItem, subIndex) => (
                                    <NavLink className={style.sub_item} to={subItem.path} key={subIndex}>
                                        <span className={open ? style.sidebar_item_name : style.sidebar_item_name_collapsed}>{subItem.name}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* ---------------------- Log Out Button ------------------------ */}
            <div className={style.sidebar_logout_btn_container}>
                {!open ? <button className={style.sidebar_logout_btn_icon_only}
                    onClick={handleLogOut}
                ><MdLogout /></button> :
                    <button className={style.sidebar_logout_btn}
                        onClick={handleLogOut}
                    >
                        <span className={style.sidebar_logout_btn_icon}><MdLogout /></span>
                        <span className={style.sidebar_logout_btn_text}>Logout</span>
                    </button>
                }
            </div>
        </div>
    );
}
export default SideBar;