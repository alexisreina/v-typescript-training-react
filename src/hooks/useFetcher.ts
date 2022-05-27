import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';
import type { Response } from '../types';

export enum Api {
  assets = '/assets',
  assetTypes = '/asset-types',
  persons = '/persons',
}

export const fetcher = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export type UseFetcherParams = {
  url: string;
};

export function useFetcher<T>({ url }: UseFetcherParams) {
  const [refetch, setRefetch] = useState(true);
  const [data, setData] = useState<T>();

  const reload = useCallback(() => {
    setRefetch(true);
  }, []);

  useEffect(() => {
    if (refetch) {
      fetcher
        .get<Response<T>>(url)
        .then((res) => res.data)
        .then((data) => setData(data.result))
        .catch((error) => console.log(error))
        .finally(() => setRefetch(false));
    }
  }, [refetch, url]);

  return [data, reload] as const;
}
