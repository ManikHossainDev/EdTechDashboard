/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { ConfigProvider, Modal, Table, Form, Input, DatePicker, Avatar, Select } from "antd";
import moment from "moment";
import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";
import { IoEyeSharp } from "react-icons/io5";

const { Item } = Form;

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [user, setUser] = useState(null);
  const { data, isFetching, isError, error } = useGetAllUsersQuery();

  const handleView = (record) => {
    setUser(record);
    setIsModalViewOpen(true);
  };

  const [allUsers, setAllUsers] = useState([
    {
      id: 1,
      accountID: 2010,
      children:"Manik Hossain",
      firstName: "John Smith",
      lastName: "Doe",
      email: "johndoe@example.com",
      address_line1: "123 Main St, Springfield",
      image: { url: "https://randomuser.me/api/portraits/men/1.jpg" },
      phone: "123-456-7890",
      createdAt: "2024-01-01T10:00:00",
      status: "Only Registered",
      block: false,
    },
    {
      id: 2,
      children:"Manik Hossain",
      accountID: 2011,
      firstName: "Jane Smith",
      lastName: "Smith",
      email: "janesmith@example.com",
      address_line1: "456 Elm St, Springfield",
      image: { url: "https://randomuser.me/api/portraits/women/2.jpg" },
      phone: "987-654-3210",
      createdAt: "2024-02-01T14:30:00",
      status: "Active",
      block: true,
    },
    {
      id: 3,
      accountID: 2012,
      children:"Manik Hossain",
      firstName: "Alice Smith",
      lastName: "Johnson",
      email: "alicejohnson@example.com",
      address_line1: "789 Oak St, Springfield",
      image: { url: "https://randomuser.me/api/portraits/women/3.jpg" },
      phone: "555-123-4567",
      createdAt: "2024-03-15T09:00:00",
      status: "Active",
      block: false,
    },
    {
      id: 4,
      accountID: 2013,
      children:"Manik Hossain",
      firstName: "Bob Smith",
      lastName: "Williams",
      email: "bobwilliams@example.com",
      address_line1: "101 Pine St, Springfield",
      image: { url: "https://randomuser.me/api/portraits/men/2.jpg" },
      phone: "555-987-6543",
      createdAt: "2024-04-10T16:45:00",
      status: "Only Registered",
      block: true,
    },
    {
      id: 5,
      accountID: 2014,
      children:"Manik Hossain",
      firstName: "Charlie Smith",
      lastName: "Brown",
      email: "charliebrown@example.com",
      address_line1: "202 Maple St, Springfield",
      image: { url: "https://randomuser.me/api/portraits/men/3.jpg" },
      phone: "555-654-3210",
      createdAt: "2024-05-05T12:00:00",
      status: "Active",
      block: false,
    },
  ]);

  const dataSource = allUsers.map((user, index) => ({
    id: user.id,
    si: index + 1,
    Children:user?.children,
    firstName: user?.firstName,
    lastName: user?.lastName,
    accountID: user?.accountID,
    email: user?.email,
    phone: user?.phone,
    address_line1: user?.address_line1,
    createdAt: user?.createdAt,
    imageUrl: user?.image?.url,
    status: user?.status,
    block: user?.block,
  }));

  const columns = [
    {
      title: "#SI",
      dataIndex: "si",
      key: "si",
      sorter: (a, b) => a.si - b.si,
    },
    {
      title: "User Name",
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
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.email?.localeCompare(b.email),
      render: (text) => text || "N/A",
    },
    {
      title: "Children Name",
      dataIndex: "Children",
      key: "Children",
      sorter: (a, b) => a.email?.localeCompare(b.email),
      render: (text) => text || "N/A",
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (date) => (date ? moment(date).format("DD MMM YYYY") : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex items-center space-x-4">
            <IoEyeSharp 
              size={22}
              onClick={() => handleView(record)} // Trigger modal open
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (isError && error) {
      setAllUser([]);
    } else if (data) {
      setAllUser(data?.data?.attributes?.user?.results);
    }
  }, [data, isError, error]);

  return (
    <section>
      <div className="md:flex justify-between items-center py-6 px-2">
        <h1 className="text-2xl flex items-center font-semibold">Parents list</h1>
        <Form layout="inline" className="flex space-x-4">
  <Item name="month">
    <Select
      className="rounded-md w-[70%] md:w-full"
      placeholder="Select Month"
      onChange={(value) => setSearchText(value)}
      style={{ width: '100%' }}
    >
      <Select.Option value="1">January</Select.Option>
      <Select.Option value="2">February</Select.Option>
      <Select.Option value="3">March</Select.Option>
      <Select.Option value="4">April</Select.Option>
      <Select.Option value="5">May</Select.Option>
      <Select.Option value="6">June</Select.Option>
      <Select.Option value="7">July</Select.Option>
      <Select.Option value="8">August</Select.Option>
      <Select.Option value="9">September</Select.Option>
      <Select.Option value="10">October</Select.Option>
      <Select.Option value="11">November</Select.Option>
      <Select.Option value="12">December</Select.Option>
    </Select>
  </Item>
</Form>
      </div>
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
          loading={isFetching}
          pagination={{
            pageSize: 25,
            position: ["bottomRight"],
            current: currentPage,
            onChange: setCurrentPage,
          }}
          scroll={{ x: "max-content" }}
          responsive={true}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          // onRow={(record) => ({
          //   onClick: () => handleView(record),
          // })}
        />
      </ConfigProvider>
      <Modal
  open={isModalViewOpen}
  onOk={() => setIsModalViewOpen(false)}
  onCancel={() => setIsModalViewOpen(false)}
  footer={null}
  centered
  width={600}
>
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 -m-6 rounded-lg">
    {/* Header with decorative background */}
    <div className="bg-[#FF9E1C] p-6 rounded-t-lg">
      <h2 className="text-2xl font-bold text-white">Profile Details</h2>
    </div>

    <div className="md:p-6 space-y-6">
      {/* Parent Details Section */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-800">Parent Details</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-100"
              src={`${user?.imageUrl}`}
              alt="Profile"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h4>
            <p className=" font-medium mt-1">UI/UX Designer</p>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <span className="text-sm">Dhaka Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Children Details Section */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-800">Children Details</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              className="w-24 h-24 rounded-full object-cover ring-4 ring-pink-100"
              src={`${user?.imageUrl}`}
              alt="Profile"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h4>
            <p className=" font-medium mt-1">Student</p>
             <div className="flex items-center gap-2 mt-2 text-gray-600">
              <span className="text-sm">Dhaka Bangladesh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Modal>
    </section>
  );
};

export default Users;
