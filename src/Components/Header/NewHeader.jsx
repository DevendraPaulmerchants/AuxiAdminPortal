import { FiAlignLeft } from "react-icons/fi";
import { BsBrightnessHigh } from "react-icons/bs";
import { GrNotification } from "react-icons/gr";
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { FaAngleDown } from "react-icons/fa6";

import style from './NewHeader.module.css';
import { useState } from "react";

const NewHeader = ({ handleOpen, handleLogOut }) => {
    const [isUserIconClick, setIsUserIconClick] = useState(false);
    const openUserModel = () => {
        setIsUserIconClick(!isUserIconClick);
    }

    return (
        <header className={style.header_container}>
            <h1 className={style.header_collapse_icon}><FiAlignLeft onClick={handleOpen} /></h1>
            <div className={style.header_logo_container}>
                {/* <h1><BsBrightnessHigh /></h1> */}
                {/* <h1><GrNotification /></h1> */}
                <div className={style.user_container}>
                    <img src="/HeaderUserIcon.png" alt="User" className="user_image" />
                    <Dropdown>
                        <MenuButton>

                            <pre className={style.user_info}>
                                <p className={style.user_name} onClick={openUserModel} >Paul Gold <FaAngleDown /></p>
                                <p className={style.user_role}>Admin</p>
                            </pre>
                        </MenuButton>
                        <Menu>
                            <MenuItem onClick={handleLogOut}>LogOut</MenuItem>

                        </Menu>
                    </Dropdown>
                </div>
            </div>
        </header>
    );
}
export default NewHeader;