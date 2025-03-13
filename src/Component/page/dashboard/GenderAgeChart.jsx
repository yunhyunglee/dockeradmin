import jaxios from "../../../util/JwtUtil";
import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import "../../../style/GenderAgeChart.scss";

const GenderAgeChart = ({ date, viewType}) => {
    const [genderStats, setGenderStats] = useState([]);  // 성별 비율 데이터
    const [ageStats, setAgeStats] = useState([]);        // 연령대 비율 데이터
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
    fetchDetailStats();
    }, [date, viewType]);

    useEffect(() => {

    }, [genderStats, ageStats]);

    const fetchDetailStats = async () => {
        try {
        setLoading(true);
        const dateStr = date.toISOString().split("T")[0];
        

        const response = await jaxios.get(`/api/stats/detail?type=${viewType}&date=${dateStr}`);
        console.log(`✅ ${viewType} 상세 데이터:`, response.data);
    
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
    



        // ✅ 성별 데이터 세팅
        setGenderStats([
            { name: "남성", value: data?.malePlayCount ?? 0, color: "#4CAF50" },
            { name: "여성", value: data?.femalePlayCount ?? 0, color: "#FF5722" },
            { name: "미확인", value: data?.unknownGenderPlayCount ?? 0, color: "#9E9E9E" },
        ]);

        // ✅ 연령대 데이터 세팅
        setAgeStats([
            { name: "10대", value: data?.teenPlayCount ?? 0, color: "#FF9800" },
            { name: "20대", value: data?.twentiesPlayCount ?? 0, color: "#2196F3" },
            { name: "30대", value: data?.thirtiesPlayCount ?? 0, color: "#673AB7" },
            { name: "40대", value: data?.fortiesPlayCount ?? 0, color: "#E91E63" },
            { name: "50대 이상", value: data?.fiftiesPlusPlayCount ?? 0, color: "#795548" },
        ]);

        } catch (error) {
        console.error("❌ 상세 데이터 가져오기 실패:", error);
        } finally {
        setLoading(false);
        }
    };

    const genderTitle = useMemo(() => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        if (viewType === "daily") return `👥 ${month}월 이용자 성비`;
        if (viewType === "monthly") return `📊 ${year}년 이용자 성비`;
        return `📊 최근 10년 이용자 성비`;
    }, [viewType, date]);

    const ageTitle = useMemo(() => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        if (viewType === "daily") return `📊 ${month}월 이용자 연령비`;
        if (viewType === "monthly") return `📊 ${year}년 이용자 연령비`;
        return `📊 최근 10년 이용자 성비`;
    }, [viewType, date]);





    return (
    <div className="gender-age-chart">
    {loading ? <p className="loading-text">📊 데이터 로딩 중...</p> : (
        <>
          {/* ✅ 성별 비율 차트 */}
        
        <div className="chart-section">
            <h2 className="chart-title">{genderTitle}</h2>
            {genderStats.some((d) => d.value > 0) && (
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={genderStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {genderStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                </Pie>
                <Legend />
                <Tooltip />
            </PieChart>
            </ResponsiveContainer>
            )}
        </div>

          {/* ✅ 연령대 비율 차트 */}
        <div className="chart-section">
            <h2 className="chart-title">{ageTitle}</h2>
            {ageStats.some((d) => d.value > 0) && (
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={ageStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {ageStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                </Pie>
                <Legend />
                <Tooltip />
            </PieChart>
            </ResponsiveContainer>
            )}
        </div>
        </>
    )}
    </div>
);
};

export default GenderAgeChart;
