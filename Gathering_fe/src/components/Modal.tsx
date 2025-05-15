type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div>
      <div>
        <button onClick={onClose}>✖</button>
        <h2>{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
