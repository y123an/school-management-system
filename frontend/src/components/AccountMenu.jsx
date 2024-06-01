import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiAccountCircleLine } from "react-icons/ri"; // Importing an icon for the profile

const AccountMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { currentRole, currentUser } = useSelector((state) => state.user);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative font-poppins">
      <div className="flex items-center">
        <button
          onClick={handleMenuToggle}
          className="ml-2 focus:outline-none flex items-center"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700">
            <RiAccountCircleLine className="text-xl" />
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="px-4 py-2">
              <Link
                to={`/${currentRole}/profile`}
                className="block text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                role="menuitem"
              >
                Profile
              </Link>
            </div>
            <hr />
            <div className="px-4 py-2">
              <Link
                to="/logout"
                className="block text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                role="menuitem"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
