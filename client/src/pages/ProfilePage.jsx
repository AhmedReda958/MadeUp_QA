// UserProfile.js

import useAxios from "@/utils/hooks/useAxios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EmptyContentImg from "@/assets/imgs/taken.svg";

import SendMessageFrom from "@/components/SendMessageFrom";
import ProfilePic from "@/components/ProfilePic";
import Page from "@/components/ui/Page";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MessageItem from "@/components/MessageItem";

const EmptyPage = () => {
  return (
    <div className=" relative">
      <img
        src={EmptyContentImg}
        alt=""
        draggable="false"
        className=" max-w-60 m-auto mt-6 opacity-70 "
      />
      <div
        className=" absolute left-3 top-28 text-lg font-light  text-altcolor "
        style={{ transform: "rotate(-90deg) translateY(-72px)" }}
      >
        No content found
      </div>
    </div>
  );
};

const ProfileMessages = ({ userId }) => {
  const messagesData = useAxios({
    url: `messages/user/${userId}`,
    headers: {
      params: {
        page: 1,
        limit: 10,
        user: ["sender", "receiver"],
        include: [
          "content",
          "sender",
          "receiver",
          "reply.content",
          "reply.timestamp",
          "timestamp",
        ],
      },
    },
  });

  const { loading, error, response } = messagesData;

  return (
    <div>
      {!loading ? (
        error ? (
          error
        ) : response.length > 0 ? (
          <>
            <div className="py-4 flex justify-between">
              <div className="text-altcolor font-simibold">
                Answers {response.length}
                <div className="m-auto mt-1 w-6 h-[2px] bg-alt"></div>
              </div>
              <div>Likes 0</div>
              <div>Score 0</div>
            </div>
            {response.map((message) => (
              <MessageItem key={message._id} message={message} />
            ))}
          </>
        ) : (
          <EmptyPage />
        )
      ) : (
        <>
          <div className="py-4 flex justify-between">
            <div className="text-altcolor font-simibold">
              Answers 0<div className="m-auto mt-1 w-6 h-[2px] bg-alt"></div>
            </div>
            <div>Likes 0</div>
            <div>Score 0</div>
          </div>
          <LoadingSpinner />
        </>
      )}
    </div>
  );
};

const UserProfile = () => {
  const { username } = useParams();
  const { userInfo, logedin } = useSelector((state) => state.auth);

  const user = useAxios({ url: `/users?username=${username}` });
  const { response, error, loading } = user;
  useEffect(() => {
    console.log(user.response);
    console.log(user.error);
    console.log(user.statusCode);
  }, [loading]);

  return (
    <Page header={false}>
      {!loading ? (
        error ? (
          <>
            <Page.Header title={"User"} />
            {error}
          </>
        ) : (
          <>
            <Page.Header title={"@" + response.username}>
              <div className="p-3 text-lg cursor-pointer text-primary dark:text-white ">
                <i className="fa fa-user-plus"></i>
              </div>
            </Page.Header>
            <div className="flex">
              <ProfilePic data={response} className="w-24 h-24" />

              <div className="text-altcolor font-bold text-center grow flex items-center justify-around">
                <div>
                  <div>0</div> followers
                </div>
                <div>
                  <div>0</div> following
                </div>
              </div>
            </div>
            <div className="ps-2 mt-1">
              <h2 className="text-altcolor font-bold text-xl flex">
                {response.fullName || response.username}
                <span
                  style={{
                    marginTop: 5,
                    marginBlockStart: 5,
                    width: 22,
                    height: 22,
                    display: "flex",
                    background: "#6c63ff",
                    WebkitMaskSize: 22,
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskImage:
                      "url(https://onvo.me/media/svg/verify2.svg)",
                    marginLeft: 2,
                  }}
                />
              </h2>
              <p className="text-body dark:text-secondary-alt text-lg mt-2 mb-4">
                {response.bio}
              </p>
            </div>

            {userInfo.username != username && (
              <SendMessageFrom userId={response._id} />
            )}

            <ProfileMessages userId={userInfo._id} />
          </>
        )
      ) : (
        <div className="text-2xl text-center">
          <i className="fa fa-spinner fa-spin-pulse"></i>
        </div>
      )}
    </Page>
  );
};

export default UserProfile;
