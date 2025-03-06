import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import "../style/navigation.scss";
import { useNavigate } from "react-router-dom"
import { logoutAction } from "../store/UserSlice";


const NavigationBar = ({ SidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userName = useSelector((state) => state.user.name)

    const onLogout = ()=> {
        dispatch(logoutAction());
        navigate("/"); 

    }



    return (
        <nav className="navigationBar">           
            <p>{`${userName} `}</p>
            <button onClick={onLogout}>로그아웃</button>
        </nav>
    )
}

export default NavigationBar
