import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.cart.items)) {
          setCart(response.data.cart.items);
        } else {
          setMessage('Failed to load cart.');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to fetch cart. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!address || !paymentType || (paymentType === 'paid' && !transactionId)) {
      setMessage('Please fill out all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication error. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/checkout',
        {
          address,
          paymentType,
          transactionId: paymentType === 'paid' ? transactionId : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Order placed successfully!');
      setCart([]);
      setAddress('');
      setPaymentType('');
      setTransactionId('');
      setError(null);

      setTimeout(() => {
        // window.location.reload(); // Reload page
        navigate('/'); // Redirect to home
      }, 2000);
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('Failed to place the order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      {isLoading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="order-summary">
          <h2 className="summary-title">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.product._id} className="cart-item">
                  {item.product.name} - {item.quantity} x ₹{item.product.price}
                </li>
              ))}
            </ul>
          )}
          <h3 className="total-amount">
            Total: ₹
            {cart.reduce(
              (total, item) => total + item.product.price * item.quantity,
              0
            )}
          </h3>
        </div>
      )}

      <form onSubmit={handleCheckout} className="checkout-form">
        <div className="form-group">
          <label className="form-label">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Payment Type:</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select Payment Type</option>
            <option value="paid">Paid</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
        {paymentType === 'paid' && (
          <div className="form-group">
            <label className="form-label">Transaction ID:</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter Transaction ID"
              className="form-input"
              required
            />
          </div>
        )}
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Checkout;
