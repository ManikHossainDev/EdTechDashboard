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
      title: "Vilkår og betingelser",
      content,
    };

    try {
      const res = await updateTerms(payload).unwrap();

      if (res?.code === 200) {
        navigate("/settings/terms-conditions");
      }
    } catch (error) {
      console.error("Oppdatering feilet:", error);
    }
  };

  return (
    <section className="w-full min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 py-5">
        <Link to="/settings/terms-conditions">
          <IoChevronBack className="text-2xl" />
        </Link>
        <h1 className="text-2xl font-semibold">Rediger vilkår og betingelser</h1>
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
              Avbryt
            </Button>

            <CustomButton
              htmlType="submit"
              loading={isLoading}
              className="px-6"
            >
              Oppdater
            </CustomButton>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditTermsConditions;
