import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { Button, Form } from "antd";

import CustomButton from "../../utils/CustomButton";
import {
  useGetSettingContentWithTypeQuery,
  useUpdateContentMutation,
} from "../../redux/features/setting/settingApi";

const EditTermsConditions = () => {
  const type = "terms_conditions";
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: termsConditions } = useGetSettingContentWithTypeQuery(type);
  const [updateTerms, { isLoading }] = useUpdateContentMutation();

  const [content, setContent] = useState("");

  useEffect(() => {
    if (termsConditions?.content) {
      setContent(termsConditions.content);
      form.setFieldsValue({ content: termsConditions.content });
    }
  }, [termsConditions, form]);

  const handleSubmit = async () => {
    const payload = {
      type,
      title: "Terms and Conditions",
      content,
    };

    try {
      const res = await updateTerms(payload).unwrap();

      if (res?.code === 200) {
        navigate("/settings/terms-conditions");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <section className="w-full min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 py-5">
        <Link to="/settings/terms-conditions">
          <IoChevronBack className="text-2xl" />
        </Link>
        <h1 className="text-2xl font-semibold">Edit Terms and Conditions</h1>
      </div>

      {/* Form */}
      <div className="p-6 rounded-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ content }}
        >
          <Form.Item name="content">
            <ReactQuill
              value={content}
              onChange={setContent}
              style={{ height: 300 }}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline", "strike"],
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                  ["blockquote", "code-block"],
                  ["link", "image", "video"],
                  [{ script: "sub" }, { script: "super" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["clean"],
                ],
              }}
            />
          </Form.Item>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-20">
            <Button
              onClick={() => navigate("/settings/terms-conditions")}
              className="px-5 py-5 rounded-lg"
            >
              Cancel
            </Button>

            <CustomButton
              htmlType="submit"
              loading={isLoading}
              className="px-6"
            >
              Update
            </CustomButton>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditTermsConditions;

// import { IoChevronBack } from "react-icons/io5";
// import { Link } from "react-router-dom";
// import { Button, Form } from "antd";
// import ReactQuill from "react-quill"; // Import React Quill
// import "react-quill/dist/quill.snow.css"; // Import Quill styles
// import { useState } from "react";
// import CustomButton from "../../utils/CustomButton";

// const EditTermsConditions = () => {
//   const type = "terms_conditions";

//   const [form] = Form.useForm();
//   const [content, setContent] = useState(
//     "<h1>Enter your 'Terms and Conditions' content here.</h1>"
//   ); // Default content for the Terms and Conditions section

//   const handleSubmit = () => {
//     console.log("Updated Terms and Conditions Content:", content);
//     // Handle form submission, e.g., update the Terms and Conditions in the backend
//   };

//   return (
//     <section className="w-full h-full min-h-screen ">
//       {/* Header Section */}
//       <div className="flex justify-between items-center py-5">
//         <div className="flex items-center">
//           <Link to="/settings/terms-conditions">
//             <IoChevronBack className="text-2xl" />
//           </Link>
//           <h1 className="text-2xl font-semibold">Edit Terms and Conditions</h1>
//         </div>
//       </div>

//       {/* Form Section */}
//       <div className="w-full p-6 rounded-lg ">
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           {/* React Quill for Terms and Conditions Content */}
//           <Form.Item name="content" initialValue={content}>
//             <ReactQuill
//               value={content}
//               onChange={(value) => setContent(value)}
//               modules={{
//                 toolbar: [
//                   [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header dropdown
//                   [{ font: [] }], // Font options
//                   [{ list: "ordered" }, { list: "bullet" }], // Ordered and bullet lists
//                   ["bold", "italic", "underline", "strike"], // Formatting options
//                   [{ align: [] }], // Text alignment
//                   [{ color: [] }, { background: [] }], // Color and background
//                   ["blockquote", "code-block"], // Blockquote and code block
//                   ["link", "image", "video"], // Link, image, and video upload
//                   [{ script: "sub" }, { script: "super" }], // Subscript and superscript
//                   [{ indent: "-1" }, { indent: "+1" }], // Indent
//                   ["clean"], // Remove formatting
//                 ],
//               }}
//               style={{ height: "300px" }} // Set the increased height
//             />
//           </Form.Item>

//           {/* Update Button */}
//           <div className="w-full flex justify-end mt-20 md:mt-16">
//             <Button
//               type="primary"
//               htmlType="submit"
//               icon={<i className="fas fa-sync-alt"></i>} // Example FontAwesome icon
//               className="mt-1 px-5 rounded-lg bg-gray-500 py-5  border-none"
//             >
//               Cancel
//             </Button>
//             <CustomButton className="p-1">Update</CustomButton>
//           </div>
//         </Form>
//       </div>
//     </section>
//   );
// };

// export default EditTermsConditions;
