/* eslint-disable no-unused-vars */
import { useState } from "react";
import { ConfigProvider, Modal, Table, Form, Input, Avatar } from "antd";
import moment from "moment";
import { IoEyeSharp } from "react-icons/io5";
import { useGetAllParentsQuery } from "../../../redux/features/parents/parents";

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, isLoading, isFetching } = useGetAllParentsQuery({
    page: currentPage,
    limit,
    search: searchText,
  });

  console.log(data);

  const parents = data?.data || [];
  const meta = data?.meta || {};

  const handleView = (record) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const dataSource = parents.map((item, index) => ({
    key: item.id,
    si: (currentPage - 1) * limit + index + 1,
    ...item,
  }));

  const columns = [
    {
      title: "#SI",
      dataIndex: "si",
    },
    {
      title: "Parent Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.profilePicture}
            alt="image"
            className="w-[50px] h-[50px] rounded-md"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => text || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text) => text || "N/A",
    },
    {
      title: "Children",
      dataIndex: "childrenNames",
      render: (children) => (children?.length ? children.join(", ") : "N/A"),
    },
    {
      title: "Joined Date",
      dataIndex: "joinedAt",
      render: (date) => (date ? moment(date).format("DD MMM YYYY") : "N/A"),
    },
    {
      title: "Action",
      render: (_, record) => (
        <IoEyeSharp
          size={22}
          className="cursor-pointer"
          onClick={() => handleView(record)}
        />
      ),
    },
  ];

  return (
    <section className="px-4">
      <div className="flex justify-between items-center py-6">
        <h1 className="text-2xl font-semibold">Parents List</h1>

        <Form layout="inline">
          <Form.Item>
            <Input
              placeholder="Search parent"
              allowClear
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Form.Item>
        </Form>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#FF9E1C",
              headerColor: "#FFFFFF",
            },
          },
        }}
      >
        <Table
          loading={isLoading || isFetching}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            current: currentPage,
            pageSize: limit,
            total: meta.total,
            onChange: setCurrentPage,
          }}
          rowKey="key"
        />
      </ConfigProvider>

      {/* VIEW MODAL */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        width={500}
      >
        <div className="space-y-4">
          <div className="text-center">
            <Avatar size={80} src={selectedUser?.profilePicture}>
              {selectedUser?.name?.charAt(0)}
            </Avatar>
            <h2 className="text-xl font-semibold mt-2">{selectedUser?.name}</h2>
          </div>

          <p>
            <strong>Email:</strong> {selectedUser?.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedUser?.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {selectedUser?.address}
          </p>
          <p>
            <strong>Children Count:</strong> {selectedUser?.childrenCount}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {moment(selectedUser?.joinedAt).format("DD MMM YYYY")}
          </p>
        </div>
      </Modal>
    </section>
  );
};

export default Users;
