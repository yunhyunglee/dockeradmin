import jaxios from "../../../util/JwtUtil";
import { useNavigate } from "react-router-dom";
import GenderAgeChart from "./GenderAgeChart";
import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale"; 
import "../../../style/StreamingChart.scss";

const StreamingChart = ({ isSmall = false, onClick  }) => {
  const [streamingStats, setStreamingStats] = useState([]);
  const [viewType, setViewType] = useState("daily"); // ✅ daily, monthly, yearly
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const selectDate = (date) => {
    setCurrentDate(date);
    setIsDatePickerOpen(false); // ✅ 선택 후 달력 닫기
  };

  const formattedDate = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });



  // ✅ startDate 및 endDate 계산 (일별일 때는 항상 1일부터 31일까지)
  const { startDate, endDate } = useMemo(() => {
    let startDate, endDate;
    

    switch (viewType) {
      case "daily":
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2); // 📌 매월 1일부터
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, );
        break;
      case "monthly":
        startDate = new Date(currentDate.getFullYear(), 0, 2);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      case "yearly":
        startDate = new Date(currentDate.getFullYear() - 10, 0, 2);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(currentDate);
        endDate = new Date(currentDate);
    }

    return { startDate, endDate };
  }, [viewType, currentDate]);

  // ✅ 차트 제목 설정 (연도, 월 추가)
  const chartTitle = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    if (viewType === "daily") return `📈 ${year}년 ${month}월 스트리밍 통계`;
    if (viewType === "monthly") return `📈 ${year}년 스트리밍 통계`;
    return `📈 최근 10년 스트리밍 통계`;
  }, [viewType, currentDate]);
  

  // ✅ 데이터 가져오기
  useEffect(() => {
    fetchStreamingData();
  }, [startDate, endDate, viewType]);

  

  const fetchStreamingData = async () => {
    try {
      setLoading(true);
      console.log("📊 백엔드 데이터 가져오는 중...");

      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];
      
      console.log(`📅 요청: ${viewType} | 기간: ${startDateStr} ~ ${endDateStr}`);

      const response = await jaxios.get( `/api/stats/daily?type=${viewType}&startDate=${startDateStr}&endDate=${endDateStr}`);

      


      console.log(`✅ ${viewType} 데이터:`, response.data);

      let stats = response.data.map((item) => ({
        date: item.date,
        totalPlayCount: item.totalPlayCount ?? 0,
      }));

      stats = ensureDataLength(stats);

      setStreamingStats(stats);
    } catch (error) {
      console.error("❌ 백엔드 데이터 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const ensureDataLength = (data) => {
    if (viewType === "daily") {
        return ensure31Days(data); // ✅ 31개 데이터 유지
    } else if (viewType === "monthly") {
        return ensure12Months(data); // ✅ 12개월 데이터 유지
    } else if (viewType === "yearly") {
        return ensure10Years(data); // ✅ 10년 데이터 유지
    }
    return data;
};



  // ✅ 31개 데이터 강제 유지
  const ensure31Days = (data) => {
    let result = [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    for (let i = 0; i < 31; i++) {
      const date = new Date(firstDay);
      date.setDate(i + 2);
      const dateStr = date.toISOString().split("T")[0];

      // 📌 데이터가 있으면 사용, 없으면 0으로 채우기
      const existingData = data.find((item) => item.date === dateStr);
      result.push({
        date: dateStr,
        totalPlayCount: existingData ? existingData.totalPlayCount : 0,
      });
    }

    return result;
  };


  // ✅ 12개월 유지 (월별)
  const ensure12Months = (data) => {
    let result = [];
    for (let i = 0; i < 12; i++) {
        const month = i + 1;
        const dateStr = `${currentDate.getFullYear()}-${month.toString().padStart(2, "0")}-01`;

        const existingData = data.find((item) => item.date.startsWith(`${currentDate.getFullYear()}-${month.toString().padStart(2, "0")}`));
        result.push({
            date: dateStr,
            totalPlayCount: existingData ? existingData.totalPlayCount : 0,
        });
    }
    return result;
  };


  // ✅ 10년 유지 (연도별)
  const ensure10Years = (data) => {
    let result = [];
    const startYear = currentDate.getFullYear() - 9;
    for (let i = 0; i < 10; i++) {
        const year = startYear + i;
        const dateStr = `${year}-01-01`;

        const existingData = data.find((item) => item.date.startsWith(`${year}`));
        result.push({
            date: dateStr,
            totalPlayCount: existingData ? existingData.totalPlayCount : 0,
        });
    }
    return result;
  };

  // ✅ 기간 이동 로직 (한 달 단위 이동)
  const changeDate = (delta) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);

      if (viewType === "daily") newDate.setMonth(newDate.getMonth() + delta);
      else if (viewType === "monthly") newDate.setFullYear(newDate.getFullYear() + delta);
      else newDate.setFullYear(newDate.getFullYear() + delta * 10);

      return newDate;
    });
  };

  // ✅ X축 날짜 형식 변경 (일자만 표시)
  const formatXAxis = (dateStr) => {
    if (viewType === "daily") {
      return dateStr.split("-")[2]; // "YYYY-MM-DD" → "DD"
    }else if(viewType === "monthly") {
      return dateStr.split("-")[1]; 
    }if(viewType === "yearly") {
      return dateStr.split("-")[0];  
    }
    return dateStr;
  };



  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (chartRef.current && !chartRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);








  return (
    <div className="background" >
      <div className="view-type-buttons">
          {["daily", "monthly", "yearly"].map((type) => (
            <button key={type} className={viewType === type ? "active" : ""} onClick={() => setViewType(type)}>
              {type === "daily" ? "일별" : type === "monthly" ? "월별" : "연도별"}
            </button>
          ))}
      </div>

      <div className= "chart-container ">
        <div className="chart-wrapper">
        <div className="pagination-controls">
        <button onClick={() => changeDate(-1)} className="pagination-btn">◀ 이전</button>
          <div className="chart-title-wrapper" onClick={toggleDatePicker}>             
            <span>{viewType === "daily" ? `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월` : `${currentDate.getFullYear()}년`}</span>          
              {isDatePickerOpen && (
                <div className="datepicker-wrapper">
                  <DatePicker 
                      selected={currentDate}
                      onChange={selectDate}
                      showMonthYearPicker // ✅ 월 단위 선택
                      inline // ✅ 화면에 고정
                      locale={ko} // ✅ 한국어 설정
                      dateFormat="yyyy년 MM월" // ✅ 연도 + 월 형식
                      onClickOutside={(e) => e.stopPropagation()} // ✅ 바깥 클릭 시 닫히는 문제 해결
                      onSelect={(date) => {
                          selectDate(date);
                          setIsDatePickerOpen(false); // ✅ 선택 후 닫히도록 설정
                      }}
                  />
                </div>          
              )}
          </div>
          <button onClick={() => changeDate(1)} className="pagination-btn">다음 ▶</button>
          </div>
            <ResponsiveContainer width="100%" height={300}>
              {loading ? <p className="loading-text">📊 데이터 로딩 중...</p> : (
                <BarChart data={streamingStats}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatXAxis} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }} />
                  <Legend />
                  <Bar dataKey="totalPlayCount" fill="#007bff" animationDuration={300} animationEasing="ease-out" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>     
      </div>
        <div className="GenderAgeChart">
        <GenderAgeChart date={currentDate} viewType={viewType} />
        </div>
    </div>        
    );
};

export default StreamingChart;
