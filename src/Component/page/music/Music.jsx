import React, { useEffect, useState, useMemo, useCallback  } from 'react'
import axios from 'axios';
import jaxios from "../../../util/JwtUtil";
import { useNavigate } from "react-router-dom";
import "../../../style/music.scss";

const Music = () => {
    const [musicList, setMusicList] = useState([]);
    const [search, setSearch] = useState("");  

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    const onSearch = async (e) => {
        console.log("검색 실행됨");
        const value = e.target.value;
        setSearch(value);

        if (!value.trim()) {
            setMusicList([]);
            return;
        }

        setLoading(true);
        try {
            const response = await jaxios.get('/api/music/getSearch', {
                params: { key: value }
                
            });
            console.log("백엔드 검색 응답:", response.data.music);

            let filteredMusic = (response.data.music || []).filter((music) => {      
                const title = music.title?.toLowerCase() || "";
                return title.includes(value.toLowerCase());
            });
    
            // ✅ 가수 데이터도 리스트에 포함 (노래 없음 처리)
            // let filteredArtists = (response.data.artist || []).map((artist) => ({
            //     artistName: artist.artistName,
            //     title: "노래 없음", // 가수만 검색될 경우
            //     albumTitle: "-",
            //     genre: "-",
            //     image: artist.image || "/images/default_artist.jpg",
            //     bucketPath: null
            // }));
    
            // ✅ 가수와 노래 데이터 합치기
            // let mergedList = [...filteredMusic, ...filteredArtists];
    
            console.log("🔍 필터링된 음악 리스트:", filteredMusic); // 디버깅용 로그
    
            setMusicList(filteredMusic);
        } catch (error) {
            console.error('음악 목록을 불러오지 못했습니다:', error);
        }
        setLoading(false);
    };




    


    return (
        <div className={"musicPage"}>          
            <div className="musicContent">
            <h1>음원 관리</h1>
                <div className='top2' >
                <input type="text" className="searchInput" placeholder="음원 검색 (노래, 가수)" value={search} onChange={onSearch}/>
                <button className="addMusicButton" onClick={() => navigate("/AddAlbum")}>앨범 추가</button>   
                </div>
                {loading && <p>로딩 중...</p>}
                    <table>
                        <thead>
                            <tr>
                                <th>가수</th>
                                <th>앨범</th>
                                <th>노래</th>                         
                                <th>장르</th>
                                <th>이미지</th>
                                <th>재생</th>
                            </tr>
                        </thead>
                        <tbody>

                            {musicList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="noData">검색된 음원이 없습니다.</td>
                                </tr>
                            ) : (
                                musicList.map((music, index) => (
                                        <tr key={index}>
                                            <td>{music.artistName}</td>
                                            <td>
                                                <span className="clickable" onClick={() => navigate(`/UpdateAlbum/${music.albumId}`)}>
                                                    {music.albumTitle}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="clickable" onClick={() => navigate(`/UpdateAlbum/${music.albumId}`)}>
                                                {music.title}
                                                </span>  
                                            </td>             
                                            <td>{music.genre}</td>
                                            <td><img src={music.image} alt={music.title} width="50" /></td>
                                            <td>
                                                {music.bucketPath ? (
                                                    <audio controls>
                                                        <source src={music.bucketPath} type="audio/mpeg" />
                                                        브라우저가 오디오 태그를 지원하지 않습니다.
                                                    </audio>
                                                ) : (
                                                    "파일 없음"
                                                )}
                                            </td>
                                            <td>                                               
                                            </td>
                                        </tr>
                                    ))                      
                                )}

                        </tbody>
                    </table>                 

            </div>  
        </div>
    );
};

export default Music
