import axios from "axios";
import { useEffect, useState } from "react";
import { getUserName } from "../helper/helper";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_SERVER_DOMAIN;

/** custom hook */
export default function useFetch(query) {
  const [getData, setData] = useState({
    isLoading: false,
    apiData: undefined,
    status: null,
    serverError: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));

        const { username } = !query ? await getUserName() : "";

        const { data, status } = !query
          ? await axios.get(`/api/user/${username}`)
          : axios.get(`/api/${query}`);

        if (status === 200) {
          setData((prev) => ({ ...prev, isLoading: false }));
          setData((prev) => ({ ...prev, apiData: data, status: status }));
        }

        setData((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        setData((prev) => ({ ...prev, isLoading: false, serverError: error }));
      }
    };
    fetchData();
  }, [query]);

  return [getData, setData];
}
