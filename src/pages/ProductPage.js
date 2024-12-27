import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../context/AuthContext'; 

const ProductPage = () => {
  console.log("Product Page loaded");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("https://dummyjson.com/products");
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // if (categoryFilter && categoryFilter !== "all") {
    //   updatedProducts = updatedProducts.filter(
    //     (product) => product.category === categoryFilter
    //   );
    // }

    if (sortOrder === "low-to-high") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, sortOrder, categoryFilter, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 p-4 flex justify-between items-center text-white shadow-md">
        <h1 className="text-xl font-semibold">Product Page</h1>

        <div className="relative flex items-center justify-end space-x-6">
          <div className="relative group flex items-center space-x-4">

            {user ? (
              <div className="flex items-center space-x-3">
              
                <button 
                  onClick={logout} 
                  className="text-sm text-red-500 hover:text-red-800 transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">You are not logged in.</p>
            )}

            <div className="relative">
              <FontAwesomeIcon
                icon={faShoppingCart}
                size="2x"
                className="cursor-pointer text-gray-800 hover:text-gray-600 transition duration-200"
              />

              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>

              <div className="group-hover:block absolute right-0 mt-2 w-72 bg-white border border-gray-300 shadow-xl rounded-lg p-4 hidden z-10">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Cart</h3>
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-600">No items in cart</p>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm bg-gray-100 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{item.title}</span>
                          <span className="text-xs text-gray-500">(x{item.quantity})</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-blue-500 font-semibold text-sm">
                          ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveFromCart(item)}
                            className="ml-2 text-white text-xs bg-red-500 px-2 py-1 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-300 flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-800">Total:</span>
                      <span className="text-xl font-semibold text-blue-500">
                        ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 w-full sm:w-1/3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        

          <div className="flex space-x-4 w-full sm:w-auto">
            <button
              onClick={() => setSortOrder("low-to-high")}
              className="p-3 w-full sm:w-auto bg-blue-500 text-white rounded-lg shadow-md focus:outline-none hover:bg-blue-600"
            >
              Sort: Price (Low to High)
            </button>
            <button
              onClick={() => setSortOrder("high-to-low")}
              className="p-3 w-full sm:w-auto bg-blue-500 text-white rounded-lg shadow-md focus:outline-none hover:bg-blue-600"
            >
              Sort: Price (High to Low)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
              <img
                src={product.images}
                alt={product.title}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-xl font-bold text-blue-500">₹{product.price}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 mx-1 border rounded-lg ₹{
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 border-blue-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
