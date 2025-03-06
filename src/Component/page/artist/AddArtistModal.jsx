import React, { useState, useEffect } from "react";
import "../../../style/artistModal.scss";
import jaxios from '../../../util/JwtUtil';

const AddArtistModal = ({ onClose, addArtistToList }) => {

    const [newArtist, setNewArtist] = useState({
        artistName: "",
        country: "",
        debut: "",
        image: "",
        artistContent:""
    });





    const onChange = (e) => {
        setNewArtist({ ...newArtist, [e.target.name]: e.target.value });
    };

    const onImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;      
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await jaxios.post("/api/music/imageUpload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setNewArtist({ ...newArtist, image: response.data.image }); // ✅ 업로드된 이미지 URL 적용
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드 실패");
        }
    };



    const onSubmit = async (e) => {
        e.preventDefault();
        if (!newArtist.artistName.trim()) {return alert("가수 이름을 입력해주세요."); }
        if (!newArtist.country.trim()) {return alert("국가를 입력해주세요."); }
        if (!newArtist.debut) {return alert("데뷔 날짜를 선택해 주세요"); }
        if (!newArtist.image) {return alert("가수 이미지를 선택해주세요"); }

        try{
            const response = await jaxios.post("/api/music/insertArtist" , newArtist);  
            console.log("백엔드 응답:", response.data);        
            if(response.data.msg ==="yes"  && response.data.artist ){
                alert("가수 등록 완료!");
                addArtistToList(response.data.artist);
                onClose();
            } else{
                alert("가수 등록 실패");
            }
        }catch(error){
            console.error("가수 등록 오류", error);
            alert("가수등록 중 오류 발생");
        }
    };



return (
    <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                
                    <h2>가수 등록</h2>
                    <form onSubmit={onSubmit}>
                    <div className="content">
                    <div className="imageUploadContainer">
                        <input type="file" id="imageUpload" accept="image/*" onChange={onImageUpload} style={{ display: "none" }} />
                        <img
                            src={newArtist.image || "/images/default_image.jpg"} 
                            alt="아티스트 이미지"
                            className="artistImage"
                            onClick={() => document.getElementById("imageUpload").click()}
                        />
                    </div>

                    <div className='inputdiv'>
                        <input type="text" name="artistName" value={newArtist.artistName} onChange={onChange} placeholder="가수 이름" required />
                        <input type="text" name="country" value={newArtist.country} onChange={onChange} placeholder="국적" required />
                        <input type="date" name="debut" value={newArtist.debut} onChange={onChange} required />                  
                    </div> 
                    </div>
                    <textarea name="artistContent" placeholder="설명" value={newArtist.artistContent } onChange={onChange}/>
                    <div className='inputdiv'>
                        <div className="modalActions" >
                                <button type="submit">등록</button>
                                <button type="button" className="cancel" onClick={onClose}>취소</button>
                        </div> 
                    </div>
                    </form>  
                </div>
        </div>
    );
};

export default AddArtistModal
