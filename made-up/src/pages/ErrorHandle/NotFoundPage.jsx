import Page from "@/components/ui/Page";
import { Link } from "react-router-dom";
import notFoundImg from "@/assets/imgs/404.svg";
import { Button } from "flowbite-react";

export const NotFoundPage = () => {
  return (
    <Page title={"Not Found"}>
      <img
        src={notFoundImg}
        alt="user is not found"
        draggable="false"
        className=" max-w-80 m-auto mt-28 "
      />
      <div className="px-5">
        <Button
          color="primary"
          className=" m-auto mt-10 w-full"
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
