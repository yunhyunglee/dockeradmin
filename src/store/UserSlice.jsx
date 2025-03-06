import { createSlice } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";

const cookies = new Cookies(); // ✅ react-cookie 사용

// 초기 상태 정의
const initialState = {
    member_id: "",
    password: "",
    name: "",
    nickname: "",
    phone: "",
    email: "",
    zip_code: "",
    address: "",
    address_detail: "",
    address_extra: "",
    birth: "",
    gender: "",
    image: "",
    indate: "",
    provider: "",
    rolename: [],
    accessToken: "",
    refreshToken: "",
    isLoggedIn: false, // 로그인 여부 추가
    memberKey: "",
};

// 쿠키는 자동으로 디코딩 되어 "decodeURIComponent()" 가 필요없음
const getLoginUser = () => {
    const memberInfo = cookies.get("adminuser");

    return memberInfo ? { ...initialState, ...memberInfo, isLoggedIn: true } : initialState;
};


export const userSlice = createSlice({
    name: "user",
    initialState: getLoginUser(), 
    reducers: {
        // Redux 상태 업데이트 + 쿠키 저장
        loginAction: (state, action) => {
            const userData = { ...state, ...action.payload, isLoggedIn: true };
            cookies.set("user", userData, { path: "/", maxAge: 86400 });
            return userData; 
        },
        logoutAction: () => {
            cookies.remove("user"); 
            return { ...initialState, isLoggedIn: false };
        },
    },
});


export const persistUserState = (store) => {
    store.subscribe(() => {         // subscribe = Redux Store가 변경될때 자동으로 감지해서 특정 동작을 실행하는 함수 
        const state = store.getState().user;
        if(state.isLoggedIn){
            cookies.set("user", state, { path: "/", maxAge: 86400 }); 
        }
    });
};


export const { loginAction, logoutAction } = userSlice.actions;
export default userSlice.reducer;
