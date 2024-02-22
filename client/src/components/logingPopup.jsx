import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  openLoginPopup,
  closeLoginPopup,
  setTheme,
} from "@/redux/slices/appSlice";

import { loginUser, registerUser } from "@/redux/actions/authActions";

const LoginFrom = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Determine if the entered value is an email or mobile number
    const isEmail = /\S+@\S+\.\S+/.test(credentials.username);
    const isMobile = /^\d{10}$/.test(credentials.username);

    // You can customize this logic based on your requirements
    let loginData = {};
    if (isEmail) {
      loginData = {
        email: credentials.username,
        password: credentials.password,
      };
    } else if (isMobile) {
      loginData = {
        mobile: credentials.username,
        password: credentials.password,
      };
    } else {
      loginData = {
        username: credentials.username,
        password: credentials.password,
      };
    }

    // Now you can send `loginData` to your backend for authentication
    console.log(loginData);
    dispatch(loginUser(loginData));
    // Reset form fields
    // setCredentials({ username: "", password: "" });
  };
  const { logedin, loading, userInfo, error } = useSelector(
    (state) => state.auth
  );
  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      <div className="bg-altcolor text-altcolor w-full rounded-2xl px-10 py-3 mb-7">
        <input
          type="text"
          name="username"
          value={credentials.username}
          placeholder="Username or Email"
          onChange={handleChange}
          className=" bg-inherit w-full focus:outline-none"
          required
        />
      </div>
      <div className="bg-altcolor text-altcolor w-full rounded-2xl px-10 py-3 mb-7">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="bg-inherit w-full focus:outline-none"
          required
        />
      </div>
      <div className="text-sm text-red-400 ps-3 mb-2 ">{error}</div>
      <button
        type="sumit"
        className={`w-full h-12 rounded-2xl text-center  font-bold ${
          loading ? "bg-alt" : "bg-alt-dark"
        }`}
        disabled={loading}
      >
        {loading && <i className="fa fa-spinner fa-spin-pulse"></i>}
        Login
      </button>
    </form>
  );
};
const SignupForm = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Now you can send `loginData` to your backend for authentication
    console.log(credentials);
    dispatch(registerUser(credentials));
    // Reset form fields
    // setCredentials({ username: "", password: "" });
  };
  const { logedin, loading, userInfo, error } = useSelector(
    (state) => state.auth
  );
  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      <div className="bg-altcolor text-altcolor w-full rounded-2xl px-10 py-3 mb-7">
        <input
          type="text"
          name="username"
          value={credentials.username}
          placeholder="Username"
          onChange={handleChange}
          className=" bg-inherit w-full focus:outline-none"
          required
        />
      </div>
      <div className="bg-altcolor text-altcolor w-full rounded-2xl px-10 py-3 mb-7">
        <input
          type="email"
          name="email"
          value={credentials.email}
          placeholder="Email"
          onChange={handleChange}
          className=" bg-inherit w-full focus:outline-none"
          required
        />
      </div>
      <div className="bg-altcolor text-altcolor w-full rounded-2xl px-10 py-3 mb-7">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="bg-inherit w-full focus:outline-none"
          required
        />
      </div>
      <div className="text-sm text-red-400 ps-3 mb-2 ">{error}</div>
      <button
        type="sumit"
        className={`w-full h-12 rounded-2xl text-center  font-bold ${
          loading ? "bg-alt" : "bg-alt-dark"
        }`}
        disabled={loading}
      >
        {loading && <i className="fa fa-spinner fa-spin-pulse"></i>}
        Sign up
      </button>
    </form>
  );
};

const LoginPopup = () => {
  const [isLoginFrom, setIsloginFrom] = useState(true);
  const dispatch = useDispatch();
  const appStore = useSelector((state) => state.app);
  const userStore = useSelector((state) => state.user);
  const { logedin, loading, userInfo, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (logedin) dispatch(closeLoginPopup());
  }, [logedin]);
  return (
    <div>
      {appStore.isLoginOpened && !logedin && (
        <div className="fixed  h-full w-full z-20">
          <div
            className=" fixed h-full w-full top-0 left-0 bg-gray-800 opacity-50 "
            onClick={() => dispatch(closeLoginPopup())}
          ></div>
          <div className="fixed bottom-0 h-4/6 w-full z-20 bg-light dark:bg-dark text-body dark:text-secondary rounded-tr-[35px] rounded-tl-[100px] pt-10 px-8">
            <h2 className=" text-xl font-bold text-center">
              {isLoginFrom ? "Login" : "Sign Up"}
            </h2>
            {isLoginFrom ? (
              <>
                <LoginFrom />
                <div
                  className="text-center text-maincolor mt-4"
                  onClick={() => setIsloginFrom(false)}
                >
                  Create Account
                </div>
              </>
            ) : (
              <>
                <SignupForm />
                <div
                  className="text-center text-maincolor mt-4"
                  onClick={() => setIsloginFrom(true)}
                >
                  Login
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPopup;
