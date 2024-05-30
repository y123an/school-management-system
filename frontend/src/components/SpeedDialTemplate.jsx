import React, { useState } from "react";
import { FaCog } from "react-icons/fa";

const SpeedDialTemplate = ({ actions }) => {
  const [open, setOpen] = useState(false);

  const toggleSpeedDial = () => {
    setOpen(!open);
  };

  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={toggleSpeedDial}
        className="bg-green-800 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
      >
        <FaCog size={24} />
      </button>
      {open && (
        <div className="absolute bottom-16 right-0 flex flex-col items-end space-y-2">
          {actions.map((action) => (
            <button
              key={action.name}
              onClick={action.action}
              className="bg-white hover:bg-gray-200 text-gray-800 p-3 rounded-full shadow-md flex items-center justify-center"
              title={action.name}
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpeedDialTemplate;
