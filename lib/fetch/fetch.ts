import axios from "axios";
import useSWR from "swr";

export const axiosFetch = (url: string) => {
  const fetcher = async () => await axios.post(url).then((res) => res.data);
  const { data, error } = useSWR(url, fetcher);
  return [ data, error ];
}

export function swrFetch<Data = any, Error = any>(path: string, opts: object) {
  const fetcher = (path: string) => fetch(path).then((res) => res.json());
  const { data, mutate, error } = useSWR<Data, Error>(path, fetcher);
  const loading = !data && !error;

  return {
    error,
    loading,
    data: data,
    mutate,
  } as const;
}