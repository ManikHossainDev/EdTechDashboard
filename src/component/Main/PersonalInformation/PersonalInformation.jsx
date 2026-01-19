import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
// import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { Form } from "antd";
import { useEffect } from "react";
import CustomInput from "../../../utils/CustomInput";
import { useGetUserQuery } from "../../../redux/features/profile/profileApi";

const PersonalInformation = () => {
  const { data } = useGetUserQuery();
  const [form] = Form.useForm();
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        fullName: data?.data?.fullName,
        email: data?.data?.email,
      });
    }
  }, [data, form]);
  return (
    <div className="w-full">
      {/* Back Button and Title */}
      <div className="flex justify-between items-center">
        <div className="flex  items-center my-6">
          <Link to="/">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Personal Information</h1>
        </div>
      </div>

      {/* Profile Information */}
      <div className="max-w-xl h-full grid grid-cols-1 px-2">
        {/* Profile Picture */}
        <div className="w-full h-full mt-10  flex justify-start items-center">
          <img
            className="size-32 rounded-md"
            // src={`${imageBaseUrl}${user?.image?.url}`}
            src={data?.data?.profile?.profilePicture?.url}
            alt=""
          />
          <div className="ml-5">
            <h1 className="mt-2 text-gray-500">{data?.data?.fullName}</h1>
            <h1 className="text-lg font-semibold uppercase">
              {data?.data?.authRole}
            </h1>
          </div>
        </div>

        {/* Personal Details */}
        <Form form={form} layout="vertical" className="w-full mt-10">
          {/* Full Name */}
          <Form.Item label="Full Name" name="fullName">
            <CustomInput placeholder="Enter your full name" readOnly />
          </Form.Item>

          {/* Email */}
          <Form.Item label="Email" name="email">
            <CustomInput placeholder="Enter your email" readOnly />
          </Form.Item>

          <Link to="/edit-personal-info">
            <button className="w-full px-8 py-3 bg-[#FF9E1C] font-semibold rounded-lg">
              Edit Profile
            </button>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default PersonalInformation;
