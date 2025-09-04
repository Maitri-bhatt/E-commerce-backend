import { Spin } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";

export default function CartCard({ productID, quantity, onRemove, cartID }) {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/v1/product/get-product-by-id/${productID}`
      )
      .then((resp) => {
        setProduct(resp.data.product);
        setLoading(false);
      });
  }, [productID]);

  if (loading) return <Spin />;

  return (
    <div className="row mb-2 p-3 card flex-row">
      <div className="col-md-4">
        <img
          src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
          className="card-img-top"
          alt={product.name}
          width="100px"
          height={"100px"}
        />
      </div>
      <div className="col-md-8">
        <p>{product.name}</p>
        <p>{product.description.substring(0, 30)}</p>
        <p>Quantity: {quantity}</p>
        <p>Unit Price : {product.price}</p>
        <button className="btn btn-danger" onClick={() => onRemove(cartID)}>
          Remove
        </button>
      </div>
    </div>
  );
}
