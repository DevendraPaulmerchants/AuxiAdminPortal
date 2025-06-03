import React, { useState } from 'react';
import style from "./Header.module.css";
import { Link } from 'react-router-dom';
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import Model from "react-modal";

function Header({ open, handleOpen, handleLogOut }) {
  const [isUserIconClick, setIsUserIconClick] = useState(false);
  const closeUserClick = () => {
    setIsUserIconClick(false);
  }
  const customStyles = {
    overlay: { backgroundColor: 'transparent' },
    content: {
      boxShadow: "0 0 10px 10px rgb(38,38,38,0.5)",
      height: "fit-content",
      width: "100px",
      position: "absolute",
      right: "20px",
      top: "50px",
      padding: "5px",
      bottom: "auto",
      left: "auto"
    },
  };

  return <>
    <div className={style.header_parent}>
      <div className={open ? style.header_logo_and_container : style.header_logo_and_close}>
        <Link to="/" 
        className={style.logo_container}
        ></Link>
        <h2 className={style.forward_and_backward_icon} onClick={handleOpen}>
          {open ? <span>&lt;</span> : <span>&gt;</span>}
          </h2>
      </div>
      <div className={style.header_notification_and_user_icon}>
        <h3>Admin</h3>
        <h2><IoIosNotifications /></h2>
        <h2 onClick={() => setIsUserIconClick(true)}><FaUser /></h2>
      </div>
    </div>
    {isUserIconClick &&
      <Model
        isOpen={isUserIconClick}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeUserClick}
        style={customStyles}
      >
        <ul className={style.user_menu_list}>
          <li><Link onClick={handleLogOut} to="/">Log Out</Link></li>
        </ul>
      </Model>
    }
  </>
}

export default Header;