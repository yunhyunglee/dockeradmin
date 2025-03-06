import axios from "axios";
import { Cookies } from "react-cookie";

const jaxios=axios.create();
const cookies=new Cookies();

const beforeReq= async (config)=>{
    let user=cookies.get('user');
    const accessToken = user.accessToken;
    const Header = { headers:{ 'Authorization':`Bearer ${accessToken}`} , params:{refreshToken:user.refreshToken } };
    
    
    const result = await axios.get(`/api/member/refresh`, Header );

    user.accessToken = result.data.accessToken;
    user.refreshToken = result.data.refreshToken;

    cookies.set( 'user', JSON.stringify(user) );

    config.headers.Authorization = `Bearer ${user.accessToken}`;

    return config;
}

const beforeRes= (res)=>{
    return res;
}
const requestFail=(err)=>{}
const responseFail=(err)=>{}


jaxios.interceptors.request.use(beforeReq,requestFail);
jaxios.interceptors.response.use(beforeRes,responseFail);

export default jaxios;