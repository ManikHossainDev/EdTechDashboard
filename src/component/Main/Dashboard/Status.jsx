

import Line from "../../../assets/auth/Line_up.png"

const Status = () => {


 
  const Alldata = [
    { title: "Total Parents", value:  700 },
    { title: "Total Children", value:  400 }, 
    { title: "Total Modules",value:   300 }, 
    { title: "Total Earnings", value: 200 }, 
  ];
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-7 px-2">
      {Alldata.map((item, idx) => (
        <div
          key={idx}
          className="w-full p-1 md:p-5 rounded-lg shadow-lg  border- border-l-4 border-[#FF9E1C] bg-[#FEFEFE]"
        >
          <h1 className="text-base lg:text-xl font-semibold text-[#222222]">
              {item.title}
            </h1>
          <h1 className="text-base lg:text-xl pt-1 font-semibold text-[#222222] ">
            {item.value}
          </h1>

          <h1 className="text-base lg:text-xl  py-1 text-[#222222] flex items-center space-x-1">
            <img src={Line} alt="line" /> <span  className="px-2 text-[#83D913]">5%</span>  <h1>increase from last month</h1>
          </h1>

        </div>
      ))}
    </div>
  );
};

export default Status;




