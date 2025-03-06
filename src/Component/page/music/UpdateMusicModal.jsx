import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../style/addMusicModal.scss";
import jaxios from '../../../util/JwtUtil';

const UpdateMusicModal = ({ onClose, music, updateMusicList }) => {
    const GENRES = ["록", "팝", "힙합&랩", "재즈", "클래식", "전자음악", "기타"];
    const Mood = ["happy", "sad", "angry", "boring", "nomal"];

    const artistId = music.artist ? music.artist.artistId : null;
    const albumId = music.album ? music.album.albumId : null;

    // 기존 데이터를 사용하여 초기 상태 설정
    const [updatedSong, setUpdatedSong] = useState({
        title: "",
        genre: GENRES[0],
        mood: Mood[0],
        lyrics: "",
        bucketPath: "",
    });

    // 기존 노래 정보를 불러와 상태 업데이트
    useEffect(() => {
        if (music) {
            setUpdatedSong({
                title: music.title || "",
                genre: music.genre || GENRES[0],
                mood: music.mood || Mood[0],
                lyrics: music.lyrics || "",
                bucketPath: music.bucketPath || "",
            });
        }
    }, [music]);

    const onChange = (e) => {
        setUpdatedSong({ ...updatedSong, [e.target.name]: e.target.value });
    };

    const onFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("music", file);
        try {
            const response = await jaxios.post("/api/music/musicUpload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.music) {
                setUpdatedSong((prev) => ({ ...prev, bucketPath: response.data.music }));
            }
        } catch (error) {
            console.error("음원 파일 업로드 실패:", error);
            alert("음원 업로드 실패");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!updatedSong.title.trim()) return alert("곡 제목을 입력해주세요.");
        if (!updatedSong.bucketPath) return alert("음원 파일을 업로드해주세요.");

        try {
            const response = await jaxios.post("/api/music/updateMusic", {
                musicId: music.musicId,
                title:  updatedSong.title,
                genre:  updatedSong.genre,
                mood:   updatedSong.mood,
                lyrics: updatedSong.lyrics,
                artist: { artistId },
                album: { albumId },
                bucketPath: updatedSong.bucketPath,
            });

            if (response.data.msg === "yes") {
                alert("음원 수정 완료");
                updateMusicList(); // 목록 갱신
                onClose();
            } else {
                alert("음원 수정 실패");
            }
        } catch (error) {
            console.error("음원 수정 오류", error);
            alert("음원 수정 중 오류 발생");
        }
    };

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h2>노래 수정</h2>
                <form onSubmit={onSubmit}>
                    <input type="text" name="title" value={updatedSong.title} onChange={onChange} placeholder="곡 제목" required />
                    
                    <select name="genre" value={updatedSong.genre} onChange={onChange} required>
                        {GENRES.map((genre) => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>
                    <select name="mood" value={updatedSong.mood} onChange={onChange} required>
                        {Mood.map((mood) => (
                            <option key={mood} value={mood}>
                                {mood}
                            </option>
                        ))}
                    </select>

                    <textarea name="lyrics" value={updatedSong.lyrics} onChange={onChange} placeholder="가사"></textarea>

                    <label>음원 파일 변경</label>
                    <input type="file" accept="audio/*" onChange={onFileUpload} />

                    <div className="modalActions">
                        <button type="submit">수정</button>
                        <button type="button" className="cancel" onClick={onClose}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateMusicModal;
