import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    message: "",
  });
  
  // Check if coming from verification step
  useEffect(() => {
    if (!location.state?.verified) {
      navigate("/forgot-password");
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Check password strength if entering new password
    if (name === "newPassword") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValid = passwordRegex.test(password);
    
    setPasswordStrength({
      isValid,
      message: isValid 
        ? "Password is strong" 
        : "Password must have at least 8 characters, including uppercase, lowercase, numbers and special characters",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    // Validate password strength
    if (!passwordStrength.isValid) {
      toast.error(passwordStrength.message);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/reset-password",
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-gray-600">
            Create a new password for your account
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
              value={formData.email}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formData.newPassword && (
              <p className={`text-xs mt-1 ${passwordStrength.isValid ? "text-green-600" : "text-red-600"}`}>
                {passwordStrength.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formData.newPassword && formData.confirmPassword && (
              <p className={`text-xs mt-1 ${formData.newPassword === formData.confirmPassword ? "text-green-600" : "text-red-600"}`}>
                {formData.newPassword === formData.confirmPassword ? "Passwords match" : "Passwords don't match"}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;