import jaxios from '../../util/JwtUtil';
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar } from "recharts";
import "../../style/dashboard.scss";

const Dashboard = () => {
  const [streamingStats, setStreamingStats] = useState({ daily: [], monthly: [] });
  const [viewMode, setViewMode] = useState("daily");
  const [chartType, setChartType] = useState("bar"); 
  const [scale, setScale] = useState(1); 
  const [transitioning, setTransitioning] = useState(false); 

  useEffect(() => {
    fetchStreamingData();
  }, []);

  const handleScroll = (event) => {
    let newScale = scale - event.deltaY * 0.001;
    let clampedScale = Math.min(Math.max(newScale, 0.5), 1);
    
    setScale(clampedScale);
    setTransitioning(true);
    setTimeout(() => setTransitioning(false), 500);

    if (clampedScale < 0.7 && viewMode !== "daily") {
      setViewMode("daily");
      setTimeout(() => setScale(0.5), 300);
    } else if (clampedScale >= 0.7 && viewMode !== "monthly") {
      setViewMode("monthly");
      setTimeout(() => setScale(1), 300);
    }
  };

  const fetchStreamingData = async () => {
    try {
      console.log("📊 Mock 데이터 사용 중");

      const mockDailyData = Array.from({ length: 30 }, (_, i) => ({
        date: `2025-03-${String(i + 1).padStart(2, "0")}`,
        totalPlayCount: Math.floor(Math.random() * 1000) + 500,
      }));

      const mockMonthlyData = Array.from({ length: 12 }, (_, i) => ({
        date: `2025-${String(i + 1).padStart(2, "0")}`,
        totalPlayCount: Math.floor(Math.random() * 30000) + 10000,
      }));

      console.log("✅ Mock Daily Data:", mockDailyData);
      console.log("✅ Mock Monthly Data:", mockMonthlyData);

      setStreamingStats({ daily: mockDailyData, monthly: mockMonthlyData });
    } catch (error) {
      console.error("❌ Error fetching streaming data:", error);
    }
  };

  const getChart = () => {
    const data = viewMode === "daily" ? streamingStats.daily : streamingStats.monthly;

    switch (chartType) {
      case "line":
        return (
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 12 }} />
            <YAxis stroke="#555" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }} />
            <Legend wrapperStyle={{ paddingBottom: 10 }} />
            <Line type="monotone" dataKey="totalPlayCount" stroke="#ff7300" strokeWidth={3} />
            {/* <Line type="monotone" dataKey="totalPlayCount" stroke="#8884d8" strokeWidth={4} opacity={0.3} /> */}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={data}>
            <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 12 }} />
            <YAxis stroke="#555" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }} />
            <Legend wrapperStyle={{ paddingBottom: 10 }} />
            <Bar dataKey="totalPlayCount" fill="#ff7300" />
            {/* <Bar dataKey="totalPlayCount" fill="#8884d8" opacity={0.5} /> */}
          </BarChart>
        );

      default:
        return (
          <AreaChart data={data}>
            <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 12 }} />
            <YAxis stroke="#555" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }} />
            <Legend wrapperStyle={{ paddingBottom: 10 }} />
            <Area type="monotone" dataKey="totalPlayCount" stroke="#ff7300" fill="url(#colorDaily)" strokeWidth={3} />
            {/* <Area type="monotone" dataKey="totalPlayCount" stroke="#8884d8" fill="url(#colorMonthly)" strokeWidth={4} opacity={0.3} /> */}
            <defs>
              <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        );
    }
  };

  return (
    <div className="dashboard-container" onWheel={handleScroll}>
      <div className="dashboard-content">
      <h1 className={`dashboard-title`}>📊 관리자 대시보드</h1>

        {/* ✅ 일별/월별 선택 버튼 */}
        <div className="dashboard-controls">
        <button className={viewMode === "monthly" ? "active" : ""} onClick={() => setViewMode("monthly")}>월별</button>
          <button className={viewMode === "daily" ? "active" : ""} onClick={() => setViewMode("daily")}>일별</button>
          
        </div>

        {/* ✅ 차트 타입 선택 버튼 */}
        <div className="chart-controls">
          <button className={chartType === "area" ? "active" : ""} onClick={() => setChartType("area")}>영역 차트</button>
          <button className={chartType === "line" ? "active" : ""} onClick={() => setChartType("line")}>선형 차트</button>
          <button className={chartType === "bar" ? "active" : ""} onClick={() => setChartType("bar")}>막대 차트</button>
        </div>

        {/* ✅ 차트 렌더링 */}
        <Card>
          <CardContent className="chart-card" style={{ transform: `scale(${scale})`, transition: "transform 0.3s ease-in-out" }}>
            <h2 className="chart-title">📈 스트리밍 통계 ({viewMode === "daily" ? "일별" : "월별"})</h2>
            <ResponsiveContainer width="100%" height={400}>
              {getChart()}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  


  
};

export default Dashboard;
