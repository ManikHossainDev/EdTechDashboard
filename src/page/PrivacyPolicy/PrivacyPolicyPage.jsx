
import { IoChevronBack } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import CustomButton from "../../utils/CustomButton";

const PrivacyPolicyPage = () => {
  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex  items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        </div>
        <Link to={"/settings/edit-privacy-policy/11"}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>

      <div>
        <p className="text-lg text-black px-5">
          {/* {privacy.content} */}
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Reprehenderit ex ad voluptate dolores, debitis qui vitae nobis! Sit
          hic eligendi qui cumque mollitia illum fuga fugit dolores odio,
          commodi placeat omnis? Ratione pariatur dolor consequatur eligendi
          aliquid at recusandae maiores adipisci, laboriosam corrupti excepturi
          ad dolorum? Minima corrupti deserunt ipsum, illum eum et numquam nihil
          alias exercitationem! Minus voluptate, commodi quod laborum expedita
          hic officiis doloremque voluptatum nesciunt minima id ratione neque,
          impedit unde possimus, veniam architecto harum nostrum quibusdam
          voluptas eius magnam itaque animi quo. Fugiat id explicabo repellendus
          saepe excepturi nam cumque necessitatibus enim aperiam impedit? Aut,
          dolorem!
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
