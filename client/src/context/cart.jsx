import { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./auth";
import axios from "axios";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (auth.user) {
      setLoading(true);
      axios.get("http://localhost:8080/api/v1/auth/cart").then((resp) => {
        setCart(resp.data.cart);
        setLoading(false);
      });
    }
  }, [auth.user]);

  const setUserCart = async (productID) => {
    const resp = await axios.post(
      "http://localhost:8080/api/v1/auth/add-to-cart",
      {
        product_id: productID,
      }
    );

    const respCart = resp.data.payload.cart;
    const existingCart = cart.find((c) => c._id == respCart._id);
    if (existingCart) {
      setCart((pre) =>
        pre.map((c) => (c._id === existingCart._id ? respCart : c))
      );
    } else {
      setCart((pre) => [...pre, respCart]);
    }
    // console.log(newCart);
  };

  const deleteCart = async (cartID) => {
    // setCart((pre) => pre.filter((c) => c.productID !== productID));
    const { data } = await axios.delete(
      `http://localhost:8080/api/v1/auth/cart/${cartID}`
    );

    if (data.cart) {
      setCart((pre) =>
        pre.map((c) => (c._id == data.cart._id ? data.cart : c))
      );
    } else {
      setCart((pre) => pre.filter((c) => c._id !== cartID));
    }
  };

  return loading ? undefined : (
    <CartContext.Provider value={[cart, setUserCart, deleteCart]}>
      {children}
    </CartContext.Provider>
  );
};
// custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
