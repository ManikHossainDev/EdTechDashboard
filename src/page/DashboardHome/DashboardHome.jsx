import IncomeGraphChart from "../../component/Main/Dashboard/IncomeGraphChart";
import Piechart from "../../component/Main/Dashboard/Piechart";
import RecentTransactions from "../../component/Main/Dashboard/RecentTransactions";
import Status from "../../component/Main/Dashboard/Status";
const DashboardHome = () => {
  return (
    <section>
      <h1 className="text-base md:text-2xl ml-1 font-semibold py-3 px-3">Overview</h1>
      <div className="md:px-3">
        <Status />
    
        <div className="w-full h-full md:h-[50vh] my-5  flex flex-col md:gap-4 md:flex-row justify-between items-center ">
            {/* Left Column: Chart */}
            <div className="w-full lg:w-[74%]  rounded-lg p-1">
              <IncomeGraphChart />
            </div>
            
            {/* Right Column: Pie Chart */}
            <div className="w-full lg:w-[25%]">
              <Piechart />
            </div>
          </div>
        <RecentTransactions />
             <br /><br />
      </div>
    </section>
  );
};

export default DashboardHome;
