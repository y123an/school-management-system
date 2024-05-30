import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AccountMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { currentRole, currentUser } = useSelector((state) => state.user);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex items-center">
        <button onClick={handleMenuToggle} className="ml-2 focus:outline-none">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            {String(currentUser.name).charAt(0)}
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 top-14 z-20 focus:outline-none">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="px-4 py-2">
              <Link
                to={`/${currentRole}/profile`}
                className="block text-gray-800 hover:bg-gray-100"
                role="menuitem"
              >
                Profile
              </Link>
            </div>
            <hr />
            <div className="px-4 py-2">
              <Link
                to="/logout"
                className="block text-gray-800 hover:bg-gray-100"
                role="menuitem"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountMenu;
