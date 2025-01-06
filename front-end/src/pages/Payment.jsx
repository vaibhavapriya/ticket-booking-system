import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const stripePromise = loadStripe("pk_test_51QdwPyRp7phkNDrX9me5E2ApqOunpHREjA8WXHSyaSQQoo5vkRpRYOvf4JKOdORcLdjrsvC2RncX7jJ5cRySvaJE003nbEXNO5");

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    showId,
    movieName,
    theaterName,
    theaterLocation,
    screenName,
    selectedSeats,
    totalPrice,
  } = location.state || {};

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [navigate, location.pathname]);

  const usdPrice = (totalPrice / 80).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet. Please try again later.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to continue.");
      navigate("/login");
      return;
    }

    if (!email || !phoneNumber) {
      alert("Email and phone number are required.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "https://ticket-booking-system-7vpl.onrender.com/api/pay/createpaymentintent",
        { amount: usdPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = data.clientSecret;

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentResult.error) {
        setMessage(`Payment failed: ${paymentResult.error.message}`);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        setMessage("Payment succeeded!");
        const bookingData = {
          showId,
          selectedSeats,
          movieName,
          theaterName,
          theaterLocation: theaterLocation || "Unknown Location",
          screenName,
          totalPrice,
          orderId: paymentResult.paymentIntent.id,
          email,
          phoneNumber,
        };

        await axios.post("https://ticket-booking-system-7vpl.onrender.com/api/bookings", bookingData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/confirmation", { state: { bookingData } });
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        console.error("Error processing payment:", error);
        setMessage("Payment failed. Please try again.");
      }
    }

    setIsLoading(false);
  };

  return (
    <div>
      <Header />
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center">
      <div className="max-w-4xl w-full px-6 py-8 bg-[#2d2d2d] mt-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-[#db0a5b] mb-6">
          Booking Confirmation
        </h1>
        <div className="mb-6">
          <p>
            <strong>Movie Name:</strong> {movieName}
          </p>
          <p>
            <strong>Theater:</strong> {theaterName}
          </p>
          <p>
            <strong>Screen:</strong> {screenName}
          </p>
          <p>
            <strong>Location:</strong> {theaterLocation}
          </p>
          <p>
            <strong>Selected Seats:</strong> {selectedSeats.join(", ")}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{totalPrice} (USD: ${usdPrice})
          </p>
        </div>
        <h2 className="text-2xl font-bold text-[#db0a5b] mb-4">
          Complete Your Payment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-600 focus:ring-[#db0a5b] focus:ring-2 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              placeholder="Add country code"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-600 focus:ring-[#db0a5b] focus:ring-2 focus:outline-none"
              required
            />
          </div>
          <p>card info:4242 4242 4242 4242 12/25 123 10001</p>
          <div className="p-4 border border-gray-600 rounded-lg bg-[#1a1a1a]">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#fff",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full bg-[#db0a5b] py-3 rounded-lg text-white font-semibold hover:bg-[#f62459] transition"
          >
            {isLoading ? "Processing..." : `Pay $${usdPrice}`}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-red-500">
            {message}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default Payment;
