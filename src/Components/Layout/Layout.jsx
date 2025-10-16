import React, { useState } from 'react';
import NewHeader from '../Header/NewHeader';
import SideBar from '../LeftSidebar/NewLeftSidebar';
import { Outlet} from 'react-router-dom';
import { handleLogOut } from '../../helperFunction/helper';

function Layout() {
    const [open, setOpen] = useState(true);
    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <div style={{ display: 'flex', gap: '20px', height: '100vh' }}>
            <div style={{
                height: '100vh', overflowY: 'scroll',
                width: open ? '320px' : '90px',
                transition: 'width 0.3s ease-in-out',
                overflowX: 'hidden'
            }}>
                <SideBar open={open} handleLogOut={handleLogOut} />
            </div>
            <div style={{
                width: '100%',
                overflowX: 'hidden',
            }}>
                <NewHeader open={open} handleOpen={handleOpen} handleLogOut={handleLogOut} />
                <Outlet />
            </div>
        </div>
    )
}

export default Layout;
