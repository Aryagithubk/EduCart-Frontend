import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalState";
import "./Cart.css";

function Cart() {
  const { cart, setCart } = useContext(GlobalContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.cart) {
          setCartItems(response.data.cart.items);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCart();
  }, [cart]);

  const handleRemoveAll = async () => {
    try {
      const response = await axios.delete("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setCartItems([]);
        setCart([]);
        alert("All items removed from the cart.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error removing all items:", error);
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {!cartItems.length ? (
        <p className="empty-cart-message">No Items Added! Please add something to your cart.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.product._id}>
                <div className="item-name">{item.product.name}</div>
                <div className="item-price">₹{item.product.price}</div>
                <div className="item-expectedDelivery">(Expected Delivery 3 - 6 days)</div>
              </div>
            ))}
          </div>

          <button className="remove-all-btn" onClick={handleRemoveAll}>
            Remove All
          </button>

          <Link className="link_chekcout" to="/checkout">
            <button className="checkout-btn">Proceed to Checkout</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;
