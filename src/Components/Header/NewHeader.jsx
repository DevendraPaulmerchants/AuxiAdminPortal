import { FiAlignLeft } from "react-icons/fi";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";
import { GrNotification } from "react-icons/gr";
import { FaAngleDown } from "react-icons/fa6";

import style from './NewHeader.module.css';
// import useUserDetailsStore from "../../store/userDetailsStore";
// import useSidebarCollapseStore from "../../store/sidebarCollapse";
// import useLogInStore from "../../store/loginStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const NewHeader = ({open,handleOpen,handleLogOut}) => {
    const [isUserIconClick, setIsUserIconClick] = useState(false);
    const openUserModel=()=>{
        setIsUserIconClick(!isUserIconClick);
    }
      const closeUserModel = () => {
        setIsUserIconClick(false);
      }
    // const isUserNameClicked = useUserDetailsStore((state) => state.isUserNameClicked);
    // const toggleIsUserNameClicked = useUserDetailsStore((state) => state.toggleIsUserNameClicked);
    // const logout =useLogInStore((state)=>state.logout);
    // const handleUserNameClick = () => {
    //     toggleIsUserNameClicked();
    // };
    // const toggleIsSidebarCollapse = useSidebarCollapseStore((state) => state.toggleIsSidebarCollapsed);
    // const handleSidebarCollapse = () => {
    //     toggleIsSidebarCollapse();
    // };
    // const navigate=useNavigate();
    // const logOut=()=>{
    //     logout();
    //     navigate('/')
    // }
    return (
        <header className={style.header_container}>
            <h1 className={style.header_collapse_icon}><FiAlignLeft onClick={handleOpen} /></h1>
            <div className={style.header_logo_container}>
                <h1><BsBrightnessHigh /></h1>
                <h1><GrNotification /></h1>
                <div className={style.user_container}>
                    <img src="/HeaderUserIcon.png" alt="User" className="user_image" />
                    <pre className={style.user_info}>
                        <p className={style.user_name} onClick={openUserModel} >Wade Warren <FaAngleDown/></p>
                        <p className={style.user_role}>Admin</p>
                    </pre>
                    {isUserIconClick && (
                        <div className={style.user_name_dropdown}>
                            <ul>
                                <li>Profile</li>
                                <li onClick={handleLogOut}>Log out</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
export default NewHeader;