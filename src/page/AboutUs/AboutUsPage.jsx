import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import CustomButton from "../../utils/CustomButton";
// import { useGetAboutUsQuery } from "../../redux/features/setting/settingApi";
 // Importing Spin

const AboutUsPage = () => {
 
  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex  items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">About Us</h1>
        </div>
        <Link to={"/settings/edit-about-us/11"}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>

      {/* Show Spin loader if data is loading */}


      <div>
        <p className="text-lg px-5 text-black">
          {/* {about.content} */}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
          repudiandae deleniti hic asperiores fugit minus impedit consectetur
          placeat aliquid totam. Corrupti nulla, dolores repellendus sed ad
          tempora commodi magni laudantium optio quae eligendi dicta officia
          error nihil quisquam molestias explicabo cum aperiam doloribus
          sapiente magnam asperiores ratione vero. Quod sint, rem tempora sunt
          expedita accusamus facilis fuga atque dolorum, consequatur quidem
          voluptates rerum eveniet? Corrupti, at inventore repellendus sapiente,
          suscipit necessitatibus expedita impedit quos, voluptas nam sint
          aliquid nisi optio. Officiis sunt voluptatibus eos, numquam quis
          aspernatur dolorum optio, officia dicta quidem maiores mollitia fugiat
          quasi dolorem minus ipsam ipsum.
        </p>
      </div>
    </section>
  );
};

export default AboutUsPage;
