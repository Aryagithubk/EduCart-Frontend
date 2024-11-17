import React from "react";
import "./Item.css";

function Item({
  name,
  rating,
  price,
  saleDiscount,
  image,
  brand,
  description,
}) {
  return (
    <div className="item-card" data-discount={saleDiscount ? "true" : "false"}>
      <div className="item-image-wrapper">
        <img src={image} alt={"Item image"} className="item-image" />
      </div>
      <div className="item-content">
        <div className="item-brand">{brand}</div>
        <div className="item-name">{name}</div>
        {saleDiscount && (
          <div className="item-discount">Sale {saleDiscount}% off</div>
        )}
        <div className="item-info">
          <div className="item-price">
            <span className="item-price-inr">₹{price}</span>
          </div>
          <div className="item-rating">{rating}&#9733;</div>
        </div>
        <div className="item-description">{description}</div>
      </div>
    </div>
  );
}

export default Item;
