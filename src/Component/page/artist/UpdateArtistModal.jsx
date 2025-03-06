import React, { useState, useEffect  } from 'react'
import axios from "axios";
import "../../../style/artistModal.scss";
import jaxios from '../../../util/JwtUtil';

const UpdateArtistModal = ({ onClose, artist, getArtistList }) => {

    const [updateArtist, setUpdateArtist] = useState({
        artistName: "",
        country: "",
        debut: "",
        image: "/images/default_image.jpg",
        artistContent: "",
    });

    useEffect(() => {
        console.log("현재 아티스트 데이터:", artist);
        if (artist) {
            setUpdateArtist({
                artistName: artist.artistName || "",
                country: artist.country || "",
                debut: artist.debut ? artist.debut.split("T")[0] : "",
                image: artist.image || "/images/default_image.jpg",
                artistContent: artist.artistContent || "",
            });
        }
    }, [artist]);


    const onChange = (e) => {
        setUpdateArtist({ ...updateArtist, [e.target.name]: e.target.value });
    };

    const onImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;      
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await axios.post("/api/music/imageUpload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUpdateArtist({ ...updateArtist, image: response.data.image }); // ✅ 업로드된 이미지 URL 적용
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드 실패");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!updateArtist.artistName.trim()) {return alert("가수 이름을 입력해주세요."); }
        if (!updateArtist.country.trim()) {return alert("국가를 입력해주세요."); }
        if (!updateArtist.debut) {return alert("데뷔 날짜를 선택해 주세요"); }
        if (!updateArtist.image) {return alert("가수 이미지를 선택해주세요"); }

        try{
            const response = await jaxios.post("/api/music/updateArtist" , {
                artistId: artist.artistId,
                artistName: updateArtist.artistName,
                country: updateArtist.country,
                debut: updateArtist.debut,
                image: updateArtist.image, // ✅ 이미지 전송
                artistContent: updateArtist.artistContent, // ✅ 설명 전송
            });  
            console.log("백엔드 응답:", response.data);        
            if(response.data.msg ==="yes"){
                alert("가수 정보 수정 완료");
                getArtistList();
                onClose();
            } else{
                alert("가수 수정 실패");
            }
        }catch(error){
            console.error("가수 수정 오류", error);
            alert("가수 수정 중 오류 발생");
        }
    };





    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>               
                    <h2>가수 수정</h2>
                    <form onSubmit={onSubmit}>
                    <div className="content">
                    <div className="imageUploadContainer">
                        <input type="file" id="imageUpload" accept="image/*" onChange={onImageUpload} style={{ display: "none" }} />
                        <img
                            src={updateArtist.image || "/images/default_image.jpg"} 
                            alt="아티스트 이미지"
                            className="artistImage"
                            onClick={() => document.getElementById("imageUpload").click()}
                        />
                    </div>
                        <div className='inputdiv'>
                            <input type="text" name="artistName" value={updateArtist.artistName} onChange={onChange} placeholder="가수 이름" required />
                            <input type="text" name="country" value={updateArtist.country} onChange={onChange} placeholder="국적" required />
                            <input type="date" name="debut" value={updateArtist.debut || ""} onChange={onChange} required />                  
                        </div>        
                    </div>

                    <textarea name="artistContent"  value={updateArtist.artistContent } onChange={onChange} placeholder="설명"/>
                    <div className='inputdiv'>
                        <div className="modalActions" >
                            <button type="submit">수정</button>
                            <button type="button" className="cancel" onClick={onClose}>취소</button>
                        </div> 
                    </div> 
                    </form>  
                </div>
        </div>
    );
};

export default UpdateArtistModal
