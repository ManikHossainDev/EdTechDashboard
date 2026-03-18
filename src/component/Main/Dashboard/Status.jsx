import Line from "../../../assets/auth/Line_up.png";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";

const Status = () => {
  const { data, isLoading, isError } = useGetDashboardStatusQuery();

  if (isLoading) return <p>Laster...</p>;
  if (isError) return <p>Noe gikk galt</p>;

  const dashboardData = [
    {
      title: "Totalt antall foreldre",
      value: data?.totalParents,
      growth: data?.monthlyGrowth?.parents?.percentageChange,
    },
    {
      title: "Totalt antall barn",
      value: data?.totalChildren,
      growth: data?.monthlyGrowth?.children?.percentageChange,
    },
    {
      title: "Totalt antall moduler",
      value: data?.totalModules,
      growth: 0, // backend এ module growth নাই
    },
    {
      title: "Totale inntekter",
      value: data?.totalEarnings,
      growth: data?.monthlyGrowth?.earnings?.percentageChange,
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-7 px-2">
      {dashboardData.map((item, idx) => (
        <div
          key={idx}
          className="w-full p-1 md:p-5 rounded-lg shadow-lg border-l-4 border-[#FF9E1C] bg-[#FEFEFE]"
        >
          <h1 className="text-base lg:text-xl font-semibold text-[#222222]">
            {item.title}
          </h1>

          <h1 className="text-base lg:text-xl pt-1 font-semibold text-[#222222]">
            {item.value ?? 0}
          </h1>

          <div className="text-sm py-1 text-[#222222] flex items-center space-x-1">
            <img src={Line} alt="line" />
            <span
              className={`px-2 ${
                item.growth > 0 ? "text-[#83D913]" : "text-red-500"
              }`}
            >
              {item.growth ?? 0}%
            </span>
            <span>økning fra forrige måned</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Status;
