import Page from "@/components/ui/Page";
import React, { useState } from "react";
import profileInfoImg from "@/assets/imgs/bio.svg";
import { Button, Checkbox, Label, TextInput, Textarea } from "flowbite-react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

const PersonalInfoSettingsPage = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [username, setUsername] = useState(userInfo.username);
  const [fullName, setFullName] = useState(userInfo.fullName);
  const [bio, setBio] = useState(userInfo.bio);
  return (
    <Page title="Profile Info">
      <div className="flex justify-center">
        <img
          src={profileInfoImg}
          className="w-40 opacity-90"
          draggable="false"
          alt="edit profile page placeholder"
        />
      </div>
      <form className="mt-6 flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Account username" />
          </div>
          <TextInput
            id="username"
            type="text"
            icon={UserIcon}
            placeholder="@Username"
            value={username}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="fullname" value="Profile display name" />
          </div>
          <TextInput
            id="fullname"
            type="text"
            icon={UserIcon}
            placeholder="Full name (your display name)"
            value={fullName}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="bio" value="Profile bio" />
          </div>
          <Textarea
            id="bio"
            type="text"
            icon={UserIcon}
            placeholder="Your bio"
            className=" resize-none"
            value={username}
            onChange={(e) => {
              e.target.style.height = "";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Button color="gray">Cancel</Button>
          <Button color="primary">Save</Button>
        </div>
      </form>
    </Page>
  );
};

export default PersonalInfoSettingsPage;
