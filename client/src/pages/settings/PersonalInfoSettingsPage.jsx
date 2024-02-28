import Page from "@/components/ui/Page";
import React, { useState } from "react";
import profileInfoImg from "@/assets/imgs/bio.svg";
import { Button, Checkbox, Label, TextInput, Textarea } from "flowbite-react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

const PersonalInfoSettingsPage = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const validationSchema = Yup.object({
    username: Yup.string()
      .max(20, "Must be 20 characters or less")
      .min(3, "Must be 3 characters or more")
      .required(),
    fullName: Yup.string()
      .max(30, "Must be 30 characters or less")
      .min(3, "Must be 3 characters or more")
      .required("Full name is a required field"),
    bio: Yup.string()
      .max(150, "Must be 150 characters or less")
      .min(3, "Must be 3 characters or more")
      .required(),
  });

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
      <Formik
        initialValues={{
          fullName: userInfo.fullName,
          username: userInfo.username,
          bio: userInfo.bio,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {(formik) => (
          <form
            onSubmit={formik.handleSubmit}
            className="mt-6 flex max-w-md m-auto flex-col gap-4"
          >
            <div>
              <div className="mb-2 block">
                <Label
                  className=" font-display"
                  htmlFor="username"
                  value="Account username"
                />
              </div>
              <TextInput
                id="username"
                name="username"
                type="text"
                icon={UserIcon}
                placeholder="@Username"
                {...formik.getFieldProps("username")}
                color={
                  formik.touched.username && formik.errors.username
                    ? "failure"
                    : null
                }
                helperText={
                  formik.touched.username && formik.errors.username ? (
                    <div>{formik.errors.username}</div>
                  ) : null
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  className=" font-display"
                  htmlFor="fullname"
                  value="Profile display name"
                />
              </div>
              <TextInput
                id="fullName"
                name="fullName"
                type="text"
                icon={UserIcon}
                placeholder="Full name (your display name)"
                {...formik.getFieldProps("fullName")}
                color={
                  formik.touched.fullName && formik.errors.fullName
                    ? "failure"
                    : null
                }
                helperText={
                  formik.touched.fullName && formik.errors.fullName ? (
                    <div>{formik.errors.fullName}</div>
                  ) : null
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  className=" font-display"
                  htmlFor="bio"
                  value="Profile bio"
                />
              </div>
              <Textarea
                id="bio"
                name="bio"
                type="text"
                icon={UserIcon}
                placeholder="Your bio"
                className=" resize-none overflow-hidden"
                value={formik.values.bio}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  e.target.style.height = "";
                  e.target.style.height = e.target.scrollHeight + "px";
                  formik.handleChange(e);
                }}
                color={
                  formik.touched.bio && formik.errors.bio ? "failure" : null
                }
                helperText={
                  formik.touched.bio && formik.errors.bio ? (
                    <div>{formik.errors.bio}</div>
                  ) : null
                }
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button color="gray">Cancel</Button>
                <Button color="primary" type="submit">
                  Save
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Page>
  );
};

export default PersonalInfoSettingsPage;
