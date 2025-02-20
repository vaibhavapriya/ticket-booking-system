import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    navigate("/login");// Redirect to login page
  };

  return (
    <header className="bg-black text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 pb-6">
        <div className="text-2xl font-bold cursor-pointer text-[#db0a5b]" onClick={() => navigate("/")}>
          Movie Theater
        </div>
        <nav>
          <ul className="flex space-x-6">
                    <li
                      className="cursor-pointer hover:text-gray-300"
                      onClick={() => navigate("/viewbookings")}
                    >
                      View Bookings
                    </li>

                <li
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => navigate("/login")}
                >
                  Login
                </li>


                <li
                  className="cursor-pointer text-red-500 hover:text-red-400"
                  onClick={handleLogout}
                >
                  Logout
                </li>

                
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
