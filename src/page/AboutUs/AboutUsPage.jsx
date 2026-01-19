import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import CustomButton from "../../utils/CustomButton";
import { useGetSettingContentWithTypeQuery } from "../../redux/features/setting/settingApi";
// import { useGetAboutUsQuery } from "../../redux/features/setting/settingApi";
// Importing Spin

const AboutUsPage = () => {
  const { data: aboutUs } = useGetSettingContentWithTypeQuery("about_us");
  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex  items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">About Us</h1>
        </div>
        <Link to={"/settings/edit-about-us/11"}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>

      {/* Show Spin loader if data is loading */}

      <div>
        {aboutUs ? (
          <div
            className="text-lg text-black px-5 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: aboutUs.content }}
          />
        ) : (
          <p className="text-lg text-black px-5">Loading privacy policy...</p>
        )}
      </div>
    </section>
  );
};

export default AboutUsPage;
