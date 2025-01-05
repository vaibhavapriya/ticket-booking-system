import React, { useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Initialize Stripe with your public key
const stripePromise = loadStripe("pk_test_51QdwPyRp7phkNDrX9me5E2ApqOunpHREjA8WXHSyaSQQoo5vkRpRYOvf4JKOdORcLdjrsvC2RncX7jJ5cRySvaJE003nbEXNO5");

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure data passed from the booking page
  const {
    movieName,
    theaterName,
    location: theaterLocation,
    screenName,
    selectedSeats,
    totalPrice,
  } = location.state || {};

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const usdPrice = (totalPrice / 80).toFixed(2); // Convert INR to USD

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet. Please try again later.");
      return;
    }

    setIsLoading(true);

    try {
      // Create a payment intent on the server
      const { data } = await axios.post("http://localhost:5000/api/pay/createpaymentintent", {
        amount: usdPrice, // Send USD amount
      });

      const clientSecret = data.clientSecret;

      // Confirm the payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentResult.error) {
        setMessage(`Payment failed: ${paymentResult.error.message}`);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        setMessage("Payment succeeded!");
        // Navigate to the confirmation page after success
        // navigate("/confirmation", {
        //   state: {
        //     movieName,
        //     theaterName,
        //     theaterLocation,
        //     screenName,
        //     selectedSeats,
        //     totalPrice,
        //   },
        // });
        console.log("nextpost")
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setMessage("Payment failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div className="confirmation-page">
        <h1>Booking Confirmation</h1>
        <p><strong>Movie Name:</strong> {movieName}</p>
        <p><strong>Theater:</strong> {theaterName}</p>
        <p><strong>Screen:</strong> {screenName}</p>
        <p><strong>Location:</strong> {theaterLocation}</p>
        <p><strong>Selected Seats:</strong> {selectedSeats.join(", ")}</p>
        <p><strong>Total Price:</strong> ₹{totalPrice} (USD: ${usdPrice})</p>
      </div>

      <div className="payment-page">
        <h2>Complete Your Payment</h2>
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
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
          <button
            type="submit"
            disabled={!stripe || isLoading}
            className="payment-button"
          >
            {isLoading ? "Processing..." : `Pay $${usdPrice}`}
          </button>
        </form>
        {message && <div className="payment-message">{message}</div>}
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
