import React, { useEffect, useState,  } from "react";
import "../../../style/userDetail.scss";
import jaxios from '../../../util/JwtUtil';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ShieldOff } from "lucide-react";


const UserDetail = () => {
    const { memberId } = useParams(); // 🔹 URL에서 memberId 가져오기
    const [user, setUser] = useState({});
    const [membership, setMembership] = useState(null);
    const [paymentList, setPaymentList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newNickname, setNewNickname] = useState(user.nickname);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate(); 
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [paymentDetail, setPaymentDetail] = useState(null);



    // ✅ 회원 상세 정보, 멤버십, 결제 내역 불러오기


        const getUserDetails  = async (memberId) => {
            setLoading(true);
            try {
                // 🔹 사용자 정보 가져오기
                const userResponse = await jaxios.get("/api/member/searchMember", {
                    params: { memberId }
                });

                if (userResponse.data.member?.length > 0) {
                    const userData = userResponse.data.member[0];
                    setUser(userData); 
                    setNewNickname(userData.nickname || "");
                } else {
                    alert("사용자 정보를 찾을 수 없습니다.");
                    setUser({});
                }
                const membershipResponse = await jaxios.get("/api/membership/getActiveMembership", {
                    params: { memberId }
                });
                setMembership(membershipResponse.data.memberShipUserList || []);

                const paymentResponse = await jaxios.get("/api/payments/getPaymentList", {
                    params: { memberId }
                });
                setPaymentList(paymentResponse.data.paymentList || []);
            } catch (error) {
                console.error("회원 상세 정보 불러오기 실패:", error);
                alert("회원 정보를 불러오는 중 오류 발생");
            } finally {
                setLoading(false);
            }
        };

    const Age = (birthDate) => {
        if (!birthDate) return "정보 없음"; 
    
        const birthYear = new Date(birthDate).getFullYear(); 
        const currentYear = new Date().getFullYear(); 
    
        return currentYear - birthYear; 
    };

    // const updateNickname = async () => {
    //     if (!user.memberId || !newNickname.trim()) return;

    //     try{
    //         const response = await jaxios.post("/api/member/updateMember", {
    //             ...user,
    //             nickname: newNickname, 
                
    //         });
    //         if(response.data.msg === "yes"){
    //             alert("닉네임이 성공적으로 변경되었습니다.");
    //             setUser(prev => ({ ...prev, nickname: newNickname }));
    //             setEditing(false);
    //         }else{
    //             alert("닉네임 변경 실패");
    //         }
    //     }catch(error){
    //         console.error("닉네임 변경 실패:", error);
    //         alert("닉네임 변경 중 오류 발생");
    //     }
    // };

    // const onPaymentDetail = (payment) => {
    //     setPaymentDetail(payment);
    //     alert(`
    //         결제 상세 정보:
    //         주문명: ${payment.orderName}
    //         결제 금액: ${payment.amount}원
    //         결제 상태: ${payment.paid ? "성공" : "실패"}
    //         결제일: ${payment.createAt?.substring(0, 10) || "날짜 없음"}
    //         결제 ID: ${payment.paymentId}

    //     `);

    // };


    const updateUserRole = async () => {
        if (!window.confirm(user.memberRoleList.includes("ADMIN") ? 
        "이 사용자의 관리자 권한을 해제하시겠습니까?" : 
        "이 사용자에게 관리자 권한을 부여하시겠습니까?")) return;

        try{
            const response = await jaxios.post("/api/member/updateRole", null, {
                params: {memberId: user.memberId, role: "ADMIN"}
            });

            if(response.data ==="권한 변경 완료") {
                alert(user.memberRoleList?.includes("ADMIN") ? "관리자 권한이 해제되었습니다." : "관리자 권한이 부여되었습니다.");
                setUser(prev => ({
                    ...prev,
                    memberRoleList: prev.memberRoleList.includes("ADMIN") ? 
                        prev.memberRoleList.filter(r => r !== "ADMIN") : 
                        [...(prev.memberRoleList || []), "ADMIN"]
                }));
            } else {
                alert("권한 변경 실패");

            }


        }catch(error){
            console.error("관리자 권한 변경 실패:", error);
            alert("관리자 권한 변경 중 오류 발생");
        }





    }




    const openPaymentDetail = (payment) => {
        setPaymentDetail(payment);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };
    
    


    useEffect(() => {
        getUserDetails(memberId);
    }, [memberId]); 


    return (
        <div className="userDetailPage">
            
                <div className="userDetailContent">
                <button 
                    className={`roleButton ${user.memberRoleList?.includes("ADMIN") ? "adminActive" : "adminInactive"}`} 
                    onClick={updateUserRole}>
                    {user.memberRoleList?.includes("ADMIN") ? <ShieldOff size={20} /> : <ShieldCheck size={20} />}
                </button>
                    <h1>회원 상세 정보</h1>
                

                    <div className="content">
                        
                        <div className="profileContainer">
                            <img src={user.image || "/images/default_image.jpg"} alt="프로필" className="image" />
                        </div>

                        <div className="infoContainer">
                            <p><strong>아이디:</strong> {user.memberId || "정보 없음"}</p>
                            <p><strong>이름:</strong> {user.name || "정보 없음"}</p>
                            <p><strong>이메일:</strong> {user.email || "정보 없음"}</p>
                            <p><strong>전화번호:</strong> {user.phone || "정보 없음"}</p>
                            <p><strong>나이:</strong> {user.birth ? Age(user.birth) + "세" : "정보 없음"}</p>

                            {/* ✅ 닉네임 수정 가능 */}
                            <p>
                                <strong>닉네임: </strong>
                                {/* {editing ? (
                                    <input
                                        type="text"
                                        value={newNickname}
                                        onChange={(e) => setNewNickname(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && updateNickname()} 
                                        autoFocus
                                    />
                                ) : ( */}
                                    <span className="clickable" onClick={() => setEditing(true)}>
                                        {user.nickname || "정보 없음"}
                                    </span>
                                {/* )} */}
                            </p>
                        </div>
                    </div>

                    {/* 📌 멤버십 정보 */}
                    <h3>멤버십 정보</h3>
                    <div className="membershipContainer">
                        {membership?.length > 0 ? (
                            membership.map((m, index) => (
                                <div key={index} className="membershipCard">
                                    <p><strong>맴버쉽 이름:</strong> {m.membershipCategory || "카테고리 없음"}</p>
                                    <p><strong>종료일:</strong> {m.endDate?.substring(0, 10) || "날짜 없음"}</p>
                                </div>
                            ))
                        ) : (
                            <p className="noMembership">활성화된 멤버십 없음</p>
                        )}
                    </div>

                    {/* 📌 결제 내역 */}
                    <h3>결제 내역</h3>
                    {paymentList?.length > 0 ? (
                        <div className="paymentContainer">
                            <table className="paymentTable">
                                <thead>
                                    <tr>
                                        <th>주문명</th>
                                        <th>금액</th>
                                        <th>결제 상태</th>
                                        <th>결제일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentList.map((p, index) => (
                                        <tr 
                                            key={index} 
                                            className={`paymentRow ${p.paid ? "success" : "fail"}`} 
                                            onClick={() => openPaymentDetail(p)}
                                        >
                                            <td>{p.orderName || "ID 없음"}</td>
                                            <td>{p.amount?.toLocaleString() || 0}원</td>
                                            <td>{p.paid ? "성공" : "실패"}</td>
                                            <td>{p.createAt?.substring(0, 10) || "날짜 없음"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="noData">결제 내역 없음</p>
                    )}

                {showModal && (
                    <div className="modalOverlay active" onClick={closeModal}>
                        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                            <button className="closeButton" onClick={closeModal}>x</button>
                            <h2>결제 상세 정보</h2>
                            {paymentDetail && (
                                <div className="paymentDetails">
                                    <p><strong>주문명:</strong> {paymentDetail.orderName}</p>
                                    <p><strong>결제 금액:</strong> {paymentDetail.amount}원</p>
                                    <p><strong>결제 상태:</strong> {paymentDetail.paid ? "성공" : "실패"}</p>
                                    {!paymentDetail.paid &&(
                                        <p><strong>실패 사유:</strong> {paymentDetail.failReason?.trim()? paymentDetail.failReason : "결제 중 취소"}</p>
                                    )}
                                    
                                    <p><strong>결제일:</strong> {paymentDetail.createAt?.substring(0, 10) || "날짜 없음"}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                <div className="buttonContainer">
                    <button className="backButton" onClick={() => navigate("/user")}>뒤로 가기</button>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
