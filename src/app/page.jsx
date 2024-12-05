"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from 'next/image'; // Import Image from next/image

const LoginPage = () => {
  const [gkccId, setGkccId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if the token is already present
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const checkStatus = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/checkstatus`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const adminPosition = response.data.message.position;

          // Redirect based on the admin's position
          if (adminPosition === "Superadmin") {
            router.push("/landingSA");
          } else if (adminPosition === "Association Head") {
            router.push("/landingAH");
          } else if (adminPosition === "CMSAdmin") {
            router.push("/cms-admin");
          }
          else {
            setError("Invalid position received. Please contact support.");
          }
        } catch (err) {
          setError("Session expired. Please log in again.");
        }
      };

      checkStatus();
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/login`,
        {
          GKCCId: gkccId,
          password,
        }
      );

      const admin = response.data.message.admin.position;
      const token = response.data.message.token;

      // Store token in local storage
      localStorage.setItem("token", token);

      // Redirect based on the admin's position
      if (admin === "Superadmin") {
        router.push("/landingSA");
      } else if (admin === "Association Head") {
        router.push("/landingAH");
      } else if (admin === "CMSAdmin") {
        router.push("/cms-admin");
      }
      else {
        setError("Invalid position received. Please contact support.");
      }
    } catch (error) {
      setError("Invalid GKCC ID or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Top Text */}
      <h1 className="text-4xl font-semibold mt-2 mb-18 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text font-jakarta">
        We Serve Better--Together
      </h1>

      {/* Login Container */}
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 mt-6 mb-2 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        {/* Logo section */}
        <div className="flex justify-center mb-4">
          <Image
            src="/gkcc.png" // Replace with your logo image path
            alt="Logo"
            width={112} // Adjust width accordingly
            height={112} // Adjust height accordingly
            className="shadow-xl rounded-xl"
          />
        </div>

        {/* Login form */}
        <h2 className="text-3xl font-bold mb-4 text-blue-500 text-center">
          Login
        </h2>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-blue-500">GKCC ID</label>
            <input
              type="text"
              className="w-full p-2 bg-white bg-opacity-20 border border-gray-300 rounded mt-1 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none font-jakarta"
              value={gkccId}
              onChange={(e) => setGkccId(e.target.value)}
              required
              placeholder="Enter your GKCC ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-500">Password</label>
            <input
              type="password"
              className="w-full p-2 bg-white bg-opacity-20 border border-gray-300 rounded mt-1 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none font-jakarta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-transform transform font-jakarta ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Bottom Text */}
      <p className="text-4xl font-semibold mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text font-jakarta text-center">
        A Shared Vision By The Kokanis' For the Kokanis
      </p>
    </div>
  );
};

export default LoginPage;
