import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { useEffect, useState } from "react";
import CustomButton from "../../utils/CustomButton";
import { Button, Form } from "antd";
import {
  useGetSettingContentWithTypeQuery,
  useUpdateContentMutation,
} from "../../redux/features/setting/settingApi";

const EditPrivacyPolicy = () => {
  const type = "privacy_policy";
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: privacyPolicy } = useGetSettingContentWithTypeQuery(type);
  const [updatePrivacy] = useUpdateContentMutation();
  const [content, setContent] = useState(privacyPolicy?.content);

  const handleSubmit = async () => {
    const format = {
      type,
      title: "Personvernpolicy",
      content,
    };

    try {
      const res = await updatePrivacy(format);

      if (res.data?.code == 200) {
        alert("Oppdatering fullført");
        navigate("/settings/privacy-policy");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setContent(privacyPolicy?.content);
  }, [privacyPolicy]);

  return (
    <section className="w-full h-full min-h-screen ">
      {/* Header Section */}
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center">
          <Link to="/settings/privacy-policy">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Rediger personvernpolicy</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-6 rounded-lg ">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* React Quill for Privacy Policy Content */}
          <Form.Item name="content" initialValue={content}>
            <ReactQuill
              value={content}
              onChange={(value) => setContent(value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header dropdown
                  [{ font: [] }], // Font options
                  [{ list: "ordered" }, { list: "bullet" }], // Ordered and bullet lists
                  ["bold", "italic", "underline", "strike"], // Formatting options
                  [{ align: [] }], // Text alignment
                  [{ color: [] }, { background: [] }], // Color and background
                  ["blockquote", "code-block"], // Blockquote and code block
                  ["link", "image", "video"], // Link, image, and video upload
                  [{ script: "sub" }, { script: "super" }], // Subscript and superscript
                  [{ indent: "-1" }, { indent: "+1" }], // Indent
                  ["clean"], // Remove formatting
                ],
              }}
              style={{ height: "300px" }} // Set the increased height
            />
          </Form.Item>

          {/* Update Button */}
          <div className="w-full flex justify-end mt-20 md:mt-16">
            <Button
              type="primary"
              htmlType="submit"
              icon={<i className="fas fa-sync-alt"></i>} // Example FontAwesome icon
              className="mt-1 px-5 rounded-lg bg-gray-500 py-5  border-none"
            >
              Avbryt
            </Button>
            <CustomButton className="p-1">Oppdater</CustomButton>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditPrivacyPolicy;
