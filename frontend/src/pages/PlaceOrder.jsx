import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    setCartItems,
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(shopContext);

  const [formData, setFromData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFromData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: "rzp_test_wjDOlkCWhEkyVI",
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Description",
      order_id: order._id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const response_data = await axios.post('/api/order/verifyRazorpay', response, { headers: { token } })
          if (response_data.data.success) {
            navigate('/orders')
            setCartItems({})
          } else {
            
          }
        } catch (err) {
          console.log(err)
          toast.error(err.message)
        }
      },
    };
    const rzp = new window.Razorpay(options)
    rzp.open()
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemsInfo = structuredClone(products.find(product => product._id === items))
            if (itemsInfo) {
              itemsInfo.size = item 
              itemsInfo.quantity = cartItems[items][item]
              orderItems.push(itemsInfo)
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        
      }
      switch (method) {
        // API Calls for COD
        case "cod":
          const res = await axios.post('/api/order/place',  orderData , { headers: { token } })
          console.log(res.data)
          if (res.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(res.data.message)
          }
          break;
        
        case "stripe":
           const stripe = await axios.post("/api/order/stripe", orderData, { headers: { token }});
          if (stripe.data.success) {
             const { session_url } = stripe.data 
             window.location.replace(session_url)
           } else {
             toast.error(stripe.data.message);
           }
          break
        
        case "razorpay":
          const razorpay = await axios.post('/api/order/razorpay',  orderData , { headers: { token } })
          if (razorpay.data.success) {
            initPay(razorpay.data.order)
          }
        break
        
        default:
          break
      }
    } catch (error) {
      console.log(error.message)
      toast.error(error.message);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* -------------- Left Side ----------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            value={formData.firstName}
            onChange={onChangeHandler}
            name="firstName"
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            value={formData.lastName}
            onChange={onChangeHandler}
            name="lastName"
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          value={formData.email}
          onChange={onChangeHandler}
          name="email"
          type="email"
          placeholder="Email address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          required
          value={formData.street}
          onChange={onChangeHandler}
          name="street"
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex gap-3">
          <input
            required
            value={formData.city}
            onChange={onChangeHandler}
            name="city"
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            value={formData.state}
            onChange={onChangeHandler}
            name="state"
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            value={formData.zipcode}
            onChange={onChangeHandler}
            name="zipcode"
            type="number"
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            value={formData.country}
            onChange={onChangeHandler}
            name="country"
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          value={formData.phone}
          onChange={onChangeHandler}
          name="phone"
          type="number"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>
      {/* -------------- Right Side ----------------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* -------------- Payment Method Selection -------------------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.stripe_logo} className="h-5 mx-4" alt="" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.razorpay_logo} className="h-5 mx-4" alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              className="bg-black text-white px-16 py-3 text-sm"
              type="submit"
            >
              {" "}
              PLACE ORDER{" "}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
