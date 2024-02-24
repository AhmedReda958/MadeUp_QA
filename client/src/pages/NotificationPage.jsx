import Page from "@/components/ui/Page";
import React from "react";
import sleepImg from "@/assets/imgs/sleep.svg";

const NotificationPage = () => {
  return (
    <Page title={"Notification"}>
      <div>
        <img
          src={sleepImg}
          className="w-[200px] m-auto mt-20 opacity-70 "
          alt=""
          draggable="false"
        />
        <div className="pt-12 ps-3 text m-auto w-80">
          <p className="text-center text-xl text-altcolor">
            There's no new Notification
          </p>
        </div>
      </div>
    </Page>
  );
};

export default NotificationPage;
