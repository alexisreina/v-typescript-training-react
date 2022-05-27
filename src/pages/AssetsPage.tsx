import { useState, useRef } from 'react';

import { ReactComponent as IconEdit } from '../assets/edit.svg';
import { ReactComponent as IconDelete } from '../assets/delete.svg';
import { Modal } from '../components';
import { useFetcher, Api, fetcher } from '../hooks/useFetcher';
import type { Person, AssetType, Asset } from '../types';

function AssetsPage() {
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const [people, refetchPeople] = useFetcher<Person[]>({ url: Api.persons });
  const [assets, refetchAssets] = useFetcher<Asset[]>({ url: Api.assets });
  const [types, refetchTypes] = useFetcher<AssetType[]>({
    url: Api.assetTypes,
  });

  const getPersonName = (id: string): string => {
    const person = people?.find((person) => id === person.id);

    if (!person) {
      return 'Unknown person';
    }
    return `${person.firstName} ${person.lastName}`;
  };

  const getType = (id: string): string => {
    return types?.find((type) => id === type.id)?.label || 'Unkown type';
  };

  const addAsset = () => {
    setModalOpen(false);
    const elements = formRef.current?.elements as any;
    const id = elements?.id.value;
    const name = elements?.name.value;
    const assetTypeId = elements?.assetTypeId.value;
    const personId =
      elements?.personId.value === 'unassigned'
        ? null
        : elements?.personId.value;

    const data = {
      name,
      assetTypeId,
      personId,
    };

    const url = id ? `${Api.assets}/${id}` : Api.assets;

    console.log(data, url);

    fetcher
      .post(url, data)
      .then((response) => console.log(response))
      .then(() => {
        refetchAssets();
        refetchPeople();
        refetchTypes();
      })
      .catch((error) => console.log(error))
      .finally(() => setCurrentAsset(null));
  };

  const deleteAsset = (id: Asset['id']) => {
    if (window.confirm('Are you sure?') === true) {
      fetcher
        .delete(`${Api.assets}/${id}`)
        .then((response) => console.log(response))
        .then(() => {
          refetchAssets();
          refetchPeople();
          refetchTypes();
        })
        .catch((error) => console.log(error))
        .finally(() => setCurrentAsset(null));
    }
  };

  const editAsset = (asset: Asset) => {
    setCurrentAsset({ ...asset });
    setModalOpen(true);
  };

  const onCancel = () => {
    setModalOpen(false);
    setCurrentAsset(null);
  };

  if (!assets || !people || !types) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <section>
        <h2>Assets</h2>

        <div className="table">
          <div className="row">
            <div className="col">
              <strong>#</strong>
            </div>
            <div className="col">
              <strong>name</strong>
            </div>
            <div className="col">
              <strong>type</strong>
            </div>
            <div className="col">
              <strong>person</strong>
            </div>
            <div className="col">
              <strong>actions</strong>
            </div>
          </div>

          {assets.length > 0 ? (
            <>
              {assets.map((asset) => (
                <div className="row" key={asset.id}>
                  <div className="col">{asset.id}</div>
                  <div className="col">{asset.name}</div>
                  <div className="col">{getType(asset.assetTypeId)}</div>
                  <div className="col">
                    {asset.personId
                      ? getPersonName(asset.personId)
                      : 'Unassigned'}
                  </div>
                  <div className="col actions-col">
                    <button
                      className="action-button"
                      onClick={() => editAsset(asset)}
                    >
                      <IconEdit width="18" height="18" fill="#222" />
                    </button>

                    <button
                      className="action-button"
                      onClick={() => deleteAsset(asset.id)}
                    >
                      <IconDelete width="18" height="18" fill="#222" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="empty">Sorry, there're no assets :( </p>
          )}
        </div>

        <div className="app-actions">
          <button className="button" onClick={() => setModalOpen(true)}>
            New Asset
          </button>
        </div>
      </section>

      <Modal
        title="Add Asset"
        open={modalOpen}
        onOk={addAsset}
        onCancel={onCancel}
      >
        <form
          ref={formRef}
          name="new_asset"
          onSubmit={(e) => e.preventDefault()}
        >
          <p className="form-control">
            <input
              className="input"
              type="hidden"
              id="asset_id"
              name="id"
              defaultValue={currentAsset?.id}
            />
          </p>
          <p className="form-control">
            <label className="label" htmlFor="asset_name">
              Name
            </label>
            <input
              className="input"
              type="text"
              id="asset_name"
              name="name"
              defaultValue={currentAsset?.name}
            />
          </p>

          <p className="form-control">
            <label className="label" htmlFor="asset_type">
              Type
            </label>
            <select
              className="input"
              id="asset_type"
              name="assetTypeId"
              defaultValue={currentAsset?.assetTypeId}
            >
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </p>

          <p className="form-control">
            <label className="label" htmlFor="asset_person">
              Person
            </label>
            <select
              className="input"
              id="asset_person"
              name="personId"
              defaultValue={currentAsset?.personId ?? 'unassigned'}
            >
              <option value="unassigned">Unassigned</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.firstName} {person.lastName}
                </option>
              ))}
            </select>
          </p>
        </form>
      </Modal>
    </div>
  );
}

export default AssetsPage;
