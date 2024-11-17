import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // Reload the page after logout
  };

  useEffect(() => {
    // Function to fetch the cart data
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // If no token, don't fetch cart data

        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the structure of the response to confirm its correctness
        console.log("Cart API response:", response.data);

        // Check and update cart count based on the response structure
        if (response.data && response.data.cart && Array.isArray(response.data.cart.items)) {
          setCartCount(response.data.cart.items.length);
        } else if (response.data && Array.isArray(response.data.items)) {
          setCartCount(response.data.items.length); // Fallback case
        } else {
          setCartCount(0); // If no items, set to 0
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartCount(0); // Default to 0 in case of an error
      }
    };

    fetchCart(); // Fetch cart on component load
  }, []); // Only run once when the component mounts

  return (
    <div className="navbar">
      <Link to="/">
        <h2>Educart</h2>
      </Link>
      <ul className="navbar-ul">
        <Link to="/cart">
          <li>
            &#128722;{" "}
            <span className="cart-count" style={{ color: "red" }}>
              ({cartCount})
            </span>
          </li>
        </Link>
        <Link to="/orders">
          <li>Orders</li>
        </Link>

        {localStorage.getItem("token") ? (
          <>
            <span className="username">User</span>
            <button onClick={handleLogout} className="nav-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="nav-btn">Login</button>
            </Link>
            <Link to="/register">
              <button className="nav-btn">Register</button>
            </Link>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
