import StreamingChart from "./dashboard/StreamingChart";
import GenderAgeChart from "./dashboard/GenderAgeChart";
import { useNavigate } from "react-router-dom";
import "../../style/dashboard.scss";

const Dashboard = () => {

  const navigate = useNavigate();


  const handleChartClick = () => {
    navigate("/StreamingChart");
  };






  return (
      <div className="dashboard-container">
        <div className="dashboard-content">

          <h1 className="dashboard-title">📊 관리자 대시보드</h1>


          <StreamingChart isSmall={true} onClick={handleChartClick} />


        </div>
      </div>
  );
};

export default Dashboard;