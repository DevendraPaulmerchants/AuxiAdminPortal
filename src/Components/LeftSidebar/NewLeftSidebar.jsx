import { NavLink, useLocation } from 'react-router-dom';
// import useSidebarCollapseStore from '../../store/sidebarCollapse';
import style from './NewLeftSidebar.module.css';
import { RxDashboard } from "react-icons/rx";
import "./LeftSidebar.css";
import { FiCheckCircle, FiChevronDown, FiChevronRight, FiUserCheck } from 'react-icons/fi';
import { HiOutlineBuildingOffice, HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi2";
import { BiSolidBank, BiSolidUserDetail, BiUndo } from "react-icons/bi";
import { BiTransferAlt } from "react-icons/bi";


import { useEffect, useState } from 'react';
import { PiSealPercent } from 'react-icons/pi';
import { MdInventory2, MdListAlt, MdLogout, MdOutlineAccountBalanceWallet, MdOutlineLockPerson, MdOutlineSettingsSystemDaydream, MdPayment } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import { BsQuestionCircle, BsShieldCheck } from 'react-icons/bs';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { FaCheckDouble } from 'react-icons/fa6';
import { VscKey } from 'react-icons/vsc';
import { RiShieldUserLine } from 'react-icons/ri';
import { FaBalanceScale, FaMoneyBillWave, FaRegCreditCard } from 'react-icons/fa';
import { GiMetalBar } from 'react-icons/gi';
// import useLogInStore from '../../store/loginStore';

const sidebarItems = [
    { name: "Dashboard", path: '/', icon: <RxDashboard /> },
    {
        name: "Merchant Services", path: '--', icon: <BiSolidUserDetail title='Merchant Management' />,
        subItems: [
            { name: "Approved Merchant List", path: '/approved-merchants', icon: <HiOutlineUserGroup title="Merchant List" /> },
            { name: "Pending Merchant List", path: '/pending_merchants', icon: <BsShieldCheck title="KYC Approval" /> },
            { name: "Merchant`s Credit", path: '/approved_credits', icon: <MdOutlineAccountBalanceWallet title="Credit" /> },
            { name: "Pending Credit Request", path: '/requested_credits', icon: <FaCheckDouble title="Credit Approval" /> },
            { name: "Customers", path: "/customer_list", icon: <FiUserCheck /> },
            { name: "API Key", path: '/merchant_api', icon: <VscKey title="API Key" /> },
        ]
    },
    { name: "Users", path: '/user_list', icon: <HiOutlineUsers title='Users List' /> },
    {
        name: "Transactions", path: '--', icon: <BiTransferAlt title='Transactions' />,
        subItems: [
            { name: "Gold Transactions", path: '/gold_transactions', icon: <MdListAlt title="Gold Transactions" /> },
            { name: "Silver Transactions", path: '/silver_transactions', icon: <FiCheckCircle title="Silver Transactions" /> },
            { name: "Credits Transactions", path: '/credits_transactions', icon: <BiUndo title="Credits Transactions" /> },
            // { name: "Transaction Report", path: '/transaction_report', icon: <HiOutlineDocumentReport title="Transaction Report" /> },
        ]
    },
    {
        name: "Metal Inventory",
        path: '--',
        icon: <GiMetalBar />,
        subItems: [
            { name: "Metal", path: "/metal", icon: <GiMetalBar title='Metal Details List' /> },
            { name: "Metal logs", path: "/metal_logs", icon: <MdInventory2 title='Metals log List' /> }
        ]
    },
    {
        name: "Beneficiary Accounts", path: '--', icon: <BiSolidBank title='Accounts' />,
        subItems: [
            { name: "Bank", path: "/bank_list", icon: <FaRegCreditCard title='Bank List' /> },
            { name: "UPI", path: "/upi_list", icon: <MdPayment title='UPI List' /> }
        ]
    },
    {
        name: "Margins", path: '--', icon: <PiSealPercent title='Margins' />,
        subItems: [
            { name: "Global", path: "/global_scheme", icon: <FaMoneyBillWave title='Global Margin List' /> },
            { name: "Schemes", path: "/scheme_list", icon: <FaBalanceScale title='Scheme List' /> }
        ]
    },
    {
        name: "Roles & Permission", path: '--', icon: <MdOutlineLockPerson title='Role and Permission' />,
        subItems: [
            { name: "Departments", path: '/departments_list', icon: <HiOutlineBuildingOffice title="Departments" /> },
            { name: "Permissions", path: '/permissions_list', icon: <RiShieldUserLine title="Permissions" /> },

        ]
    },
    {
        name: "Env Setup",
        path: "/refresh_rate",
        icon: <MdOutlineSettingsSystemDaydream title='Environment Setting' />,
    },
    {name:"Reports", path: '--', icon: <HiOutlineDocumentReport title='Reports' />,
        subItems:[
            { name: " Merchants TDS Reports", path: '/merchant-tds-reports', icon: <HiOutlineDocumentReport title='TDS Report' /> },
            // { name: "Merchant TDS Reports", path: '/merchant-reports', icon: <HiOutlineDocumentReport title='Merchant Profit Report' /> },
            { name: "Customer Reports", path: '/customer-reports', icon: <HiOutlineDocumentReport title='Customer Report' /> },
            { name: "Credits Report", path: '/credits-report', icon: <HiOutlineDocumentReport title='Credits Report' /> },
        ]
    },
    { name: "Settings", path: '/settings', icon: <IoSettingsOutline title='Settings' /> },
    { name: "Raised Ticket", path: '/raised_tickets', icon: <BsQuestionCircle title='Raised Ticket' /> },
];

const SideBar = ({ open, handleLogOut }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const location = useLocation();

    useEffect(() => {
        sidebarItems.forEach((navItem, index) => {
            if (navItem.subItems?.some(sub => sub.path === location.pathname)) {
                setOpenDropdown(index);
            }
        });
    }, [location.pathname]);

    const handleDropdownClick = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
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
                    <div className={`${style.sidebar_item_container} ${openDropdown === i ? style.horizontal_line : ''}`} key={i}>
                        {item.path === '--' ? (
                            <div className={`${style.sidebar_item_parent}`} onClick={() => handleDropdownClick(i)}>
                                <div className={style.sidebar_item}>
                                    <span className={style.sidebar_icon}>{item.icon}</span>
                                    <span className={open ? style.sidebar_item_name : style.sidebar_item_name_collapsed}>{item.name}</span>
                                </div>
                                <p>{openDropdown === i ? <FiChevronDown /> : <FiChevronRight />}</p>
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
                        {item.subItems && openDropdown === i && (
                            <div className={style.sub_items_container}>
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
                    <div className={`${style.sidebar_item_container} ${openDropdown === i ? style.horizontal_line : ''}`} key={i}>
                        {item.path === '--' ? (
                            <div className={`${style.sidebar_item_parent}`} onClick={() => handleDropdownClick(i)}>
                                <div className={style.sidebar_item}>
                                    <span className={style.sidebar_icon}>{item.icon}</span>
                                    <span className={open ? style.sidebar_item_name : style.sidebar_item_name_collapsed}>{item.name}</span>
                                </div>
                                <p>{openDropdown === i ? <FiChevronDown /> : <FiChevronRight />}</p>
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
                        {item.subItems && openDropdown === i && (
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