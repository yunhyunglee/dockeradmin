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

        const aggregateStats = (dataArray) => {
            return dataArray.reduce((acc, item) => {
                acc.malePlayCount += item.malePlayCount ?? 0;
                acc.femalePlayCount += item.femalePlayCount ?? 0;
                acc.unknownGenderPlayCount += item.unknownGenderPlayCount ?? 0;
                acc.teenPlayCount += item.teenPlayCount ?? 0;
                acc.twentiesPlayCount += item.twentiesPlayCount ?? 0;
                acc.thirtiesPlayCount += item.thirtiesPlayCount ?? 0;
                acc.fortiesPlayCount += item.fortiesPlayCount ?? 0;
                acc.fiftiesPlusPlayCount += item.fiftiesPlusPlayCount ?? 0;
                return acc;
            }, {
                malePlayCount: 0,
                femalePlayCount: 0,
                unknownGenderPlayCount: 0,
                teenPlayCount: 0,
                twentiesPlayCount: 0,
                thirtiesPlayCount: 0,
                fortiesPlayCount: 0,
                fiftiesPlusPlayCount: 0
            });
        };

    
        const data = Array.isArray(response.data) ? aggregateStats(response.data) : response.data;
        const totalGenderCount = data.malePlayCount + data.femalePlayCount + data.unknownGenderPlayCount || 1;
        const totalAgeCount = data.teenPlayCount + data.twentiesPlayCount + data.thirtiesPlayCount + data.fortiesPlayCount + data.fiftiesPlusPlayCount || 1;

        // ✅ 백분율 변환 함수
        const toPercentage = (value, total) => parseFloat(((value / total) * 100).toFixed(1));


        // ✅ 성별 데이터 세팅
        setGenderStats([
            { name: "남성", value: toPercentage(data.malePlayCount, totalGenderCount), color: "#3367f5" },
            { name: "여성", value: toPercentage(data.femalePlayCount, totalGenderCount), color: "#ff209a" },
            { name: "미확인", value: toPercentage(data.unknownGenderPlayCount, totalGenderCount), color: "#9E9E9E" },
        ]);

       // ✅ 연령대 데이터 세팅 (백분율 적용)
        setAgeStats([
            { name: "10대", value: toPercentage(data.teenPlayCount, totalAgeCount), color: "#FF9800" },
            { name: "20대", value: toPercentage(data.twentiesPlayCount, totalAgeCount), color: "#2196F3" },
            { name: "30대", value: toPercentage(data.thirtiesPlayCount, totalAgeCount), color: "#673AB7" },
            { name: "40대", value: toPercentage(data.fortiesPlayCount, totalAgeCount), color: "#992d2d" },
            { name: "50대 이상", value: toPercentage(data.fiftiesPlusPlayCount, totalAgeCount), color: "#9E9E9E" },
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

        if (viewType === "daily") return ` ${month}월 이용자 성비`;
        if (viewType === "monthly") return ` ${year}년 이용자 성비`;
        return ` 최근 10년 이용자 성비`;
    }, [viewType, date]);

    const ageTitle = useMemo(() => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        if (viewType === "daily") return ` ${month}월 이용자 연령비`;
        if (viewType === "monthly") return ` ${year}년 이용자 연령비`;
        return ` 최근 10년 이용자 성비`;
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
                <Pie 
                    data={genderStats} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.65; // ✅ 중앙 위치 조정
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            
                        return percent > 0.05 ? ( // ✅ 너무 작은 값은 표시 안 함
                            <text
                                x={x}
                                y={y}
                                fill="white"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="14px"
                                fontWeight="bold"
                            >
                                {`${(percent * 100).toFixed(1)}%`}
                            </text>
                        ) : null;
                    }}
                >
                    {genderStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => `${value}%`} />
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
                <Pie 
                data={ageStats} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.65; // ✅ 중앙 위치 조정
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
        
                    return percent > 0.05 ? ( // ✅ 너무 작은 값은 표시 안 함
                        <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="14px"
                            fontWeight="bold"
                        >
                            {`${(percent * 100).toFixed(1)}%`}
                        </text>
                    ) : null;
                }}
            >
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
