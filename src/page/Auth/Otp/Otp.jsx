import otpImage from "../../../assets/auth/otp.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import OTPInput from "react-otp-input";
import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  useForgotPasswordMutation,
  useVerifyEmailMutation,
} from "../../../redux/features/auth/authApi";
import { loggedUser } from "../../../redux/features/auth/authSlice";
import { toast } from "sonner";
import { Button } from "antd";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const { email } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch hook
  const [forgotPassword] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading }] = useVerifyEmailMutation();

  const handleOtpChange = (otpValue) => {
    setOtp(otpValue);
  };

  const handleMatchOtp = async () => {
    try {
      const res = await verifyOtp({
        email,
        otp: otp,
      });
      console.log(res)
      if (res.error) {
        toast.error(res?.error?.data?.message);
      }
      if (res.data) {
        // Extract the reset password token from the response
        const token = res?.data?.data?.resetPasswordToken;

        // Dispatch the token to the Redux store to set up headers globally
        if (token) {
          dispatch(loggedUser({
            token: token,
            user: null // Since this is for password reset, user info might not be available yet
          }));
        }

        toast.success(res?.data?.message);
        navigate(`/auth/new-password/${email}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleResendPassword = async () => {
    try {
      const res = await forgotPassword({ email });
      if (res.error) {
        toast.error(res?.error?.data?.message);
        console.log(res.error);
      }
      if (res.data) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full  h-full md:h-screen md:flex justify-around ">
    <div className="w-full max-w-7xl mx-auto rounded-md h-[70%] md:my-28 grid grid-cols-1 md:grid-cols-2 place-content-center px-1 md:px-5 py-15 gap-8 md:mx-10 ">
      <div className="hidden md:block">
        <img src={otpImage} className="w-full h-[461px] mx-auto" alt="" />
      </div>
      <div className="mt-16">
        <div className="px-4 md:px-8 py-4 md:py-6 lg:py-16 bg-[#FF9E1C] rounded-md">
            <div className="mb-5 space-y-5">
          <h1 className="font-semibold text-xl flex items-center gap-2 text-white">
            <Link to="/auth/forget-password">
              <IoIosArrowBack />
            </Link>
            Verify
          </h1>
          <h1 className="text-white">{`We'll send a verification code to your email. Check your inbox and enter the code here.`}</h1>
        </div>
        <OTPInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          containerStyle="otp-container"
          inputStyle={{
            width: "100%",
            maxWidth: "6.5rem",
            height: "3rem",
            margin: "0 0.5rem",
            fontSize: "2rem",
            fontWeight: "bold",
            borderBottom: "1px solid #4E4E4E",
            textAlign: "center",
            outline: "none",
          }}
        />
        <div onClick={handleMatchOtp} className="mt-5">
          <Button size="large" loading={isLoading} border className="w-full font-semibold text-[#FF9E1C] bg-white">
            Verify
          </Button>
        </div>
        <div className="flex justify-between items-center my-4 text-white">
          <h1>Didn’t receive code?</h1>
          <button onClick={handleResendPassword} className="text-white">
            Verify Code
          </button>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Otp;
