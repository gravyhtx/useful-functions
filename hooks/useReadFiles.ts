import useSWR from "swr";

// RETURN DATA FROM STATIC FILES IN PUBLIC DIRECTORY 
export const useReadFiles = ( path: string ) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data } = useSWR(`/api/readFiles?path=${path}`, fetcher);

  if(!data) {
    return null;
  }
  
  return data;
}