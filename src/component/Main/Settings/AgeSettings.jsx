import { Form, InputNumber, Button, Card, Spin, Empty, Alert } from "antd";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useGetAgeSettingsQuery, useUpdateAgeSettingsMutation } from "../../../redux/features/setting/settingApi";

const AgeSettings = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch current age settings
  const { data: ageSettings, isLoading, error, refetch } = useGetAgeSettingsQuery();

  // Update age settings mutation
  const [updateAgeSettings, { isLoading: isUpdating }] = useUpdateAgeSettingsMutation();

  // Populate form when data loads
  useEffect(() => {
    if (ageSettings) {
      form.setFieldsValue({
        minAge: ageSettings?.minAge || 8,
        maxAge: ageSettings?.maxAge || 13,
      });
    }
  }, [ageSettings, form]);

  const handleSubmit = async (values) => {
    try {
      const result = await updateAgeSettings(values);
      if (result?.error) {
        toast.error(result?.error?.data?.message || "Klarte ikke å oppdatere aldersinnstillinger");
      } else if (result?.data) {
        toast.success("Aldersinnstillinger oppdatert");
        setIsEditing(false);
        refetch();
      }
    } catch (err) {
      toast.error("En feil oppstod ved oppdatering av aldersinnstillinger");
      console.error(err);
    }
  };

  return (
    <div className="w-full py-6 px-3">
      <Card
        title={
          <h2 className="text-2xl font-semibold">
            Alderskontroll for børn - Innstillinger
          </h2>
        }
        extra={
          !isEditing && (
            <Button
              type="primary"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Rediger
            </Button>
          )
        }
        className="rounded-lg border border-[#717171]"
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert
            message="Feil"
            description={error?.data?.message || "Klarte ikke å hente aldersinnstillinger"}
            type="error"
            showIcon
          />
        ) : (
          <div className="space-y-6">
            <Alert
              message="Informasjon"
              description="Disse aldersgrensene gjelder når foreldrene lager en ny barneoppføring i systemet. Velgene godtar kun barn innenfor det angitte aldersintervallet."
              type="info"
              showIcon
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label="Minimum alder (år)"
                  name="minAge"
                  rules={[
                    {
                      required: true,
                      message: "Vennligst oppgi minimumsalder",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Minimum alder må være minst 1",
                    },
                    {
                      type: "number",
                      max: 99,
                      message: "Minimum alder kan ikke overskride 99",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="f.eks. 8"
                    disabled={!isEditing}
                    className="w-full"
                    min={1}
                    max={99}
                  />
                </Form.Item>

                <Form.Item
                  label="Maksimum alder (år)"
                  name="maxAge"
                  dependencies={["minAge"]}
                  rules={[
                    {
                      required: true,
                      message: "Vennligst oppgi maksimumalder",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Maksimum alder må være minst 1",
                    },
                    {
                      type: "number",
                      max: 99,
                      message: "Maksimum alder kan ikke overskride 99",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const minAge = getFieldValue("minAge");
                        if (!value || !minAge || value >= minAge) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Maksimumalder må være større enn eller lik minimumaalderen"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    placeholder="f.eks. 13"
                    disabled={!isEditing}
                    className="w-full"
                    min={1}
                    max={99}
                  />
                </Form.Item>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdating}
                    disabled={isUpdating}
                  >
                    Lagre endringer
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      refetch(); // Reset form to current values
                    }}
                    disabled={isUpdating}
                  >
                    Avbryt
                  </Button>
                </div>
              )}
            </Form>

            {!isEditing && ageSettings && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>Gjeldende aldersgrenser:</strong>
                </p>
                <p className="text-lg font-semibold text-blue-600 mt-2">
                  {ageSettings?.minAge} - {ageSettings?.maxAge} år
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-gray-600">
          <strong>Merknad:</strong> Endringer her vil påvirke kontrol av barns alder for alle nye registreringer og oppdateringer av barneprofiler.
        </p>
      </div>
    </div>
  );
};

export default AgeSettings;
