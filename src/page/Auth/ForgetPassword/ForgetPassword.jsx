/* eslint-disable react/no-unescaped-entities */
import forgetPasswordImage from "../../../assets/auth/forget.png";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "antd";
import CustomInput from "../../../utils/CustomInput";
import { HiOutlineMail } from "react-icons/hi";
import { useForgotPasswordMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submit = async (values) => {
    try {
      const res = await forgotPassword(values);
      if (res.error) {
        toast.error(res?.error?.data?.message);
      }
      if (res.data) {
        toast.success(res.data.message);
        navigate(`/auth/otp/${values?.email}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full  h-full md:h-screen md:flex justify-around ">
      <div className="w-full max-w-7xl mx-auto rounded-md h-[70%] md:my-28 grid grid-cols-1 md:grid-cols-2 place-content-center px-5 py-10 gap-8 md:mx-10">
        <div className="hidden md:block">
          <img
            src={forgetPasswordImage}
            className="w-full h-[444px] mx-auto"
            alt="Forgot Password Illustration"
          />
        </div>
        <div className="px-4 md:px-8 py-4 md:py-6 lg:py-16 bg-[#FF9E1C] rounded-md">
          <div className="mb-5 space-y-5">
            <h1 className="font-semibold text-white text-2xl flex items-center gap-2">
              {/* <Link to="/auth">
              <IoIosArrowBack />
            </Link> */}
              Forgot Password
            </h1>
            <h1 className="text-xl text-white">
              Enter the email address associated with your account. We'll send
              you an verification code to your email.
            </h1>
          </div>

          {/* Ant Design Form */}
          <Form
            layout="vertical"
            onFinish={submit} // Ant Design form submission
            initialValues={{ email: "" }} // Set initial form values
          >
            {/* CustomInput wrapped in Form.Item for validation */}
            <Form.Item
              label={<span className="text-white">Email</span>}
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <CustomInput icon={HiOutlineMail} placeholder="Email" />
            </Form.Item>

            {/* CustomButton for submit */}
            <Form.Item>
              <Button
                htmlType="submit"
                loading={isLoading}
                border
                size="large"
                type="submit"
                className="w-full text-[#FF9E1C] font-semibold bg-white"
              >
                Send Verification Code
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
