import { useEffect, useState } from "react";

export default function useFetch<T>(url: string) {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}${url}`);
        if (!response.ok) {
          throw new Error("Failed to Fetch Data");
        }
        const result: T = await response.json();
        setData(result);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown Error Occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return {
    loading,
    error,
    data,
  };
}
