/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Form, Modal, Switch } from "antd";
import { MdKeyboardArrowRight } from "react-icons/md";
import OTPInput from "react-otp-input";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../../utils/CustomInput";
import CustomButton from "../../../utils/CustomButton";
import { useState } from "react";
import { useChangePasswordMutation } from "../../../redux/features/profile/profileApi";

import { toast } from "sonner";

const Settings = () => {
  // const { user } = useSelector(state => state?.auth)
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelTitle, setModelTitle] = useState("");
  const [form] = Form.useForm();
  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };
  const settingsItem = [
    // {
    //   title: "Personal Information",
    //   path: "personal-info",
    // },
    {
      title: "Change password",
      path: "change-password",
    },
    {
      title: "Privacy Policy",
      path: "privacy-policy",
    },
    {
      title: "Terms & Conditions",
      path: "terms-conditions",
    },
    {
      title: "About us",
      path: "about-us",
    },
    {
      title: "Contact Us",
      path: "ContactUs",
    },
    {
      title: "FAQ",
      path: "FAQ",
    },
  ];

  const handleNavigate = (value) => {
    if (value === "notification") {
      return;
    } else if (value === "change-password") {
      setModelTitle("Change password");
      setIsModalOpen(true);
    } else {
      navigate(`/settings/${value}`);
    }
  };

  const [updatePassword] = useChangePasswordMutation();

  const handleChangePassword = async (values) => {
    const { oldPassword, newPassword, reenterPassword } = values;
    try {
      const result = await updatePassword({
        currentPassword: oldPassword,
        password: newPassword,
        confirmPassword: reenterPassword,
      });
      if (result?.error) {
        toast.error(result?.error?.data?.message || "Something went wrong");
      }
      if (result?.data) {
        setIsModalOpen(false);
        form.resetFields();
        toast.success
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full py-6 grid grid-cols-1  md:grid-cols-2 gap-5 px-3">
      {settingsItem.map((setting, index) => (
        <div
          key={index}
          className="w-full p-2 mb-2 text-sm rounded-lg border border-[#717171] bg-[#FEFEFE] flex items-center justify-between cursor-pointer "
          onClick={() => handleNavigate(setting.path)}
        >
          <h2 className="text-xl">{setting.title}</h2>
          <h2>
            {setting.path === "notification" ? (
              <Switch defaultChecked onChange={onChange} />
            ) : (
              <MdKeyboardArrowRight size={40} />
            )}
          </h2>
        </div>
      ))}
      <Modal
        title={
          <div
            onClick={() => setIsModalOpen(false)}
            className="flex bg-primary items-center cursor-pointer text-black"
          >
            <h1 className="text-xl  font-medium  mb-5">{modelTitle}</h1>
          </div>
        }
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        centered
      >
        {modelTitle === "Change password" && (
          <div className="w-full px-5 ">
            <p className="text-[14px] mb-[14px]">
              Your password must be 8-10 character long.
            </p>
            <Form
              form={form}
              name="dependencies"
              autoComplete="off"
              style={{
                maxWidth: 600,
              }}
              layout="vertical"
              className="space-y-4 fit-content object-contain"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "Please Input Your Old Password!",
                  },
                ]}
              >
                <CustomInput placeholder="Enter Your old Password" isPassword />
              </Form.Item>

              <Form.Item
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please Input Your New Password!",
                  },
                ]}
              >
                <CustomInput placeholder="Set Your New Password" isPassword />
              </Form.Item>

              {/* Field */}
              <Form.Item
                name="reenterPassword"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: "Please Input Your Re-enter Password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <CustomInput placeholder="Re-enter password" isPassword />
              </Form.Item>
              <p className=" text-secondary font-medium">
                <a href="/auth/forget-password">
                  <h1 className="underline text-blue-500"> Forget Password</h1>
                </a>
              </p>
              <Form.Item className="w-full">
                <CustomButton className="w-full">Update Password</CustomButton>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Settings;
