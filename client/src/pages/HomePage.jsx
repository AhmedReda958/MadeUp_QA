import ProfilePic from "@/components/ProfilePic";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function HomePage() {
  const app = useSelector((state) => state.app);
  const user = useSelector((state) => state.auth.userInfo);

  return (
    <>
      {/* header */}
      <div className="flex justify-between items-center  mt-3">
        <div className="flex items-center ">
          <img src="/logo.png" alt="logo" className="w-10" draggable="false" />
          <h2 className="ms-5 border-s-2 border-body-alt ps-4 text-xl">
            Discovery
          </h2>
        </div>

        <Link to={`/${user.username}`} className=" drop-shadow-xl">
          <ProfilePic data={user} className="h-10 w-10" border={false} />
        </Link>
      </div>
    </>
  );
}

export default HomePage;
