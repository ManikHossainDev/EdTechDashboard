import { Form } from "antd";
import { useEffect, useState, useRef } from "react";
import { IoChevronBack, IoCameraOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadImageMutation,
} from "../../../redux/features/profile/profileApi";
import CustomButton from "../../../utils/CustomButton";
import CustomInput from "../../../utils/CustomInput";
import { RiEdit2Line } from "react-icons/ri";

const EditInformation = () => {
  const [form] = Form.useForm();
  const { data } = useGetUserQuery();

  const [updateProfileInfo, { isLoading }] = useUpdateUserMutation();
  const [uploadImage] = useUploadImageMutation();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [imageUrl, setImageUrl] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  /* ---------------- Load user data ---------------- */
  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        fullName: data.data.fullName,
        email: data.data.email,
      });

      setImageUrl(data?.data?.profile?.profilePicture?.url || null);
    }
  }, [data, form]);

  /* ---------------- Image upload on select ---------------- */
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setImageUploading(true);
      const res = await uploadImage(formData).unwrap();
      console.log(res);
      if (res?.data?.code === 200) {
        toast.success("Profile picture updated");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  /* ---------------- Update user info ---------------- */
  const onFinish = async (values) => {
    try {
      const payload = {
        fullName: values.fullName,
      };

      const res = await updateProfileInfo(payload).unwrap();
      if (res?.data.code === 200) {
        toast.success("Profile updated successfully!");
        navigate("/personal-info");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Profile update failed");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center my-6">
        <Link to="/personal-info">
          <IoChevronBack className="text-2xl" />
        </Link>
        <h1 className="text-2xl font-semibold ml-2">Edit Information</h1>
      </div>

      <div className="max-w-xl px-2">
        {/* Profile Image */}
        <div className="flex items-center mt-10">
          <div
            onClick={handleDivClick}
            className="relative w-32 h-32 cursor-pointer"
          >
            {imageUrl ? (
              <div>
                <img
                  src={imageUrl}
                  alt="profile"
                  className="w-full h-full rounded-md object-cover relative"
                />
                <div className="bg-[#FF9E1C] p-1 rounded-md inline-block absolute bottom-0 right-0">
                  <RiEdit2Line size={18} />
                </div>
              </div>
            ) : (
              <div className="bg-[#c6dadc] flex flex-col items-center justify-center rounded-full w-full h-full text-white">
                <IoCameraOutline size={40} />
                <span>Upload</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/70 rounded-md flex items-center justify-center opacity-0 hover:opacity-100 transition">
              <p className="text-white text-sm">
                {imageUploading ? "Uploading..." : "Change Image"}
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="ml-5">
            <h1 className="text-gray-500">{data?.data?.fullName}</h1>
            <h1 className="font-semibold uppercase">{data?.data?.authRole}</h1>
          </div>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-10"
        >
          <Form.Item label="Full Name" name="fullName">
            <CustomInput placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <CustomInput readOnly />
          </Form.Item>

          <CustomButton
            loading={isLoading}
            className="w-full text-black font-semibold"
          >
            Save & Change
          </CustomButton>
        </Form>
      </div>
    </div>
  );
};

export default EditInformation;
