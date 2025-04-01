"use client";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaCog,
  FaQrcode,
  FaChevronRight,
} from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GrDocumentText } from "react-icons/gr";
import { CiGrid42 } from "react-icons/ci";
import { useDashboard } from "@/context/DashboardContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeComponent, setActiveComponent } = useDashboard();

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-green-600 p-3 rounded-md shadow-sm"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar Content */}
      <div
        className={`${
          isOpen ? "fixed inset-0 z-40 md:relative" : "hidden md:block"
        } h-full`}
      >
        {/* Backdrop for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
            onClick={toggleMenu}
          />
        )}

        {/* Main Sidebar */}
        <div
          className={`fixed md:relative inset-y-0 left-0 w-full md:w-80 lg:w-96 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } transition-transform duration-300 ease-in-out bg-gradient-to-b from-green-600 to-green-400 h-full overflow-y-auto`}
        >
          {/* Dashboard Title */}
          <div className="p-6">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-6 mx-auto text-center border border-black shadow-sm bg-white text-black rounded py-1 px-4">
              <CiGrid42 size={24} />
              <span>Dashboard</span>
            </div>

            {/* Navigation Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                Navigation
              </h3>
              <div className="space-y-2 overflow-hidden">
                <button
                  className={`flex text-lg items-center w-full px-4 py-3 border border-black shadow-sm rounded-sm ${
                    activeComponent === "dashboard"
                      ? "bg-yellow-200"
                      : "bg-white"
                  }`}
                  onClick={() => {
                    setActiveComponent("dashboard");
                    toggleMenu();
                  }}
                >
                  <FaMoneyBillTransfer className="mr-2 text-2xl" />
                  <div className="flex flex-col text-left flex-1">
                    <span className="font-semibold">Recent Transactions</span>
                    <span className="text-sm text-gray-600">
                      Your recent transactions.
                    </span>
                  </div>
                  <FaChevronRight className="text-gray-500" />
                </button>

                <button
                  className={`flex text-lg items-center w-full px-4 py-3 border border-black shadow-sm rounded-sm ${
                    activeComponent === "statement"
                      ? "bg-yellow-200"
                      : "bg-white"
                  }`}
                  onClick={() => {
                    setActiveComponent("statement");
                    toggleMenu();
                  }}
                >
                  <GrDocumentText className="mr-2 text-2xl" />
                  <div className="flex flex-col text-left flex-1">
                    <span className="font-semibold">Statement</span>
                    <span className="text-sm text-gray-600">
                      Your statement will appear here.
                    </span>
                  </div>
                  <FaChevronRight className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-6 left-6 space-y-4">
              <button
                className={`flex items-center space-x-2 text-white hover:text-gray-200 ${
                  activeComponent === "settings" ? "text-yellow-200" : ""
                }`}
                onClick={() => {
                  setActiveComponent("settings");
                  toggleMenu();
                }}
              >
                <FaCog />
                <span>Settings</span>
              </button>
              <button className="flex items-center space-x-2 text-white hover:text-gray-200">
                <FaQrcode />
                <span>Scan QR</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
