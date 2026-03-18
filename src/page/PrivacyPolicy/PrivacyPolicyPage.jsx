import { IoChevronBack } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import CustomButton from "../../utils/CustomButton";
import { useGetSettingContentWithTypeQuery } from "../../redux/features/setting/settingApi";

const PrivacyPolicyPage = () => {
  const { data: privacyPolicy } =
    useGetSettingContentWithTypeQuery("privacy_policy");

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex  items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Personvernpolicy</h1>
        </div>
        <Link to={"/settings/edit-privacy-policy/11"}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Rediger</span>
          </CustomButton>
        </Link>
      </div>

      <div>
        {privacyPolicy ? (
          <div
            className="text-lg text-black px-5 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
          />
        ) : (
          <p className="text-lg text-black px-5">Laster inn personvernpolicy...</p>
        )}
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
