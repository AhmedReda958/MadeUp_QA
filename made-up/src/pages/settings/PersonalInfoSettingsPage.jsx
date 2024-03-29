import Page from "@/components/ui/Page";
import React, { useState } from "react";
import profileInfoImg from "@/assets/imgs/bio.svg";
import { Button } from "flowbite-react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {} from "react-router-dom";
import useAlert from "@/utils/hooks/useAlert";
import { FormTextInput, FormTextarea } from "@/components/ui/FormElements";
import { IonAlert, useIonAlert } from "@ionic/react";

const PersonalInfoSettingsPage = ({ history }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const navigate = () => {};
  const Alert = useAlert();

  const validationSchema = Yup.object({
    username: Yup.string()
      .max(15, "Must be 15 characters or less")
      .min(3, "Must be 3 characters or more")
      .matches(/^[A-Za-z0-9_]{3,15}$/, "Not Valid username")
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

  const submitData = (values, { setSubmitting }) => {
    axios
      .patch("users", values)
      .then((res) => Alert({ title: "Profile updated", type: "success" }))
      .catch((error) => console.log(error))
      .finally(() => {
        setSubmitting(false);
        navigate(`/${userInfo.username}`);
      });
  };

  const cancelEdit = () => {
    history.goBack();
  };

  return (
    <Page title="Profile Info" backTo="/settings">
      <div className="flex justify-center">
        <img
          src={profileInfoImg}
          className="w-40 opacity-90"
          draggable="false"
          alt="edit profile page placeholder"
          loading="lazy"
        />
      </div>
      <Formik
        initialValues={{
          fullName: userInfo.fullName,
          username: userInfo.username,
          bio: userInfo.bio,
        }}
        validationSchema={validationSchema}
        onSubmit={submitData}
      >
        <Form className="mt-6 flex max-w-md m-auto flex-col gap-4">
          <div>
            <FormTextInput
              label={"Account username"}
              name="username"
              type="text"
              placeholder="@Username"
              icon={UserIcon}
            />
          </div>
          <div>
            <FormTextInput
              label={"Profile display name"}
              name="fullName"
              type="text"
              icon={UserIcon}
              placeholder="Full name (your display name)"
            />
          </div>
          <div>
            <FormTextarea
              label="Profile bio"
              name="bio"
              type="text"
              icon={UserIcon}
              placeholder="Your bio"
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button color="gray" id="cancel-alert">
                Cancel
              </Button>
              <IonAlert
                trigger="cancel-alert"
                header="Are you sure?"
                message="You will lose all changes"
                mode="ios"
                buttons={[
                  {
                    text: "No",
                    role: "cancel",
                  },
                  {
                    text: "Yes",
                    cssClass: "danger",
                    role: "confirm",
                    handler: cancelEdit,
                  },
                ]}
              ></IonAlert>

              <Button color="primary" type="submit">
                Save
              </Button>
            </div>
          </div>
        </Form>
      </Formik>
    </Page>
  );
};

export default PersonalInfoSettingsPage;
