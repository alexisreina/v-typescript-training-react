import { useState, useRef } from 'react';

import { ReactComponent as IconEdit } from '../assets/edit.svg';
import { ReactComponent as IconDelete } from '../assets/delete.svg';
import { Modal } from '../components';
import { useFetcher, Api, fetcher } from '../hooks/useFetcher';
import type { AssetType } from '../types';

function AssetTypesPage() {
  const [currentAssetType, setCurrentAssetType] = useState<AssetType | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const [types, refetchTypes] = useFetcher<AssetType[]>({
    url: Api.assetTypes,
  });

  const addAssetType = () => {
    setModalOpen(false);
    const elements = formRef.current?.elements as any;
    const id = elements?.id.value;
    const label = elements?.label.value;

    const data = {
      label,
    };

    const url = id ? `${Api.assetTypes}/${id}` : Api.assetTypes;

    console.log(data, url);

    fetcher
      .post(url, data)
      .then((response) => console.log(response))
      .then(() => {
        refetchTypes();
      })
      .catch((error) => console.log(error))
      .finally(() => setCurrentAssetType(null));
  };

  const deleteAssetType = (id: AssetType['id']) => {
    if (window.confirm('Are you sure?') === true) {
      fetcher
        .delete(`${Api.assetTypes}/${id}`)
        .then((response) => console.log(response))
        .then(() => {
          refetchTypes();
        })
        .catch((error) => console.log(error))
        .finally(() => setCurrentAssetType(null));
    }
  };

  const editAssetType = (assetType: AssetType) => {
    setCurrentAssetType({ ...assetType });
    setModalOpen(true);
  };

  const onCancel = () => {
    setModalOpen(false);
    setCurrentAssetType(null);
  };

  if (!types) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <section>
        <h2>Assets Types</h2>

        <div className="table">
          <div className="row">
            <div className="col">
              <strong>#</strong>
            </div>
            <div className="col">
              <strong>label</strong>
            </div>
            <div className="col">
              <strong>actions</strong>
            </div>
          </div>

          {types.length > 0 ? (
            <>
              {types.map((type) => (
                <div className="row" key={type.id}>
                  <div className="col">{type.id}</div>
                  <div className="col">{type.label}</div>
                  <div className="col actions-col">
                    <button
                      className="action-button"
                      onClick={() => editAssetType(type)}
                    >
                      <IconEdit width="18" height="18" fill="#222" />
                    </button>

                    <button
                      className="action-button"
                      onClick={() => deleteAssetType(type.id)}
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
            New Type
          </button>
        </div>
      </section>

      <Modal
        title="Add New Type"
        open={modalOpen}
        onOk={addAssetType}
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
              id="assetType_id"
              name="id"
              defaultValue={currentAssetType?.id}
            />
          </p>
          <p className="form-control">
            <label className="label" htmlFor="assetType_label">
              Label
            </label>
            <input
              className="input"
              type="text"
              id="assetType_label"
              name="label"
              defaultValue={currentAssetType?.label}
            />
          </p>
        </form>
      </Modal>
    </div>
  );
}

export default AssetTypesPage;
