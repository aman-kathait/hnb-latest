import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import HnbLogo from "../assets/hnblogo.png";
import API_URL from "@/config/api";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/v1/user/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 min-h-screen mt-16 md:mt-0 md:items-center w-full">
      <form
        onSubmit={signupHandler}
        className="w-full max-w-sm md:shadow-lg md:border border-border flex flex-col gap-4 px-6 md:py-8 rounded-xl bg-card"
      >
        <div className="flex flex-col items-center text-center mb-4">
          <img src={HnbLogo} className="h-20 w-20 mb-2" alt="Logo" />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Login to your Hnb Connect account
          </p>
        </div>

        <div>
          <label className="font-medium block">Email</label>
          <Input
            type="email"
            name="email"
            value={input.email}
            placeholder="@hnbgu.edu.in"
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2 h-10 w-full font-normal"
          />
        </div>

        <div>
          <label className="font-medium block">Password</label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2 h-10 w-full"
          />
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 font-medium"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {loading ? (
          <Button disabled className="h-10 w-full mt-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="h-10 w-full mt-2">
            Login
          </Button>
        )}

        <p className="text-center text-sm mt-2 text-muted-foreground font-semibold">
          Don't have an account?{" "}
          <Link to="/signup" className="underline text-blue-600">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
