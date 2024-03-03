import {
  UserIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  AtSymbolIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { loginUser, registerUser } from "@/redux/actions/authActions";
import { determineLoginType } from "@/utils/helpers";
import { Form, Formik } from "formik";
import { FormTextInput, FormTextarea } from "@/components/ui/FormElements";
import * as Yup from "yup";
import { Button } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";

const RegisterFrom = () => {
  // component animations
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);

  const [step, setStep] = useState(1);
  const { logedin, loading, error, userToken } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const submitData = (values, { setSubmitting }) => {
    dispatch(registerUser(values));
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .max(15, "Must be 15 characters or less")
      .min(3, "Must be 3 characters or more")
      .matches(/^[A-Za-z0-9_]{3,15}$/, "Not Valid username")
      .required(),
    email: Yup.string().email("Invalid email").required("Required"),
    fullName: Yup.string()
      .max(30, "Must be 30 characters or less")
      .min(3, "Must be 3 characters or more")
      .required("Full name is a required field"),
    bio: Yup.string()
      .max(150, "Must be 150 characters or less")
      .min(3, "Must be 3 characters or more")
      .required(),
    password: Yup.string()
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .max(24, "Password is too long - should be 24 chars or less."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords dosen't match")
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        fullName: "",
        bio: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={submitData}
    >
      {({ errors, values }) => (
        <Form className="mt-10 text-body">
          <Transition as={"div"} show={animate}>
            {/* step 1 */}
            {step === 1 && (
              <>
                <div className="mb-5">
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.4s]"
                    enterFrom="opacity-0 -translate-x-32"
                    enterTo="opacity-100 translate-x-0"
                  >
                    <FormTextInput
                      name="username"
                      type="text"
                      icon={UserIcon}
                      placeholder="Choose your username"
                    />
                  </Transition.Child>
                </div>
                <div className="mb-5">
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.6s]"
                    enterFrom="opacity-0 -translate-x-32"
                    enterTo="opacity-100 translate-x-0"
                  >
                    <FormTextInput
                      name="email"
                      type="email"
                      icon={AtSymbolIcon}
                      placeholder="Email"
                    />
                  </Transition.Child>
                </div>
                <Transition.Child
                  as={"div"}
                  enter="ease-in-out duration-[.3s]"
                  enterFrom="opacity-0 scale-50"
                  enterTo="opacity-100 scale-100"
                >
                  <Button
                    color="dark"
                    disabled={
                      errors.username ||
                      errors.email ||
                      !values.username ||
                      !values.email
                    }
                    className="w-full mt-5"
                    onClick={() => setStep(2)}
                    size={"lg"}
                  >
                    Next
                    {loading ? (
                      <i className="fa fa-spinner fa-spin-pulse ms-8"></i>
                    ) : (
                      <ArrowRightIcon className="w-4 h-4 ms-8" />
                    )}
                  </Button>
                </Transition.Child>
              </>
            )}
            {/* step 2 */}
            {step === 2 && (
              <>
                <div className="mb-5">
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.4s]"
                    enterFrom="opacity-0 -translate-x-32"
                    enterTo="opacity-100 translate-x-0"
                  >
                    <FormTextInput
                      name="fullName"
                      type="text"
                      icon={UserIcon}
                      placeholder="Full name (your display name)"
                    />
                  </Transition.Child>
                </div>
                <div className="mb-5">
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.6s]"
                    enterFrom="opacity-0 -translate-x-32"
                    enterTo="opacity-100 translate-x-0"
                  >
                    <FormTextarea
                      name="bio"
                      type="text"
                      icon={UserIcon}
                      placeholder="Your bio"
                    />
                  </Transition.Child>
                </div>
                <div>
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.3s]"
                    enterFrom="opacity-0 scale-50"
                    enterTo="opacity-100 scale-100"
                  >
                    <Button
                      color="dark"
                      disabled={
                        errors.fullName ||
                        errors.bio ||
                        !values.fullName ||
                        !values.bio
                      }
                      className="w-full mt-5"
                      onClick={() => setStep(3)}
                      size={"lg"}
                    >
                      Next
                      {loading ? (
                        <i className="fa fa-spinner fa-spin-pulse ms-8"></i>
                      ) : (
                        <ArrowRightIcon className="w-4 h-4 ms-8" />
                      )}
                    </Button>
                  </Transition.Child>
                  <Transition.Child
                    as={"div"}
                    enter="ease-out duration-[.3s]"
                    enterFrom="opacity-0 scale-50"
                    enterTo="opacity-100 scale-100"
                  >
                    <Button
                      color="dark"
                      disabled={loading}
                      className="w-30 mt-1 light bg-transparent"
                      onClick={() => setStep(step - 1)}
                      size={"lg"}
                    >
                      <ArrowLeftIcon className="w-4 h-4 me-4" />
                      Back
                    </Button>
                  </Transition.Child>
                </div>
              </>
            )}
            {/* step 3 */}
            {/* step 3 suppose to be upload profile pic */}
            {step === 3 && (
              <>
                <div className="mb-5">
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.4s]"
                    enterFrom="opacity-0 -translate-x-32"
                    enterTo="opacity-100 translate-x-0"
                  >
                    <FormTextInput
                      name="password"
                      type="password"
                      icon={LockClosedIcon}
                      placeholder="Password"
                    />
                  </Transition.Child>
                </div>
                <div className="mb-5">
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.6s]"
                    enterFrom="opacity-0 -translate-x-32"
                    enterTo="opacity-100 translate-x-0"
                  >
                    <FormTextInput
                      name="confirmPassword"
                      type="password"
                      icon={LockClosedIcon}
                      placeholder="Confirm password"
                    />
                  </Transition.Child>
                </div>

                <div>
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.3s]"
                    enterFrom="opacity-0 scale-50"
                    enterTo="opacity-100 scale-100"
                  >
                    <Button
                      type="submit"
                      color="dark"
                      disabled={loading}
                      className="w-full mt-5"
                      size={"lg"}
                    >
                      Sign up
                      {loading ? (
                        <i className="fa fa-spinner fa-spin-pulse ms-8"></i>
                      ) : (
                        <ArrowRightEndOnRectangleIcon className="w-5 h-5 ms-8" />
                      )}
                    </Button>
                  </Transition.Child>
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.3s]"
                    enterFrom="opacity-0 scale-50"
                    enterTo="opacity-100 scale-100"
                  >
                    <Button
                      color="dark"
                      disabled={loading}
                      className="w-30 mt-1 light bg-transparent"
                      onClick={() => setStep(step - 1)}
                      size={"lg"}
                    >
                      <ArrowLeftIcon className="w-4 h-4 me-4" />
                      Back
                    </Button>
                  </Transition.Child>
                </div>
              </>
            )}
          </Transition>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterFrom;
