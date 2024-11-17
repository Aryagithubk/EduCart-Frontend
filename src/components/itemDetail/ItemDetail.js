import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./ItemDetail.css";

function ItemDetail() {
  const params = useParams();
  const itemId = params?.id; // Get the item ID from the URL parameters
  const [item, setItem] = useState(null); // State to hold the item details
  const [isAdded, setIsAdded] = useState(false); // State to check if the item is already in the cart

  // Fetch item details from backend
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${itemId}`
        );
        setItem(response.data); // Set the item data to state
      } catch (error) {
        console.error("Error fetching item details", error);
      }
    };

    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId]);

  // Check if the item is already in the cart
  useEffect(() => {
    const checkItemInCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          },
        });

        if (response.data.cart && response.data.cart.length) {
          const itemInCart = response.data.cart.find(
            (cartItem) => cartItem.id === itemId
          );
          setIsAdded(!!itemInCart); // Set the state if the item is already in the cart
        }
      } catch (error) {
        console.error("Error checking cart", error);
      }
    };

    if (itemId) {
      checkItemInCart();
    }
  }, [itemId]);

  // Add item to cart
  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/cart/${itemId}`,
        { quantity: 1 }, // Default quantity is 1
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token in header for authentication
          },
        }
      );

      if (response.status === 200) {
        setIsAdded(true); // Update the UI to show that the item has been added to the cart
      }

      // Optionally reload the page to show cart changes, or redirect to cart page
      window.location.reload();
    } catch (error) {
      console.error("Error adding item to cart", error);
    }
  };

  // If the item is still loading, show a loading message
  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="item-detail-container">
      <Link to="/"> &#8592; Back</Link>
      <div className="item-detail">
        <div className="item-detail-image">
          <img src={item.image} alt={item.name} />
        </div>
        <div className="item-detail-info">
          <div className="item-brand" style={{ margin: "0px 10px" }}>
            {item.brand}
          </div>
          <div className="item-name">{item.name}</div>
          <div className="item-price">₹{item.price}</div>

          <div className="item-size category_item">{item.category}</div>

          {/* Button to add the item to the cart */}
          <button
            className="item-btn"
            disabled={isAdded} // Disable the button if the item is already in the cart
            onClick={handleAddToCart} // Call function to add the item to the cart
          >
            {isAdded ? <Link to="/cart">Go to Cart</Link> : "Add To Cart"}
          </button>

          <p className="item-description">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
