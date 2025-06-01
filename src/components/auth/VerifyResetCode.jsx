
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const VerifyResetCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Get email from location state if available
  const email = location.state?.email || "";
  
  // Redirect if no email is provided
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error("Reset code is required");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/verify-reset-otp",
        { email, otp },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/reset-password", { state: { email, verified: true } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Verify Reset Code</h1>
          <p className="mt-2 text-gray-600">
            Enter the 4-digit code sent to your email
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Reset Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter 4-digit code"
              maxLength={4}
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </div>
        </form>

        <div className="flex justify-between text-sm mt-6">
          <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
            Request New Code
          </Link>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetCode;