import React from "react";

type AlertCardProps = {
  message: string;
  description: string;
  buttonLabel?: string;
  onClose?: () => void;
  visible: boolean;
};

export const AlertCard: React.FC<AlertCardProps> = ({
  message,
  description,
  buttonLabel = "Aceptar",
  onClose,
  visible,
}) => {
  if (!visible) {return null;}

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">{message}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <button
          onClick={onClose}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};
