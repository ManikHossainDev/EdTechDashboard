import signinImage from "../../../assets/auth/signIn.png";
import { Link, useNavigate } from "react-router-dom";
import { Form, Checkbox, Button } from "antd";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import CustomInput from "../../../utils/CustomInput";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { loggedUser } from "../../../redux/features/auth/authSlice";

const SignIn = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res)
      console.log(res?.data?.user)
      if(res?.code === 200){
         dispatch(
        loggedUser({
          token: res?.data?.accessToken,
          user: res?.data?.user,
        })
      );
       toast.success(res?.message || "Login successful");
       navigate("/");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full h-full md:h-screen md:flex justify-around">
      <div className="w-full max-w-7xl mx-auto rounded-md h-[70%] md:my-28 grid grid-cols-1 md:grid-cols-2 place-content-center px-5 py-10 md:mx-10">
        
        {/* Left Image */}
        <div className="bg-[#ffffff] hidden md:block">
          <img
            src={signinImage}
            className="w-full h-full mx-auto"
            alt="Sign in illustration"
          />
        </div>

        {/* Right Form */}
        <div className="px-4 md:px-8 py-4 bg-[#FF9E1C] rounded-md">
          <div className="mb-8 lg:mt-16">
            <h1 className="font-semibold text-3xl text-white text-center">
              Hello, Welcome!
            </h1>
            <p className="text-white text-center text-sm md:text-md">
              Please Enter Your Details Below to Continue
            </p>
          </div>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
          >
            {/* Email */}
            <Form.Item
              label={<span className="text-white">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "The input is not a valid email!" },
              ]}
            >
              <CustomInput
                type="email"
                icon={HiOutlineMail}
                placeholder="Enter Email"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label={<span className="text-white">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <CustomInput
                type="password"
                icon={HiOutlineLockClosed}
                placeholder="Enter Password"
                isPassword
              />
            </Form.Item>

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center mb-4">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>
                  <span className="text-white">Remember me</span>
                </Checkbox>
              </Form.Item>

              <Link
                to="/auth/forget-password"
                className="underline text-white"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Form.Item>
              <Button
                htmlType="submit"
                size="large"
                loading={isLoading}
                className="w-full text-[#FF9E1C] text-md font-semibold"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
