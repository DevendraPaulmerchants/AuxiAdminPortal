import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./LeftSidebar.css";
import style from './NewLeftSidebar.module.css';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { sidebarItems } from './LeftSidebarHeader';
import { MdLogout } from 'react-icons/md';

const SideBar = ({ open, handleLogOut }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const location = useLocation();

    useEffect(() => {
        sidebarItems.forEach((navItem) => {
            if (navItem.subItems?.some(sub => sub.path === location.pathname )) {
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
                    <img src="/AdminLogo.svg" alt="Logo" className={style.logo} />
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
                                <div className={style.sidebar_item_without_route}>
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
                                <div className={style.sidebar_item_without_route}>
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
                ><MdLogout title='LogOut' /></button> :
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
