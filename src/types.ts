export type Response<T> = {
  ok: boolean;
  date: number;
  result?: T;
  message?: string;
};

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
};

export type AssetType = {
  id: string;
  label: string;
};

export type Asset = {
  id: string;
  name: string;
  assetTypeId: AssetType['id'];
  personId: Person['id'] | null;
};
