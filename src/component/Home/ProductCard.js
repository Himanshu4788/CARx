import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";

const ProductCard = ({ product }) => {
  // If no product is passed, just don't render anything
  if (!product) {
    return null;
  }

  const options = {
    value: product?.ratings || 0, // Safely access ratings, default to 0
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Link className="productCard" to={`/product/${product?._id}`}>
      {/* Use optional chaining for safe access */}
      <img src={product?.images[0]?.url} alt={product?.name} />
      <p>{product?.name}</p>
      <div>
        <Rating {...options} />{" "}
        <span className="productCardSpan">
          {" "}
          ({product?.numOfReviews || 0} Reviews)
        </span>
      </div>
      <span>{`₹${product?.price}`}</span>
    </Link>
  );
};

export default ProductCard;