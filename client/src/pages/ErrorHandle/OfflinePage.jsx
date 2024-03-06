import Page from "@/components/ui/Page";
import { Link } from "react-router-dom";
import serverDownImg from "@/assets/imgs/serverDown.svg";
import { Button } from "flowbite-react";

const OfflinePage = () => {
  return (
    <Page title={"Not Found"} className="px-5 max-w-[768px] mx-auto">
      <img
        src={serverDownImg}
        alt="user is not found"
        draggable="false"
        className=" max-w-80 m-auto mt-28 "
      />
      <div className="px-5">
        <p className="text-center text-lg font-display text-maincolor pt-6">
          <span className="font-bold text-altcolor">You're offline. </span>
          <br />
          Check your connection
        </p>
        <Button
          color="dark"
          className=" m-auto mt-10 w-full"
          as={Link}
          to={"/"}
        >
          Retry
          <i className="fa fa-refresh ps-2"></i>
        </Button>
        <Button
          color="gray"
          outline
          className=" m-auto mt-3 w-full"
          as={Link}
          to={"/"}
        >
          Go Back
          <i className="fa fa-arrow-right ps-2"></i>
        </Button>
      </div>
    </Page>
  );
};

export default OfflinePage;
