import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Dashboard from "./Component/page/DashBoard";
import SideBar from "./Component/SideBar";
import NavigationBar from "./Component/NavigationBar";
import User from "./Component/page/user/User";
import UserDetail from "./Component/page/user/UserDetail";
import MemberShip from "./Component/page/memberShip/MemberShip";
import UpdateMemberShip from "./Component/page/memberShip/UpdateMemberShip";
import Music from "./Component/page/music/Music";
import Album from "./Component/page/music/Album";
import AddAlbum from "./Component/page/music/AddAlbum";
import UpdateAlbum from "./Component/page/music/UpdateAlbum";
import Login from "./Component/Login";
import MusicController from "./Component/page/MusicController";
import Artist from "./Component/page/artist/artist";
import AddMemberShip from "./Component/page/memberShip/AddMemberShip";
import "./style/global.scss";
import { useSelector } from "react-redux";
import { useState } from "react";


const App = () => {
    const isLoggedIn = useSelector((state)=> state.user.isLoggedIn); // Redux 상태 가져오기
    const [SidebarOpen, setSidebarOpen] = useState(true)    



    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <div className="appLayout">
                {isLoggedIn && <SideBar SidebarOpen={SidebarOpen} />}
                <div className={`mainContent ${isLoggedIn ? "loggedIn" : "loggedOut"}`}>
                    {isLoggedIn && <NavigationBar setSidebarOpen={setSidebarOpen} SidebarOpen ={SidebarOpen}/>}
                    <Routes>                      
                        <Route path="/" element={<Login />} />                     
                        {isLoggedIn ? (
                            <>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/user" element={<User />} />
                                <Route path="/addAlbum" element={<AddAlbum />} />
                                <Route path="/updateAlbum/:albumId" element={<UpdateAlbum />} />
                                <Route path="/artist" element={<Artist />} />
                                <Route path="/UserDetail/:memberId" element={<UserDetail />} />
                                <Route path="/memberShip" element={<MemberShip />} />
                                <Route path="/updateMemberShip/:membershipId" element={<UpdateMemberShip />} />
                                <Route path="/addMemberShip" element={<AddMemberShip />}/>
                                                                
                                <Route path="/musicController" element={<MusicController />}>
                                    <Route path="music" element={<Music />} />
                                    <Route path="artist" element={<Artist />} />
                                    <Route path="album" element={<Album />} />
                                </Route>

                            </>
                            ) : (
                                <Route path="*" element={<Login />} />
                            )}
                    </Routes>
                </div>
            </div>
        </motion.div>
    );
}

export default App;