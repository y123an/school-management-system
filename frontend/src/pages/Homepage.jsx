import React from "react";
import { Link } from "react-router-dom";
import { Students } from "../assets/Images";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        <img
          src={Students}
          alt="students"
          className="w-full h-64 object-cover"
        />
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to
              <br />
              School Management
              <br />
              System
            </h1>
            <p className="mt-4 text-gray-600">
              Simplify school administration, organize classes efficiently, and
              manage student and faculty enrollment. Easily monitor attendance,
              evaluate performance, and offer feedback. Access and review
              records, track grades, and communicate smoothly.
            </p>
          </div>
          <div className="mt-8 flex justify-center items-center gap-5">
            <Link
              to="/login"
              state={{ role: "SuperAdmin" }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login as Super Admin
            </Link>
            <Link
              to="/login"
              state={{ role: "Admin" }}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Login as Admin
            </Link>
            <Link
              to="/login"
              state={{ role: "Teacher" }}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition duration-300"
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
