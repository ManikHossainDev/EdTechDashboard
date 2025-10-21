import { useState } from "react";
import { Table, Modal, ConfigProvider, Input } from "antd";
import { IoEyeSharp } from "react-icons/io5";
import { SearchOutlined } from "@ant-design/icons";

const Earnings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Mock data matching the screenshot
  const mockData = [
    {
      id: "01",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=1",
    },
    {
      id: "02",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=2",
    },
    {
      id: "03",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=3",
    },
    {
      id: "04",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=4",
    },
    {
      id: "05",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=5",
    },
    {
      id: "06",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=6",
    },
    {
      id: "07",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2022",
      avatarUrl: "https://i.pravatar.cc/50?img=7",
    },
    {
      id: "08",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2022",
      avatarUrl: "https://i.pravatar.cc/50?img=8",
    },
    {
      id: "09",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=9",
    },
    {
      id: "10",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=10",
    },
    {
      id: "11",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=11",
    },
    {
      id: "12",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=12",
    },
    {
      id: "13",
      userName: "Rohan",
      transactionId: "0350679",
      amount: 0,
      dateTime: "10-11-2025",
      avatarUrl: "https://i.pravatar.cc/50?img=13",
    },
  ];

  const dataSource = mockData
    .filter((record) =>
      record.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.transactionId.toLowerCase().includes(searchText.toLowerCase())
    )
    .map((record) => ({
      key: record.id,
      id: record.id,
      userName: record.userName,
      transactionId: record.transactionId,
      amount: record.amount,
      dateTime: record.dateTime,
      avatarUrl: record.avatarUrl,
    }));

  const columns = [
    {
      title: "#Sl",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: 180,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.avatarUrl}
            alt={text}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">{text}</span>
        </div>
      ),
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      width: 150,
      sorter: (a, b) => a.transactionId.localeCompare(b.transactionId),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount) => <span className="font-medium">${amount}</span>,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Date & Time",
      dataIndex: "dateTime",
      key: "dateTime",
      width: 150,
      sorter: (a, b) => new Date(a.dateTime) - new Date(b.dateTime),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <IoEyeSharp
          onClick={() => showModal(record)}
          style={{
            fontSize: "20px",
            cursor: "pointer",
          }}
          className="hover:scale-110 transition-transform"
        />
      ),
    },
  ];

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <section className="px-2">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mt-5 ">
          <h1 className="text-2xl font-semibold text-gray-800">Earnings</h1>
          <Input
            placeholder="Search"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: 250,
              borderRadius: "8px",
            }}
            className="shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="py-5">
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#FF9E1C",
                  headerColor: "#ffffff",
                  headerBorderRadius: 5,
                  borderRadiusLG: 8,
                },
              },
            }}
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{
                pageSize: 12,
                position: ["bottomRight"],
              }}
              scroll={{ x: "max-content"}}
              size="middle"
            />
          </ConfigProvider>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width={450}
        closable={true}
        style={{
          borderRadius: "16px",
        }}
      >
        <div className="text-black">
          {selectedRecord && (
            <div className="p-2">
              {/* Header */}
              <div className="text-center py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Transaction Details
                </h2>
              </div>

              {/* Content */}
              <div className="py-6 space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Transaction ID</span>
                  <span className="text-gray-800 font-semibold">
                    #{selectedRecord.transactionId}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">User Name</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedRecord.userName}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Date & Time</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedRecord.dateTime}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Amount</span>
                  <span className="text-gray-800 font-semibold">
                    ${selectedRecord.amount}
                  </span>
                </div>

                {/* Amount Display */}
                <div className="bg-orange-50 rounded-lg p-6 text-center my-6">
                  <div className="text-3xl font-bold text-orange-600">
                    ${selectedRecord.amount}
                  </div>
                  <div className="text-sm text-orange-500 mt-2">
                    Total Amount
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </Modal>
    </section>
  );
};

export default Earnings;