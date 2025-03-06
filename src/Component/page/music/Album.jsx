import React, { useEffect, useState} from 'react'
import axios from 'axios'
import jaxios from '../../../util/JwtUtil';
import { useNavigate } from "react-router-dom";
import "../../../style/music.scss";
import UpdateArtistModal from "../artist/UpdateArtistModal";


const Music = () => {
    const [albumList, setAlbumList] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [showArtistModal, setShowArtistModal] = useState(false); // 
    const [selectedArtist, setSelectedArtist] = useState(null);


    

    const getArtistInfo = async (artistId) => {
        try {
            const response = await jaxios.get(`/api/music/getArtist`, {
                params: { artistId }
            });
            setSelectedArtist(response.data.artist); // 가수 정보 저장
            setShowArtistModal(true); // 모달 열기
        } catch (error) {
            console.error("가수 정보를 불러오지 못했습니다:", error);
            alert("가수 정보를 가져오는 중 오류가 발생했습니다.");
        }
    };

    const handleArtistClick = (artistId) => {
        getArtistInfo(artistId);
    };



    const onSearch = (e) => {
        setSearch(e.target.value);
    };





    const getAlbumList = async () => {
        try {
            const response = await jaxios.get("/api/music/getAllAlbum");
            setAlbumList(response.data.album);
            console.log("🎵 앨범 리스트 불러오기 성공:", response.data.album);
        } catch (error) {
            console.error("앨범 목록을 불러오지 못했습니다:", error);
        }
    };

    useEffect(() => {
        getAlbumList();
    }, []);

    useEffect(() => {
        
    }, [albumList]); 



    const deleteAlbum = async (albumId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
    
        try {
            // 백엔드에서 DELETE 요청을 Query Parameter로 받음
            const response = await jaxios.delete(`/api/music/deleteAlbum`, {
                params: { albumId }, // Query Parameter 방식으로 전달
            });
    
            if (response.data.msg === "yes") {
                alert("삭제 완료!");
                setAlbumList(prev => prev.filter(album => album.albumId !== albumId));
            } else {
                alert("삭제 실패");
            }
        } catch (error) {
            console.error("앨범 삭제 오류:", error);
            alert("삭제 중 오류 발생");
        }
    };
    



    const searchFilter = search === "" ? albumList : albumList.filter(album =>    
        album.title.toLowerCase().includes(search.toLowerCase())    

    );
    


    return (
        <div className={"musicPage"}>          
            <div className="musicContent">
            <h1>앨범 관리</h1>
                <div className='top2' >
                <input type="text" className="searchInput" placeholder="음원 검색 (제목 또는 장르)" value={search} onChange={onSearch}/>
                <button className="addMusicButton" onClick={() => navigate("/AddAlbum")}>앨범 추가</button>   
                </div>   
                    <table>
                        <thead>
                            <tr>
                                <th>가수</th>
                                <th>앨범</th>                         
                                <th>이미지</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {albumList.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="noData">등록된 음원이 없거나 검색 결과가 없습니다.</td>
                                        </tr>
                                    ) : (     
                                    searchFilter.map((album, index) => (
                                        <tr key={index}>
                                                <td>
                                                    <span className="clickable"
                                                    onClick={() => handleArtistClick(album.artistId)}>
                                                        {album.artistName}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="clickable" onClick={() =>  navigate(`/UpdateAlbum/${album.albumId}`)}>
                                                        {album.title}
                                                    </span>
                                                </td>                               
                                                <td>
                                                    <img src={album.image} alt={album.title} width="50" />
                                                </td>
                                                <td>
                                                    <button className="deleteBtn" onClick={() => deleteAlbum(album.albumId)}>🗑</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                    </table>  
                    {showArtistModal && (
                <UpdateArtistModal artist={selectedArtist} onClose={() => setShowArtistModal(false)}
                />
            )}                       
            </div>  
        </div>
    );
};

export default Music
