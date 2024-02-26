import ProfilePic from "@/components/ProfilePic";
import Modal from "@/components/ui/Modal";
import Page from "@/components/ui/Page";
import { setTheme } from "@/redux/slices/appSlice";
import { logout } from "@/redux/slices/authSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import postsImg from "@/assets/imgs/posts.svg";
import { Button } from "flowbite-react";

function HomePage() {
  const [openSettigs, setOpenSettings] = useState(false);

  const app = useSelector((state) => state.app);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  return (
    <>
      {/* header */}
      <Page header={false}>
        <Page.Header title="Discovery">
          <div className="flex ">
            <button className="text-xl" onClick={() => setOpenSettings(true)}>
              <i className="fa fa-bars"></i>
            </button>
            {auth.logedin && (
              <Link
                to={`/${auth.userInfo.username}`}
                className="ps-4 drop-shadow-xl"
              >
                <ProfilePic
                  data={auth.userInfo}
                  className="h-10 w-10"
                  border={false}
                />
              </Link>
            )}
          </div>
        </Page.Header>
        <Modal opened={openSettigs} close={() => setOpenSettings(false)}>
          <div className=" grid grid-cols-2 gap-8 gap-x-12 text-white *:w-24 *:h-24 *:rounded-xl *:bg-dark *:dark:bg-dark-alt ">
            <div
              className="hover:opacity-80 p-3 pt-4  flex items-center justify-start flex-col font-display cursor-pointer shadow-md shadow-dark-alt"
              onClick={() => {
                dispatch(setTheme());
                setOpenSettings(false);
              }}
            >
              {app.isDarkTheme ? (
                <>
                  <i className="fa fa-sun text-3xl"></i>
                  <span className="text-sm pt-2">Light</span>{" "}
                </>
              ) : (
                <>
                  <i className="fa fa-moon text-3xl"></i>
                  <span className="text-sm pt-2">Dark</span>{" "}
                </>
              )}
            </div>
            <div
              className="hover:opacity-80 p-3 pt-4 flex items-center justify-start flex-col font-display cursor-pointer shadow-md shadow-dark-alt"
              onClick={() => {
                dispatch(logout());
                setOpenSettings(false);
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-3xl"></i>
              <span className="text-sm pt-2">Logout</span>
            </div>
            <div className="hover:opacity-80 p-3 pt-4 flex items-center justify-start flex-col font-display cursor-pointer shadow-md shadow-dark-alt">
              <i className="fa-solid fa-gear text-3xl"></i>
              <span className="text-sm pt-2">Settings</span>
            </div>
            <div className="hover:opacity-80 p-3 pt-4 flex items-center justify-start flex-col font-display cursor-pointer shadow-md shadow-dark-alt">
              <i className="fa-solid fa-earth-africa text-3xl"></i>
              <span className="text-sm pt-2">العربية</span>
            </div>
          </div>
        </Modal>
        <div>
          <img
            src={postsImg}
            className="w-[270px] m-auto mt-20 opacity-70 "
            alt=""
            draggable="false"
          />
          <div className="pt-12 ps-3 text m-auto w-80">
            <p className="text-center">
              You don't have any users you follow, to show messages in your
              timeline follow some frinds to see their answers
            </p>
          </div>
        </div>
        <Button outline color="primary">
          hello
        </Button>

        <button
          className="text-2xl button-lg absolute right-10 bottom-28 z-10 hidden"
          onClick={() => setOpenSettings(true)}
        >
          <i className="fa fa-bars"></i>
        </button>
      </Page>
    </>
  );
}

export default HomePage;
