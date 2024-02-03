import { useState, useEffect } from "react";
import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/";
axios.defaults.baseURL = apiURL;
axios.defaults.headers = {
  "Access-Control-Allow-Origin": apiURL,
};

const useAxios = (
  { url, method = "get", body = null, headers = null },
  callback = () => {}
) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios[method](url, headers, JSON.parse(body))
      .then((res) => {
        setResponse(res.data);
        callback(res);
      })
      .catch((err) => {
        setError(err.response.data.error);
        console.log(err.message);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { response, error, loading };
};

export default useAxios;
