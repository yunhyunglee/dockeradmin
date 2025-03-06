import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddMusicModal from "./addMusicModal";
import axios from "axios";
import { format } from "date-fns";
import "../../../style/addAlbum.scss";
import jaxios from '../../../util/JwtUtil';

const AddAlbum = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [artist, setArtist] = useState([]);
    const [searchArtist, setSearchArtist] = useState(""); // 입력값 상태
    const [filteredArtists, setFilteredArtists] = useState([]); // 필터링된 가수 목록
    const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 표시 여부


    const onSearchChange = (e)=> {
        const value = e.target.value;
        setSearchArtist(value);

        if(value === ""){
            setFilteredArtists([]);
            setShowDropdown(false);
            return;
        }

        const filtered = artist.filter((a) => 
            a.artistName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredArtists(filtered);
        setShowDropdown(true);
    };

    const onSelectArtist = (selectedArtist) => {
        setNewAlbum((prev) => ({
            ...prev,
            artistId: selectedArtist.artistId,
            artistName: selectedArtist.artistName,
        }));
        setSearchArtist(selectedArtist.artistName);
        setShowDropdown(false);
    }





    const [newAlbum, setNewAlbum] = useState({
        title: "",
        image: "/images/default_image.jpg",
        albumId: null,
        artistId: null,
        musicList: [],
        indate: format(new Date(), "yyyy-MM-dd"),
        trackNumber: 0,
    });


    const onChange = (e) => {
        setNewAlbum({ ...newAlbum, [e.target.name]: e.target.value });
    };


    useEffect(() => {
        const getArtistList = async () => {
            try {
                const response = await jaxios.get("api/music/getAllArtist");
                setArtist(response.data.artist);
            } catch (error) {
                console.error("아티스트 목록 불러오기 실패", error);
            }
        };
        getArtistList();
    }, []);


    const onImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await jaxios.post("/api/music/imageUpload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setNewAlbum((prev) => ({ ...prev, image: response.data.image }));
        } catch (error) {
            console.error("이미지 업로드 실패", error);
            alert("이미지 업로드 실패");
        }
    };

    const addMusic = (newSong) => {
        setNewAlbum((prev) => {
            const maxTrackNumber = prev.musicList.length > 0 
            ? Math.max(...prev.musicList.map((song) => song.trackNumber)) 
            : 0;
            return {
                ...prev,
                musicList: [
                    ...prev.musicList,
                    {
                        ...newSong,
                        artistId: prev.artistId,
                        trackNumber: maxTrackNumber === 0 ? 1 : maxTrackNumber + 1 , 
                        image: newSong.image || prev.image,

                    },
                ],
            };
        });
        setShowModal(false);
    };

    const checkTitleMusic = (index) => {
        setNewAlbum((prev) => ({
            ...prev,
            musicList: prev.musicList.map((song, i) => ({
                ...song,
                titleMusic: i === index, 
            })),
        }));
    };

    const onSubmit = async () => {
        if (!newAlbum.title) return alert("앨범 제목을 입력하세요");
        if (!newAlbum.artistId) return alert("가수를 선택하세요");
        if (newAlbum.musicList.length === 0) return alert("노래를 추가하세요");

        try {
            let albumId = newAlbum.albumId;
            if (!albumId) {
                const albumResponse = await jaxios.post("/api/music/insertAlbum", {
                    title: newAlbum.title,
                    artist: { artistId: Number(newAlbum.artistId) }, // artistId 변환
                    image: newAlbum.image,
                });
                if(albumResponse.data.album) {
                    albumId = albumResponse.data.album.albumId;
                    setNewAlbum((prev) => ({ ...prev, albumId }));
                } else{
                    return alert("앨범 등록 실패");
                }
            }

            for (const music of newAlbum.musicList) {
                await jaxios.post("/api/music/insertMusic", {
                    ...music,
                    album: { albumId },
                    artist: { artistId: Number(newAlbum.artistId) }, // artistId 변환
                });
            }
            alert("음원이 등록되었습니다!");
            navigate("/musicController/album");
        } catch (error) {
            console.error("음원 등록 실패:", error);
            alert("등록 중 오류 발생");
        }
    };

    return (
        <div className="mainContainer">
            <div className="contentBox">
                <div className="topBox">
                    <div className="imageUploadContainer">
                        <input type="file" id="imageUpload" accept="image/*" onChange={onImageUpload} style={{ display: "none" }} />
                        <img src={newAlbum.image} alt="앨범 커버" className="albumCover"  onClick={() => document.getElementById("imageUpload").click()} />
                    </div>

                    <div className="musicInfo">
                        <input type="text"  name="title" value={newAlbum.title} onChange={onChange} placeholder="앨범 제목" />
                        <div className="artist-autocomplete">
                            <input
                                type="text"
                                placeholder="가수 검색"
                                value={searchArtist}
                                onChange={onSearchChange}
                                onFocus={() => setShowDropdown(true)} // 포커스 시 드롭다운 열기
                            />
                            {showDropdown && filteredArtists.length > 0 && (
                                <ul className="dropdown">
                                    {filteredArtists.map((a) => (
                                        <li key={a.artistId} onClick={() => onSelectArtist(a)}>
                                            {a.artistName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <input type="date" name="indate" value={newAlbum.indate} onChange={onChange} required />    

                    </div>
                </div>

                <div className="bottomBox">
                    <button className="addMusicBtn" onClick={() => setShowModal(true)}>+ 노래 추가</button>
                    {showModal && <AddMusicModal onClose={() => setShowModal(false)} onAddMusic={addMusic} albumId={newAlbum.albumId} artistId={newAlbum.artistId} />}                  
                </div>

                <table className="musicTable">
                    <thead>
                        <tr>
                            <th>타이틀</th>
                            <th>번호</th>
                            <th>제목</th>
                            <th>장르</th>
                            <th>파일</th>                          
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {newAlbum.musicList.length === 0 ? (
                            <tr>
                                <td colSpan="6">등록된 노래가 없습니다.</td>
                            </tr>
                        ) : (
                            
                            newAlbum.musicList.map((music, index) => (
                                <tr key={index}>
                                    <td><input type="checkbox"checked={music.titleMusic}onChange={() => checkTitleMusic(index)} />
                                    </td>
                                    <td>{music.trackNumber}</td>
                                    <td>{music.title}</td>
                                    <td>{music.genre}</td>
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="bottomBox">                
                    <button type="submit" className="btn submitBtn" onClick={onSubmit}>등록</button>
                    <button type="button" className="btn cancelBtn" onClick={() => navigate("/musicController/album")}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default AddAlbum;
