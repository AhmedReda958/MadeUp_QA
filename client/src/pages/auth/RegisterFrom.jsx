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
import { Button } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

const RegisterFrom = () => {
  const [step, setStep] = useState(1);
  const { logedin, loading, error, userToken } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const submitData = (values, { setSubmitting }) => {
    dispatch(registerUser(values));
  };
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        fullName: "",
        bio: "",
        password: "",
      }}
      onSubmit={submitData}
    >
      <Form className="  mt-10 text-body">
        {/* step 1 */}
        {step === 1 && (
          <>
            <div className="mb-5">
              <FormTextInput
                name="username"
                type="text"
                icon={UserIcon}
                placeholder="Choose your username"
              />
            </div>
            <div className="mb-5">
              <FormTextInput
                name="email"
                type="email"
                icon={AtSymbolIcon}
                placeholder="Email"
              />
            </div>

            <Button
              color="dark"
              disabled={loading}
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
          </>
        )}

        {/* step 2 */}
        {step === 2 && (
          <>
            <div className="mb-5">
              <FormTextInput
                name="fullName"
                type="text"
                icon={UserIcon}
                placeholder="Full name (your display name)"
              />
            </div>
            <div className="mb-5">
              <FormTextarea
                name="bio"
                type="text"
                icon={UserIcon}
                placeholder="Your bio"
              />
            </div>
            <div>
              <Button
                color="dark"
                disabled={loading}
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
            </div>
          </>
        )}
        {/* step 3 */}
        {/* step 3 suppose to be upload profile pic */}
        {step === 3 && (
          <>
            <div className="mb-5">
              <FormTextInput
                name="password"
                type="password"
                icon={LockClosedIcon}
                placeholder="Password"
              />
            </div>
            <div className="mb-5">
              <FormTextInput
                name="password"
                type="password"
                icon={LockClosedIcon}
                placeholder="Confirm password"
              />
            </div>

            <div>
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
            </div>
          </>
        )}
      </Form>
    </Formik>
  );
};

export default RegisterFrom;
