import { useDispatch } from "react-redux";
import { addAlert } from "@/redux/slices/appSlice";

const useAlert = () => {
  const dispatch = useDispatch();
  return ({ type = "", title = "", message = "" }) =>
    dispatch(
      addAlert({
        title,
        type,
        message,
      })
    );
};

export default useAlert;
