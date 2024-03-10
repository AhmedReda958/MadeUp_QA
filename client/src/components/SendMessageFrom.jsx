import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "@/redux/slices/appSlice";
import { ToggleSwitch } from "flowbite-react";

const SendMessageFrom = ({ userId }) => {
  const logedin = useSelector((state) => state.auth.logedin);

  const [msgAnonymously, setMsgAnonymously] = useState(!logedin);
  const [showForm, setShowForm] = useState(false);
  const [msgContent, setMsgContent] = useState("");
  const [MsgLoading, setMsgLoading] = useState(false);

  const dispatch = useDispatch();

  const onSuccess = () => {
    dispatch(
      addAlert({
        title: "Message sent successfully",
        type: "success",
      })
    );
  };
  const onFailure = () => {
    dispatch(
      addAlert({
        title: "Error, Message isn't sent",
        type: "error",
      })
    );
  };

  const sendMessage = () => {
    setMsgLoading(true);
    axios
      .post(`/messages/user/${userId}`, {
        anonymously: msgAnonymously,
        content: msgContent,
      })
      .then((res) => {
        // setResponse(res.data);
        setShowForm(false);
        onSuccess();
      })
      .catch((err) => {
        console.log(err);
        onFailure();
      })
      .finally(() => {
        setMsgLoading(false);
      });
  };

  const handleMsgChange = (e) => {
    e.target.style.height = "";
    e.target.style.height = e.target.scrollHeight + "px";
    setMsgContent(e.target.value);
  };

  return (
    <div className="mt-5">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-2 py-3 hover:opacity-90  text-center  text-alt bg-dark-alt   rounded-2xl shadow"
        >
          Send Message
          <span className="ms-3 ">
            <i className="fa-regular fa-paper-plane"></i>
          </span>
        </button>
      ) : (
        <>
          <textarea
            onChange={handleMsgChange}
            className=" resize-none w-full min-h-28 text-altcolor bg-light-alt dark:bg-dark-alt placeholder-body-alt py-4 px-6 rounded-2xl shadow-inner shadow-gray-300 dark:shadow-none"
            placeholder="Ask a question."
          ></textarea>

          <button
            onClick={sendMessage}
            className="w-full mt-3 px-8 py-3  text-center bg-gradient-to-tr from-primary-dark to-gred hover:opacity-90 disabled:opacity-80  text-lg text-white rounded-2xl group transition-all duration-200 shadow shadow-dark-alt"
            disabled={MsgLoading || msgContent.length < 6}
          >
            {msgAnonymously ? "Send anonymously" : "Send publicly"}
            <span className=" float-end group-hover:rotate-12">
              {MsgLoading ? (
                <i className="fa fa-spinner fa-spin-pulse"></i>
              ) : (
                <i className="fa-regular fa-paper-plane"></i>
              )}
            </span>
          </button>
          <div className="flex items-start gap-3 mt-3">
            <ToggleSwitch
              checked={msgAnonymously}
              onChange={setMsgAnonymously}
              disabled={!logedin}
            />
            <span className="text-xs">
              {msgAnonymously
                ? "Anonymous mode enabled, the questionwill be sent without showing your identy"
                : "Anonymous mode disabled, the question will be sent with your identy"}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default SendMessageFrom;
