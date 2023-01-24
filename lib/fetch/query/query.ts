import axios, { AxiosRequestConfig } from 'axios';
import { useQuery } from 'react-query';
import useSWR from 'swr';

export function query(url: string, queryKey: string, apiKey?: string, options?: AxiosRequestConfig) {
  const { data, status } = useQuery(
    [queryKey, { url, options, apiKey }],
    async () => {
      try {
        const response = await axios.request({
          url,
          ...options,
          headers: {
            'X-API-Key': apiKey,
            ...options.headers,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return { data, status };
}

export function simpleQuery<T>(url: string, queryKey: string): T {
  const { data, status } = useQuery(queryKey, () =>
    fetch(url).then((res) => res.json())
  );

  if (!data) {
    return status as T;;
  }

  return data as T;;
}

// Example:
// const users = apiQuery<User[]>('/api/users', 'users');
// const user = apiQuery<User>('/api/users/1', 'user');


export const axiosQuery = (url: string, apiKey?: string, options?: AxiosRequestConfig) => {
  const fetcher = async () => {
    try {
      const response = await axios.request({
        url,
        ...options,
        headers: {
          'X-API-Key': apiKey,
          ...options.headers,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error } = useSWR(url, fetcher);
  return [data, error];
};