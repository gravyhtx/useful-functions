import axios from "axios";
import useSWR from "swr";

export const axiosFetch = (url: string) => {
  const fetcher = async () => await axios.post(url).then((res) => res.data);
  const { data, error } = useSWR(url, fetcher);
  return [ data, error ];
}