import React from "react";
import { Link } from "react-router-dom";
import { Students } from "../assets/Images";

const Homepage = () => {
  return (
    <div className="min-h-screen font-poppins flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-4xl">
        <img
          src={Students}
          alt="students"
          className="w-full h-64 object-cover"
        />
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
              Welcome to the
              <br />
              School Management
              <br />
              System
            </h1>
            <p className="mt-4 text-lg font-light text-gray-600 leading-relaxed">
              Simplify school administration, organize classes efficiently, and
              manage student and faculty enrollment. Easily monitor attendance,
              evaluate performance, and offer feedback. Access and review
              records, track grades, and communicate smoothly.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/login"
              state={{ role: "SuperAdmin" }}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Login as Super Admin
            </Link>
            <Link
              to="/login"
              state={{ role: "Admin" }}
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
            >
              Login as Admin
            </Link>
            <Link
              to="/login"
              state={{ role: "Teacher" }}
              className="w-full sm:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 shadow-md"
            >
              Login as Teacher
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
