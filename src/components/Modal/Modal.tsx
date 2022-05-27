import { useEffect, useRef } from 'react';

import './Modal.css';

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onOk: React.MouseEventHandler<HTMLButtonElement>;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
}

export const Modal: React.FC<ModalProps> = ({
  open = false,
  title,
  onCancel,
  onOk,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-dialog" tabIndex={0} ref={ref}>
        <header>
          <h4 className="modal-title">{title}</h4>
        </header>
        <section>{children}</section>
        <footer className="modal-footer">
          <button className="button button-outline" onClick={onCancel}>
            Cancel
          </button>

          <button className="button" onClick={onOk}>
            Ok
          </button>
        </footer>
      </div>
    </div>
  );
};
