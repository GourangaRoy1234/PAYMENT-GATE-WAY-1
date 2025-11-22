// Importing the required modules and services
const { createRazorpayOrder } = require("../services/payment.service");
const crypto = require('crypto');
require('dotenv').config();

// Creating an instance of Razorpay for handling payment-related operations
const razorpayInstance = createRazorpayInstance();

// Controller function to create a new Razorpay order
exports.createOrder = async (req, res) => {
    // Extracting courseId and amount from the request body
    // Note: Amount should not be directly accepted from the client-side for security reasons
    const { courseId, amount } = res.body;

    // Fetch course details using courseId (not implemented here)
    // Setting up Razorpay order options
    const options = {
        amount: amount * 100, // Converting amount to paise as Razorpay expects the amount in the smallest currency unit
        currency: "INR", // Setting the currency to Indian Rupee
        receipt: `receipt_order_${Math.random() * 1000}` // Generating a unique receipt ID
    };

    try {
        // Creating a Razorpay order
        const order = await razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                // Handling errors during order creation
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong in creating order",
                    error: err.message
                });
            }
            // Sending the created order as a response
            return res.status(200).json(order);
        });
    } catch (error) {
        // Handling unexpected errors
        return res.status(500).json({
            success: false,
            message: "Something went wrong in creating order",
            error: error.message
        });
    }
};

// Controller function to verify the payment signature
exports.veriFyPayment = async (req, res) => {
    // Extracting order_id, payment_id, and signature from the request body
    const { order_id, payment_id, signature } = req.body;

    // Fetching the Razorpay secret key from environment variables
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Creating an HMAC object using the secret key and SHA256 algorithm
    const hash = crypto.createHmac('sha256', secret);

    // Updating the hash with the concatenated order_id and payment_id
    // Note: Be cautious with the pipe (|) symbol as it is part of the signature generation
    hash.update(order_id + "|" + payment_id);

    // Generating the hash digest in hexadecimal format
    const generated_signature = hash.digest('hex');

    // Comparing the generated signature with the received signature to verify payment
    if (generated_signature === signature) {
        // Payment is verified successfully
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        });
    } else {
        // Payment verification failed due to mismatched signatures
        return res.status(400).json({
            success: false,
            message: "Invalid signature, payment verification failed"
        });
    }
};