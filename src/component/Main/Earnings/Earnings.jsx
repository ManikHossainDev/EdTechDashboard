import { useState, useEffect, useRef } from "react";
import { Table, Modal, ConfigProvider, Input } from "antd";
import { IoEyeSharp } from "react-icons/io5";
import { SearchOutlined } from "@ant-design/icons";
import { useGetEarningsQuery } from "../../../redux/features/earnings/earningsApi";

const Earnings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search input
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchText]);

  const { data: earningData, isLoading } = useGetEarningsQuery({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchText,
  });
  // Transform API data to match table structure
  const dataSource = (earningData || []).map((record, index) => ({
    key: record.id,
    id: index + 1,
    userName: record.user ? record.user.name : "Ikke tilgjengelig",
    transactionId: record.transactionId,
    amount: record.amount,
    dateTime: new Date(record.createdAt).toLocaleString(),
    avatarUrl:
      record.user?.profilePicture || "https://i.ibb.co.com/vC5KzDKV/images.jpg",
    rawRecord: record, // Store the original record for modal details
  }));

  const columns = [
    {
      title: "#Sl",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Brukernavn",
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
      title: "Transaksjons-ID",
      dataIndex: "transactionId",
      key: "transactionId",
      width: 200,
      render: (text) => (
        <div className="truncate max-w-[200px]" title={text}>
          {text}
        </div>
      ),
      sorter: (a, b) => a.transactionId.localeCompare(b.transactionId),
    },
    {
      title: "Beløp",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount) => <span className="font-medium">${amount}</span>,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Dato og klokkeslett",
      dataIndex: "dateTime",
      key: "dateTime",
      width: 150,
      sorter: (a, b) => new Date(a.dateTime) - new Date(b.dateTime),
    },
    {
      title: "Handling",
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
          <h1 className="text-2xl font-semibold text-gray-800">Inntekter</h1>
          <Input
            placeholder="Søk"
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
                current: currentPage,
                pageSize: pageSize,
                total: earningData?.total || 0,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                position: ["bottomRight"],
              }}
              loading={isLoading}
              scroll={{ x: "max-content" }}
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
                  Transaksjonsdetaljer
                </h2>
              </div>

              {/* Content */}
              <div className="py-6 space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Transaksjons-ID</span>
                  <span className="text-gray-800 font-semibold truncate max-w-[150px]">
                    {selectedRecord.rawRecord.transactionId}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Brukernavn</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedRecord.rawRecord.user
                      ? selectedRecord.rawRecord.user.name
                      : "Ikke tilgjengelig"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Bruker e-post</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedRecord.rawRecord.user
                      ? selectedRecord.rawRecord.user.email
                      : "Ikke tilgjengelig"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Status</span>
                  <span
                    className={`text-gray-800 font-semibold ${
                      selectedRecord.rawRecord.status === "completed"
                        ? "text-green-600"
                        : selectedRecord.rawRecord.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedRecord.rawRecord.status}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Betalingsmetode</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedRecord.rawRecord.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Betalingsgateway</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedRecord.rawRecord.paymentGateway}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Beskrivelse</span>
                  <span className="text-gray-800 font-semibold max-w-xs truncate">
                    {selectedRecord.rawRecord.description}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Dato og klokkeslett</span>
                  <span className="text-gray-800 font-semibold">
                    {new Date(
                      selectedRecord.rawRecord.createdAt
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Valuta</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedRecord.rawRecord.currency}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Beløp</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedRecord.rawRecord.currency}{" "}
                    {selectedRecord.rawRecord.amount}
                  </span>
                </div>

                {/* Amount Display */}
                <div className="bg-orange-50 rounded-lg p-6 text-center my-6">
                  <div className="text-3xl font-bold text-orange-600">
                    {selectedRecord.rawRecord.currency}{" "}
                    {selectedRecord.rawRecord.amount}
                  </div>
                  <div className="text-sm text-orange-500 mt-2">
                    Totalbeløp
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
