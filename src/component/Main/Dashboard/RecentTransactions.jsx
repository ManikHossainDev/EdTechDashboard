import { useState } from "react";
import { ConfigProvider, Modal, Space, Table, Avatar } from "antd";
import moment from "moment";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useGetNewParentsQuery } from "../../../redux/features/dashboard/dashboardApi";

const RecentTransactions = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { data: recentParents, isLoading } = useGetNewParentsQuery({
    limit: 10,
  });
  const showModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  const columns = [
    {
      title: "#SL",
      dataIndex: "si",
      key: "si",
      sorter: (a, b) => a.si - b.si,
    },
    {
      title: "Navn",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName?.localeCompare(b.firstName),
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.imageUrl} size={40} />
          <span>{`${record.firstName} ${record.lastName}`}</span>
        </div>
      ),
    },
    {
      title: "E-post",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email?.localeCompare(b.email),
      render: (text) => text || "Ikke tilgjengelig",
    },
    {
      title: "Adresse",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address?.localeCompare(b.address),
      render: (text) => text || "Ikke tilgjengelig",
      responsive: ["lg"],
    },
    {
      title: "Registrert dato",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: (text) => (text ? moment(text).format("DD MMM YYYY") : "Ikke tilgjengelig"),
      responsive: ["md"],
    },
    {
      title: "Handling",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <IoMdInformationCircleOutline
            onClick={() => showModal(record)}
            style={{ fontSize: "20px", cursor: "pointer" }}
            className="text-[#000]"
          />
        </Space>
      ),
      sorter: false,
    },
  ];

  const dataSource = (recentParents || [])?.map((user, index) => ({
    key: user.id,
    si: index + 1,
    firstName: user?.name.split(" ")[0] || user?.name, // Extract first name from full name
    lastName: user?.name.split(" ").slice(1).join(" ") || "", // Extract last name from full name
    accountID: user?.id,
    email: user?.email,
    address: user?.address,
    imageUrl:
      user?.profilePicture || "https://i.ibb.co.com/vC5KzDKV/images.jpg",
    date: user?.joinedAt,
    rawRecord: user, // Store the original record for modal details
  }));

  return (
    <div className="px-1 w-full col-span-full md:col-span-6 rounded-lg">
      <h2 className="font-semibold text-md pt-1 pl-1">Nye foreldre</h2>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#FF9E1C",
              headerColor: "#FFFFFF",
              headerBorderRadius: 5,
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 500 }}
          loading={isLoading}
        />
      </ConfigProvider>

      {/* Modal */}
      <Modal
        open={isModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={null}
        centered
        bodyStyle={{ padding: "15px" }}
      >
        <div className="text-black bg-primary">
          <div className="">
            <div className="flex justify-center mb-4">
              <Avatar
                src={
                  selectedTransaction?.rawRecord?.profilePicture ||
                  "https://i.ibb.co.com/vC5KzDKV/images.jpg"
                }
                size={80}
              />
            </div>
            <h1 className="text-center text-2xl font-semibold my-2">
              Detaljer om nylig bruker
            </h1>
            <div className="flex justify-between py-3 border-b">
              <p>Bruker-ID :</p>
              <p>{selectedTransaction?.rawRecord?.id || "Ikke tilgjengelig"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Navn :</p>
              <p>{selectedTransaction?.rawRecord?.name || "Ikke tilgjengelig"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>E-post :</p>
              <p>{selectedTransaction?.rawRecord?.email || "Ikke tilgjengelig"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Adresse:</p>
              <p>{selectedTransaction?.rawRecord?.address || "Ikke tilgjengelig"}</p>
            </div>
            <div className="flex justify-between ">
              <p>Registrert dato :</p>
              <p>
                {selectedTransaction?.rawRecord?.joinedAt
                  ? moment(selectedTransaction.rawRecord.joinedAt).format(
                      "DD MMM YYYY"
                    )
                  : "Ikke tilgjengelig"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecentTransactions;
