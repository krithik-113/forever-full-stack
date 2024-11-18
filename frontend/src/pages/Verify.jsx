import { shopContext } from '../context/ShopContext'
import axios from 'axios'
import React, { useEffect, useContext } from "react";
import { toast } from 'react-toastify'
import {useSearchParams} from 'react-router-dom'

const Verify = () => {
    const { navigate, token, setCartItems } = useContext(shopContext)
    const [searchParams, setSearchParams] = useSearchParams()
    
    const success = searchParams.get('success')
    const orderId = searchParams.get("orderId");
    
    const verifyPayment = async () => {
        if (!token) {
            return null
        }
        try {
             const res = await axios.post("/api/order/verifyStripe", {success,orderId}, { headers: { token } });
        if (res.data.success) {
            setCartItems({})
            navigate('/orders')
        } else {
            navigate('/cart')
        }
        } catch (err) {
            console.log(err.message)
            toast.error(err.message);
        }
        
    }

    useEffect(() => {
        verifyPayment()
    },[token])
  return (
      <div>
          
    </div>
  )
}

export default Verify