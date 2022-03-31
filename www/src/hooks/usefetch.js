import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [value, setTestableSudoku] = useState(null);

  useEffect(() => {
    if (!value) return;
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [url, value]);

  return { error, isLoaded, setTestableSudoku, data, setIsLoaded };
};
