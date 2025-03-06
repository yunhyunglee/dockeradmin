import React, { useState } from "react";
import "../../../style/user.scss";
import jaxios from '../../../util/JwtUtil';
import { useNavigate } from "react-router-dom";


const User = () => {
    const [userList, setUserList] = useState([]);  // 검색된 회원 목록
    const [search, setSearch] = useState("");  // 검색 입력값
    const [loading, setLoading] = useState(false);  // 로딩 상태
    const navigate = useNavigate();

    // 🔍 회원 검색 함수
    const searchUser = async () => {
        if (!search.trim()) {

            return;
        }

        setLoading(true);
        try {
            const response = await jaxios.get("/api/member/searchMember", {
                params: { memberId: search }
            });

            if (response.data.member && response.data.member.length > 0) {
                setUserList(response.data.member);  // 검색 결과 설정
            } else {
                setUserList([]);  // 검색 결과 없을 때 초기화
            }
        } catch (error) {
            console.error("사용자 검색 실패:", error);
            alert("사용자 정보를 불러오는 중 오류 발생");
        } finally {
            setLoading(false);
        }
    };

    const Age = (birthDate) => {
        if (!birthDate) return "정보 없음"; // 생년월일이 없는 경우 예외 처리
    
        const birthYear = new Date(birthDate).getFullYear(); // 출생 연도 추출
        const currentYear = new Date().getFullYear(); // 현재 연도
    
        return currentYear - birthYear; // 나이 계산
    };





    return (
        <div className="userPage">
            <div className="userContent">
                <h1>회원 관리</h1>
                
                <div className='top2'>
                    <input type="text" className="searchInput" placeholder="회원 검색 (아이디)" 
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className="searchBtn" onClick={searchUser}>검색</button>
                </div>

                {loading && <p>로딩 중...</p>}

                {/* 📌 테이블 - 검색 결과 표시 */}
                <table>
                    <thead>
                        <tr>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>나이</th>
                            <th>닉네임</th>
                            <th>연락처</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="noData">검색된 사용자가 없습니다.</td>
                            </tr>
                        ) : (
                            userList.map((user, index) => (
                                <tr key={index} className="clickable" onClick={() => navigate(`/userDetail/${user.memberId}`)}>
                                    <td>{user.memberId || "정보 없음"}</td>
                                    <td>{user.name || "정보 없음"}</td>
                                    <td>{user.birth ? Age(user.birth) + "세" : "정보 없음"}</td>
                                    <td>{user.nickname || "정보 없음"}</td>                                
                                    <td>{user.phone || "정보 없음"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;
