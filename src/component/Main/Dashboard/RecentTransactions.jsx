import { useState } from "react";
import { ConfigProvider, Modal, Space, Table, Avatar } from "antd";
import moment from "moment";
import { IoMdInformationCircleOutline } from "react-icons/io";

const RecentTransactions = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const showModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  const data = [
    {
      id: 1,
      accountID: 2010,
      image: { url: "https://randomuser.me/api/portraits/men/1.jpg" },
      transactionId: "TRX001",
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      email: "doe@example.com",
      phone: "123-456-7890",
      address: "123 Main St, New York, NY 10001",
      date: "2023-11-01",
    },
    {
      id: 2,
      accountID: 2010,
      image: { url: "https://randomuser.me/api/portraits/women/1.jpg" },
      transactionId: "TRX002",
      firstName: "Jane",
      lastName: "Smith",
      gender: "Female",
      email: "th@example.com",
      phone: "987-654-3210",
      address: "456 Oak Ave, Los Angeles, CA 90001",
      date: "2023-10-25",
    },
    {
      id: 3,
      accountID: 2020,
      image: { url: "https://randomuser.me/api/portraits/men/2.jpg" },
      transactionId: "TRX003",
      firstName: "Mike",
      lastName: "Brown",
      gender: "Male",
      email: "mikeb@example.com",
      phone: "555-123-4567",
      address: "789 Pine Rd, Chicago, IL 60601",
      date: "2023-10-20",
    },
    {
      id: 4,
      accountID: 2021,
      image: { url: "https://randomuser.me/api/portraits/women/2.jpg" },
      transactionId: "TRX004",
      firstName: "Emily",
      lastName: "Davis",
      gender: "Female",
      email: "emilyd@example.com",
      phone: "444-555-6666",
      address: "321 Elm St, Houston, TX 77001",
      date: "2023-11-05",
    },
    {
      id: 5,
      accountID: 2022,
      image: { url: "https://randomuser.me/api/portraits/men/3.jpg" },
      transactionId: "TRX005",
      firstName: "Chris",
      lastName: "Wilson",
      gender: "Male",
      email: "chrisw@example.com",
      phone: "111-222-3333",
      address: "654 Maple Dr, Phoenix, AZ 85001",
      date: "2023-11-10",
    },
  ];
  

  const columns = [
    {
      title: "#SL",
      dataIndex: "si",
      key: "si",
      sorter: (a, b) => a.si - b.si,
    },
    {
      title: "Name",
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email?.localeCompare(b.email),
      render: (text) => text || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone?.localeCompare(b.phone),
      render: (text) => text || "N/A",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address?.localeCompare(b.address),
      render: (text) => text || "N/A",
      responsive: ["lg"],
    },
    {
      title: "Joined Date Time",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: (text) => (text ? moment(text).format("DD MMM YYYY") : "N/A"),
      responsive: ["md"],
    },
    {
      title: "Action",
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
  

  const dataSource = data?.map((user, index) => ({
    key: user.id,
    si: index + 1,
    firstName: user?.firstName,
    lastName: user?.lastName,
    accountID: user?.accountID,
    gender: user?.gender,
    email: user?.email,
    phone: user?.phone,
    address: user?.address,
    imageUrl: user?.image?.url,
    date: user?.date,
  }));

  return (
    <div className="px-1 w-full col-span-full md:col-span-6 rounded-lg">
      <h2 className="font-semibold text-md pt-1 pl-1">
        New Parents 
      </h2>
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
              <Avatar src={selectedTransaction?.imageUrl} size={80} />
            </div>
            <h1 className="text-center text-2xl font-semibold my-2">
            Recent User Details
          </h1>
            <div className="flex justify-between py-3 border-b">
              <p>Transaction ID :</p>
              <p>{selectedTransaction?.key || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>First Name :</p>
              <p>{selectedTransaction?.firstName || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Last Name :</p>
              <p>{selectedTransaction?.lastName || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Gender :</p>
              <p>{selectedTransaction?.gender || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Email :</p>
              <p>{selectedTransaction?.email || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Phone:</p>
              <p>{selectedTransaction?.phone || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Address:</p>
              <p>{selectedTransaction?.address || "N/A"}</p>
            </div>
            <div className="flex justify-between ">
              <p>Date :</p>
              <p>
                {selectedTransaction?.date
                  ? moment(selectedTransaction.date).format("DD MMM YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecentTransactions;