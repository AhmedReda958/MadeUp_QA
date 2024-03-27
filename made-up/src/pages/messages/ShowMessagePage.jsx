import Page from "@/components/ui/Page";
import { Link } from "react-router-dom";
import useAxios from "@/utils/hooks/useAxios";
import MessageItem from "@/components/MessageItem";
import { Button } from "flowbite-react";
import notFoundImg from "@/assets/imgs/theSearch.svg";
import ProfilePic from "@/components/ProfilePic";

const MsgNotFound = () => {
  return (
    <div>
      <img
        src={notFoundImg}
        alt="user is not found"
        draggable="false"
        className=" max-w-60 m-auto mt-16 "
      />
      <div className="pt-12 ps-3 text m-auto w-80">
        <p className="text-xl text-altcolor"> Message is not found</p>
        {/* <p className="pt-1 text-sm font-light">
              Try to use 
            </p> */}
        <div>
          <Button
            color="primary"
            size={"sm"}
            className="mt-5 float-end"
            as={Link}
            to={"/"}
          >
            Go Back
            <i className="fa fa-arrow-right ps-2"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

const ShowMessagePage = ({ match }) => {
  const navigate = () => {};
  const id = match.params.id;

  const messageData = useAxios({ url: `/messages/message/${id}` });
  const { response, error, loading } = messageData;

  return (
    <Page title={!error ? "Message" : "Not found"} loading={loading}>
      {!error ? (
        <>
          <MessageItem message={response} type="post" />
          <Button
            color="dark"
            as={Link}
            to={"/" + response?.receiver.username}
            className="w-full *:w-full *:justify-between mt-10 rounded-2xl shadow-md"
          >
            <ProfilePic data={response?.receiver} className="w-8 h-8" />
            <div>
              Send Message to
              <span className="truncate"> @{response?.receiver.username}</span>
            </div>
            <i className="fa fa-arrow-right"></i>
          </Button>
        </>
      ) : (
        <MsgNotFound />
      )}
    </Page>
  );
};

export default ShowMessagePage;
