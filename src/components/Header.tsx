import { useAuth } from "@/context/AuthContext";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { username, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg ml-12 md:ml-0">
      <h2 className="text-md md:text-lg font-bold">Welcome! {username}</h2>
      <div className="flex space-x-4 items-center">
        <FaBell className="text-gray-600 text-xl cursor-pointer" />
        <div className="relative" ref={dropdownRef}>
          <FaUserCircle
            className="text-gray-600 text-xl cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FaSignOutAlt className="mr-2 text-red-600" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
