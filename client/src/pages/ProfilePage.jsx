// UserProfile.js

import useAxios from "@/utils/hooks/useAxios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MaleProfilePic from "@/assets/imgs/maleProfilePic.png";
import EmptyContentImg from "@/assets/imgs/taken.svg";

import SendMessageFrom from "@/components/SendMessageFrom";

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
    <div>
      {!loading ? (
        error ? (
          error
        ) : (
          <div>
            <h1 className="text-base  ms-2 text-end">@{response.username}</h1>
            <div className="flex">
              <div className=" bg-altcolor p-1 rounded-full">
                <img
                  src={response.profilePicture || MaleProfilePic}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = MaleProfilePic;
                  }}
                  alt="profile pic"
                  className=" h-24 w-24 rounded-full"
                />
              </div>
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
            <div className="py-4 flex justify-between">
              <div className="text-altcolor font-simibold">
                Answers 42
                <div className="m-auto mt-1 w-6 h-[2px] bg-alt"></div>
              </div>
              <div>Likes 53</div>
              <div>Score 182</div>
            </div>

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
          </div>
        )
      ) : (
        <div className="text-2xl text-center">
          <i className="fa fa-spinner fa-spin-pulse"></i>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
