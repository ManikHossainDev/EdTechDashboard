import { Pagination } from "antd";
import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data
  const notifications = [
    { id: 1, message: "You have a new order delivery for Luke.", time: "2 Min Ago" },
    { id: 2, message: "You have shipment 5 days for Luke.", time: "2 Min Ago" },
    { id: 3, message: "You have a new message from Luke.", time: "2 Min Ago" },
    { id: 4, message: "You have a new message from Luke.", time: "2 Min Ago" },
    { id: 5, message: "You have a new message from Luke.", time: "2 Min Ago" },
    { id: 6, message: "You have a new message from Luke.", time: "2 Min Ago" },
    { id: 7, message: "You have shipment 5 days for Luke.", time: "2 Min Ago" },
    { id: 8, message: "You have a new order delivery for Luke.", time: "2 Min Ago" },
    { id: 9, message: "Your package has been dispatched to Luke.", time: "3 Min Ago" },
    { id: 10, message: "Your shipment is delayed for Luke.", time: "5 Min Ago" },
    { id: 11, message: "You have a new order delivery for Sarah.", time: "7 Min Ago" },
    { id: 12, message: "Your shipment is ready for pickup.", time: "10 Min Ago" },
    { id: 13, message: "You have a new message from Sarah.", time: "12 Min Ago" },
    { id: 14, message: "You have an update on your order for John.", time: "15 Min Ago" },
    { id: 15, message: "You have a new message from Emily.", time: "20 Min Ago" },
    { id: 16, message: "Your order for Sarah has been delivered.", time: "25 Min Ago" },
    { id: 17, message: "Your shipment for Sarah is out for delivery.", time: "30 Min Ago" },
    { id: 18, message: "You have a new message from John.", time: "35 Min Ago" },
    { id: 19, message: "You have a new shipment update for Luke.", time: "40 Min Ago" },
    { id: 20, message: "Your order for Sarah is on its way.", time: "45 Min Ago" },
    { id: 21, message: "Your shipment for Sarah will arrive tomorrow.", time: "50 Min Ago" },
    { id: 22, message: "You have a new order delivery for Mike.", time: "55 Min Ago" },
    { id: 23, message: "Your package has been shipped to Luke.", time: "60 Min Ago" },
    { id: 24, message: "You have a new order delivery for Jessica.", time: "65 Min Ago" },
    { id: 25, message: "Your shipment is delayed for Jessica.", time: "70 Min Ago" },
    { id: 26, message: "You have a new message from Michael.", time: "75 Min Ago" },
    { id: 27, message: "Your shipment for Michael is out for delivery.", time: "80 Min Ago" },
    { id: 28, message: "You have a new shipment notification for David.", time: "85 Min Ago" },
    { id: 29, message: "You have a new message from David.", time: "90 Min Ago" },
    { id: 30, message: "Your order for Jessica is being processed.", time: "95 Min Ago" },
    { id: 31, message: "Your package has been delivered to David.", time: "100 Min Ago" },
    { id: 32, message: "You have a new order delivery for Sarah.", time: "105 Min Ago" },
    { id: 33, message: "Your shipment is delayed for Michael.", time: "110 Min Ago" },
  ];

  const pageSize = 25

  // Pagination Logic
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl flex items-center mb-4"><Link to='/'><IoChevronBack className="text-2xl" /> </Link>Notification</h1>

      <div className="space-y-4">
        {paginatedNotifications.map((item) => (
          <div key={item.id} className="border border-[#020E12] rounded-md p-4 flex items-center space-x-4">
            <div className="text-[#2B6BE3] border border-[#2B6BE3] rounded-full p-2">
              <span className="text-[#2B6BE3] bg-[#2B6BE3] p-1.5 rounded-full absolute ml-4"></span>
              <IoMdNotificationsOutline size={30} className="relative" />
            </div>
            <div>
              <p className="font-semibold">{item.message}</p>
              <p className="text-gray-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Centering the Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          total={notifications.length}
          pageSize={pageSize}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Notification;
