import React, { useState, useEffect } from 'react';
import style from "./LeftSidebar.module.css";
import "./LeftSidebar.css";
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiUsers, FiChevronDown, FiChevronRight, FiUserCheck } from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";
import { FiKey, FiSettings } from "react-icons/fi";
import { MdOutlineAccountBalance, MdManageAccounts, MdPayment, MdTune, MdBuild, MdOutlineSettingsSystemDaydream } from "react-icons/md";
import { AiOutlineGold, AiFillLock, AiOutlineHourglass } from "react-icons/ai";
import { BsCashStack, BsPersonBoundingBox } from "react-icons/bs";
import { BiCreditCard, BiUser } from "react-icons/bi";
import { FaDollarSign, FaExchangeAlt, FaRegCreditCard, FaUniversity, FaUserShield } from "react-icons/fa";
import { FaChartLine, FaMoneyBillWave, FaBalanceScale } from "react-icons/fa";
import { MdInsights } from "react-icons/md";
import { AiOutlineCustomerService } from "react-icons/ai";  
import { MdSupportAgent } from "react-icons/md";
import { GiMetalBar } from "react-icons/gi";
import { MdInventory2 } from "react-icons/md";

function LeftSidebar({ open }) {
    const user = 'superAdmin';
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);

    const navigation = React.useMemo(() => [
        {
            title: "Dashboard",
            path: "/",
            icon: <RiDashboardFill title='Dashboard' />
        },
        {
            title: "Merchant`s Services",
            path: "--",
            icon: <FiUsers />,
            subnavigation: [
                { title: "Merchants", path: "/merchant", icon: <BsPersonBoundingBox title='Merchants List' /> },
                {title:"Pending Merchants", path:'/pending_merchants', icon:<AiOutlineHourglass title='Pending Merchants List' />},
                { title: "Approved Credits", path: "/credits", icon: <BiCreditCard title='Approved credit request' /> },
                ...(user === 'superAdmin' ? [{ title: "Requested Credit", path: "/credit_approval", icon: <BsCashStack title='Requested Credits List' /> }] : []),
                { title: "API Key", path: "/api-key", icon: <FiKey title='Merchant`s API Key List' /> },
                {title:"Customers", path:"/customer",icon:<FiUserCheck />}
            ]
        },
        {
            title: "Metal/Credits Transactions",
            path: "--",
            icon: <MdOutlineAccountBalance />,
            subnavigation: [
                { title: "Gold", path: "/gold", icon: <AiOutlineGold title='Gold Transactions' /> },
                { title: "Silver", path: "/silver", icon: <BsCashStack title='Silver Transactions' /> },
                { title: "Credits", path: "/credit_transaction", icon: <BsCashStack title='Credit Transaction' /> },
            ]
        },
        {
            title: " Bank Accounts",//according to kamlesh ans Arvindra sir
            path: "--",
            icon: <FaUniversity />,
            subnavigation: [
                { title: "Bank", path: "/account", icon: <FaRegCreditCard title='Added Bank List' /> },
                { title: "UPI", path: "/upi", icon: <MdPayment title='Added UPI List' /> }
            ]
        },
        {
            title: "Manage Margin",
            path: "--",
            icon: <MdInsights />,
            subnavigation: [
                { title: "Global", path: "/global", icon: <FaMoneyBillWave title='Global Margin List' /> },
                { title: "Schemes", path: "/schemes", icon: <FaBalanceScale title='Scheme List' /> }
            ]
        },
        {
            title: "Metal Rate ",
            path: "--",
            icon: <FaChartLine />,
            subnavigation: [
                { title: "Exchange Rate", path: "/exchange", icon: <FaExchangeAlt title='Exchange Rate List' /> },
                { title: "Auxi Rate", path: "/auxi_rates", icon: <FaDollarSign title='Auxi Rate List' /> }
            ]
        },
        {
            title: "Metal Inventory",
            path: "--",
            icon: <GiMetalBar />,
            subnavigation: [
                { title: "Metal", path: "/metal", icon: <GiMetalBar title='Metal Details List' /> },
                { title: "Metal logs", path: "/metal_logs", icon: <MdInventory2 title='Metals log List' /> }
            ]
        },
        {
            title: "Support Management",
            path: "--",
            icon: <AiOutlineCustomerService />,
            subnavigation: [
                { title: "Support", path: "/supports", icon: <MdSupportAgent title='Queries From Users' /> }
            ]
        },
        {
            title: "Access Management",
            path: "--",
            icon: <AiFillLock />,
            subnavigation: [
                { title: "Permission", path: "/permission", icon: <FiSettings title='All Permissions List' /> },
                { title: "Department", path: "/role", icon: <FaUserShield title='Added Department LIst' /> }
            ]
        },
        {
            title: "Portal Users",
            path: "--",
            icon: <MdManageAccounts />,
            subnavigation: [
                { title: "Users", path: "/user", icon: <BiUser title='Portal Users List' /> }
            ]
        },
        {
            title: "Env Setup",
            path: "refresh_rate",
            icon: <MdOutlineSettingsSystemDaydream title='Environment Setting'  />,
        },
    ], [user]);

    useEffect(() => {
        navigation.forEach((navItem, index) => {
            if (navItem.subnavigation?.some(sub => sub.path === location.pathname)) {
                setOpenDropdown(index);
            }
        });
    }, [location.pathname, navigation]);

    const handleDropdownClick = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <div className={open ? style.leftsidebar_parent_container : style.leftsidebar_parent_container_close}>
            {navigation.map((nav, index) => (
                <div key={index} className={style.leftsidebar_container}>
                    <div 
                    className={style.nav_item }  
                    onClick={() => handleDropdownClick(index)}>
                        {nav.path !== "--" ? (
                            <NavLink to={nav.path}>
                                <span className={style.list_icon}>{nav.icon}</span>
                                <span className={style.list_title}>{nav.title}</span>
                            </NavLink>
                        ) : (
                            <div className={style.sub_title_menu}>
                                <span className={style.list_icon}>{nav.icon}</span>
                                <span className={style.list_title}>{nav.title}</span>
                            </div>
                        )}
                        {nav.subnavigation && (
                            <span className={style.dropdown_icon}>
                                {openDropdown === index ? <FiChevronDown /> : <FiChevronRight />}
                            </span>
                        )}
                    </div>

                    {nav.subnavigation && openDropdown === index && (
                        <div className={style.subnavigation_container}>
                            {nav.subnavigation.map((subNav, subIndex) => (
                                <div
                                    key={subIndex}
                                    className={location.pathname === subNav.path ? `${style.subnav_item} ${style.leftsidebar_active}` : style.subnav_item}
                                >
                                    <NavLink to={subNav.path}>
                                        <span className={style.sub_list_icon}>{subNav.icon}</span>
                                        <span className={style.sub_list_title}>{subNav.title}</span>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default LeftSidebar;
