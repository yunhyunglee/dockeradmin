import React, { useState } from 'react'
import { Link, useLocation, Outlet } from "react-router-dom";
import "../../style/musicController.scss";



const MusicController = () => {
    
    const location = useLocation();

 const menuItems = [
        { path: "artist",  text: "가수"},
        { path: "album",   text: "앨범"},
        { path: "music",   text: "노래"},
        

    ];






    return (
        <div className='music-layout'>
        <div className='header'>
            <h2>음원 관리</h2>
            <ul>
                {menuItems.map((item, index) => {
                    const currentPath = location.pathname.replace("/musicController/", "");

                    return (
                    <li key={index} className={currentPath === item.path ? "active" : ""}>
                        <Link to={item.path}>{item.text}</Link>
                    </li>
                );
                })}
            </ul>
        </div>
        <div className="content">
            <Outlet />
        </div>
    </div>
    )
}

export default MusicController
