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
  const [statusCode, setStatusCode] = useState(true);

  const fetchData = () => {
    axios[method](url, headers, JSON.parse(body))
      .then((res) => {
        setResponse(res.data);
        setStatusCode(res.status);
        callback(res);
      })
      .catch((err) => {
        setError(err.response.data.error);
        setStatusCode(err.response.status);
        console.error(err.message);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { response, error, loading, statusCode };
};

export default useAxios;
