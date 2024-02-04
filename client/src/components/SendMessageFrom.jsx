import { useEffect, useRef, useState } from "react";
import axios from "axios";

const SendMessageFrom = ({ username }) => {
  const messageRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [MsgLoading, setMsgLoading] = useState(false);

  const sendMessage = () => {
    setMsgLoading(true);
    axios
      .post(`/user/${username}/message`, {
        content: messageRef.current.value,
      })
      .then((res) => {
        // setResponse(res.data);
        setShowForm(false);
        alert("message sent successfully :)");
      })
      .catch((err) => {
        console.log(err.response.data.error);
      })
      .finally(() => {
        setMsgLoading(false);
      });

    console.log(messageRef.current.value);
  };

  return (
    <div className="mt-5">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-2 py-2  text-center bg-altcolor text-alt   rounded-2xl"
        >
          Send Message
          <span className="ms-3 ">
            <i className="fa-regular fa-paper-plane"></i>
          </span>
        </button>
      ) : (
        <>
          <textarea
            name=""
            id=""
            ref={messageRef}
            className="w-full min-h-28 text-altcolor bg-light-alt dark:bg-dark-alt py-4 px-6 rounded-2xl "
            placeholder="Ask a question."
          ></textarea>

          <button
            onClick={sendMessage}
            className="w-full mt-3 px-8 py-3  text-center bg-alt-dark disabled:bg-alt text-lg text-white rounded-2xl"
            disabled={MsgLoading}
          >
            Send anonymously
            <span className=" float-end">
              {MsgLoading ? (
                <i className="fa fa-spinner fa-spin-pulse"></i>
              ) : (
                <i className="fa-regular fa-paper-plane"></i>
              )}
            </span>
          </button>
        </>
      )}
    </div>
  );
};

export default SendMessageFrom;
