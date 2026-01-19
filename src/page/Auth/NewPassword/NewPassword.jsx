import changePasswordImage from "../../../assets/auth/changePassword.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Button, Form } from "antd"; // Import Ant Design Form
import CustomInput from "../../../utils/CustomInput";
import { toast } from "sonner";
import { useResetPasswordMutation } from "../../../redux/features/auth/authApi";

const NewPassword = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  console.log(email);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const submit = async (values) => {
    const { password, confirmPassword } = values;

    try {
      const res = await resetPassword({
        password: password,
        confirmPassword: confirmPassword,
      });
      if (res.error) {
        toast.error(res.error.data.message);
      }
      if (res.data) {
        toast.success(res.data.message);
        navigate("/auth");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full h-full md:h-screen md:flex justify-around ">
      <div className="w-full max-w-7xl mx-auto rounded-md h-[70%] md:my-28 grid grid-cols-1 md:grid-cols-2 place-content-center px-5 py-10 gap-8  md:mx-10">
        <div className="hidden md:block">
          <img
            src={changePasswordImage}
            className="w-full h-[80%] mx-auto"
            alt="Change Password Illustration"
          />
        </div>
        <div className="px-4 md:px-8 py-4 md:py-6  md:h-[80%] bg-[#FF9E1C] rounded-md">
          <div className="mb-5">
            <h1 className="text-white font-semibold text-xl flex items-center gap-2">
              <Link to="/auth/otp">
                <IoIosArrowBack />
              </Link>
              Update Password
            </h1>
          </div>

          {/* Ant Design Form */}
          <Form
            layout="vertical"
            onFinish={submit} // Ant Design's form submission handler
            initialValues={{ password: "", confirmPassword: "" }} // Initial values
          >
            {/* CustomInput wrapped inside Form.Item for validation */}
            <Form.Item
              label={<span className="text-white">New Password</span>}
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your new password",
                },
              ]}
            >
              <CustomInput isPassword type="password" placeholder="Password" />
            </Form.Item>

            <Form.Item
              label={<span className="text-white">Confirm Password</span>}
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <CustomInput
                isPassword
                type="password"
                placeholder="Confirm Password"
              />
            </Form.Item>

            {/* CustomButton for submission */}
            <Form.Item>
              <Button
                htmlType="submit"
                size="large"
                loading={isLoading}
                border
                className="w-full text-[#FF9E1C] bg-white"
              >
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
