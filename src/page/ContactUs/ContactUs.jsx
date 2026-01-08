import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import CustomButton from "../../utils/CustomButton";
import { useGetSettingContentWithTypeQuery } from "../../redux/features/setting/settingApi";
// import { useGetAboutUsQuery } from "../../redux/features/setting/settingApi";
// Importing Spin

const ContactUs = () => {
  const { data: contactUs } = useGetSettingContentWithTypeQuery("contact_us");

  console.log(contactUs);

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex  items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Contact Us</h1>
        </div>
        <Link to={"/settings/ContactUs/11"}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>

      {/* Show Spin loader if data is loading */}

      <div>
        {contactUs ? (
          <div
            className="text-lg text-black px-5 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: contactUs.content }}
          />
        ) : (
          <p className="text-lg text-black px-5">Loading privacy policy...</p>
        )}
      </div>
    </section>
  );
};

export default ContactUs;
