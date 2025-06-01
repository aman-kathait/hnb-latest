"use client";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HnbLogo from "../assets/hnblogo.png";

const Signup = () => {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    department: "",
    year: "",
    email: "",
    password: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Updated to send all form data during OTP request
  const sendOtpHandler = async (e) => {
    e.preventDefault();

    // Check if terms and conditions are accepted
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    // Basic validation
    if (!input.email || !input.password || !input.firstname || !input.lastname || !input.department || !input.year) {
      toast.error("Please fill all the required fields.");
      return;
    }

    try {
      setOtpLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/send-otp",
        { 
          firstname: input.firstname,
          lastname: input.lastname,
          department: input.department,
          year: input.year,
          email: input.email,
          password: input.password,
          acceptedTerms: termsAccepted 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      // Only set OTP sent to true if the request was successful
      if (res.data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email, check!");
      } else {
        // Handle case where API returns success: false but no error
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Updated to only send email and OTP for registration
  const signupHandler = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        { 
          email: input.email, 
          otp: otp
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({
          firstname: "",
          lastname: "",
          department: "",
          year: "",
          email: "",
          password: "",
        });
        setTermsAccepted(false);
        setOtpSent(false);
        setOtp("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Add a function to resend OTP if needed
  const resendOtpHandler = async () => {
    try {
      setOtpLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/send-otp",
        { 
          firstname: input.firstname,
          lastname: input.lastname,
          department: input.department,
          year: input.year,
          email: input.email,
          password: input.password,
          acceptedTerms: termsAccepted 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        toast.success("OTP resent to your email!");
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen sm:bg-gray-50 px-4 sm:px-6">
      <form
        onSubmit={otpSent ? signupHandler : sendOtpHandler}
        className="w-full max-w-md bg-white sm:shadow-md rounded-xl p-6 flex flex-col gap-4 sm:border sm:border-gray-300"
      >
        <div className="text-center">
          <img
            src={HnbLogo}
            className="mx-auto h-16 w-16 mb-2"
            alt="Logo"
          />
          <p className="text-sm font-bold text-gray-500">
            Connect with your Batch Mates, Alumni and faculties.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <span className="font-medium">First Name</span>
            <Input
              type="text"
              name="firstname"
              value={input.firstname}
              onChange={changeEventHandler}
              className="my-2 h-9"
            
              disabled={otpSent}
            />
          </div>
          <div className="w-full">
            <span className="font-medium">Last Name</span>
            <Input
              type="text"
              name="lastname"
              value={input.lastname}
              onChange={changeEventHandler}
              className="my-2 h-9"
              
              disabled={otpSent}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-4">
          <div className="w-full">
            <Select
              onValueChange={(value) =>
                setInput({ ...input, department: value })
              }
              value={input.department}
              
              disabled={otpSent}
            >
              <SelectTrigger className="w-full text-black font-semibold sm:font-normal">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-sm text-black font-medium">
                    Engineering
                  </SelectLabel>
                  <SelectItem value="Computer Science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="Mechanical Engineering">
                    Mechanical Engineering
                  </SelectItem>
                  <SelectItem value="Electrical Engineering">
                    Electrical Engineering
                  </SelectItem>
                  <SelectItem value="Civil Engineering">
                    Civil Engineering
                  </SelectItem>
                  <SelectItem value="Electronics & Communication Engineering">
                    Electronics & Communication Engineering
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="text-sm text-black font-medium">
                    Management
                  </SelectLabel>
                  <SelectItem value="Business Administration">
                    Business Administration
                  </SelectItem>
                  <SelectItem value="Human Resource Management">
                    Human Resource Management
                  </SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="text-sm text-black font-medium">
                    Science
                  </SelectLabel>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Select
              onValueChange={(value) => setInput({ ...input, year: value })}
              value={input.year}
              
              disabled={otpSent}
            >
              <SelectTrigger className="w-full font-semibold text-black">
                <SelectValue placeholder="Passing Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Year</SelectLabel>
                  {Array.from({ length: 2036 - 2000 }, (_, i) => {
                    const year = 2000 + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="@hnbgu.edu.in"
            className="my-2 h-9"
            
            disabled={otpSent}
          />
        </div>

        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="my-2 h-9"
            
            disabled={otpSent}
          />
        </div>

        {otpSent && (
          <div className="animate-in fade-in">
            <span className="font-medium">Enter OTP</span>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="my-2 h-9"
              placeholder="Enter 4-digit OTP"
              maxLength={4}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">
                We've sent a 4-digit code to your email.
              </p>
              <button 
                type="button" 
                onClick={resendOtpHandler}
                disabled={otpLoading}
                className="text-sm text-blue-600 hover:underline"
              >
                Resend
              </button>
            </div>
          </div>
        )}

        <div className="items-top flex space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => {
              setTermsAccepted(checked);
            }}
            disabled={otpSent}
          />

          <div className="grid gap-1.5 leading-none">
            <label htmlFor="terms" className="text-sm font-medium leading-none">
              Accept terms and conditions
            </label>
            <p className="text-sm text-muted-foreground">
              You agree to our {" "}
              <Link to="/terms" className="text-blue-600 hover:underline" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline" target="_blank">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        {otpSent ? (
          <div className="flex flex-col gap-3">
            {loading ? (
              <Button className="h-10 w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="h-10 w-full" type="submit">
                Complete Registration
              </Button>
            )}
            
            <Button 
              type="button" 
              variant="outline" 
              className="h-10 w-full"
              onClick={() => setOtpSent(false)}
            >
              Back to Form
            </Button>
          </div>
        ) : otpLoading ? (
          <Button className="h-10 w-full" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending OTP...
          </Button>
        ) : (
          <Button className="h-10 w-full" type="submit">
            Send OTP
          </Button>
        )}

        <span className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;