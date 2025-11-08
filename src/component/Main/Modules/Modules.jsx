import { GoPlus } from "react-icons/go";

// Import your images
import m1 from "../../../assets/Modules/image 5.png";
import m2 from "../../../assets/Modules/image 6.png";
import m3 from "../../../assets/Modules/image 7.png";
import m4 from "../../../assets/Modules/image 8.png";
import m5 from "../../../assets/Modules/image 9.png";
import m6 from "../../../assets/Modules/image 10.png";
import m7 from "../../../assets/Modules/image 11.png";
import m8 from "../../../assets/Modules/image 12.png";


const Modules = () => {
  const data = [
    {
      id: 1,
      image: m1,
      title: "Internet Safety and Wellbeing",
    },
    {
      id: 2,
      image: m2,
      title: "Critical Media Literacy",
    },
    {
      id: 3,
      image: m3,
      title: "Social Boundaries",
    },
    {
      id: 4,
      image: m4,
      title: "Respectful Communication",
    },
    {
      id: 5,
      image: m5,
      title: "Passwords and Privacy",
    },
    {
      id: 6,
      image: m6,
      title: "Independent Problem-Solving",
    },
    {
      id: 7,
      image: m7,
      title: "Digital Judgment",
    },
    {
      id: 8,
      image: m8,
      title: "Balancing Screen Time",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Modules List</h2>
        <a href="/CreateModules">
        <button className="flex items-center space-x-2 bg-[#FF9E1C] text-white px-4 py-2 rounded-lg hover:bg-[#e8900f] transition-colors">
          <GoPlus className="text-xl" />
          <span>Add Modules</span>
        </button>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full md:max-w-5xl">
        {data.map((module) => (
          <div
            key={module.id}
            className="flex items-center space-x-3 bg-[#FDD6D640] p-4 rounded-lg border border-[#D8D8D8] "
          >
            <img
              src={module.image}
              alt={module.title}
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm font-medium text-gray-800">
              {module.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modules;