import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector  } from "react-redux"
import { loginAction } from "../store/UserSlice";
import "../style/login.scss";
import axios from "axios";
import { Cookies } from "react-cookie";

const Login = () => {
    const [memberId, setMemberId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const cookies = new Cookies();
    const dispatch = useDispatch();
    const loginUser = useSelector(state => state.user);

    async function loginLocal() {
        if (!memberId) {return alert("아이디를 입력하세요."); }
        if (!password) { return alert("비밀번호를 입력하세요.");}

        try {
            const result = await axios.post("/api/member/login", null, {
                params: { username: memberId, password: password }
            });

            if (result.data.error === "ERROR_LOGIN") {
                alert("아이디와 비밀번호를 확인하세요.");
                setMemberId("");
                navigate("/login");
            } else {
                alert("로그인이 되었습니다!");
                cookies.set("adminuser", JSON.stringify(result.data), { path: "/", secure: true, sameSite: "Strict" });
                dispatch(loginAction(result.data));
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("❌ 로그인 실패:", error);

        }
    }


    return (
        <div className="loginBack">
        <motion.div className="loginContainer" initial={{ opacity: 0, y: -200 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h2>Admin Login</h2>
            <input type="text" placeholder="아이디 입력" value={memberId} onChange={(e) => {
                setMemberId(e.target.value)}}/>
            <input type="password" placeholder="비밀번호 입력" value={password} onChange={(e) => {
                setPassword(e.currentTarget.value)}}/>
                {error && <p className="errorMessage">{error}</p>}
            <motion.button onClick={loginLocal}  >로그인</motion.button>
        </motion.div>
        </div>
    );
}

export default Login

