import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaBriefcase } from 'react-icons/fa';
import { useAppContext } from "@/contexts/AppContext";
import API from "@/contexts/api";
import WorkerDashboard from "./WorkerDashboard";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { user } = await login(email, password);
      console.log("Login successful:", user);

      // Check profile and redirect based on role
      try {
        if (user.role === 'worker') {
          const profileResponse = await API.get('/users/worker/profile');
          if (profileResponse.status === 200) {
            navigate("/WorkerDashboard");
          } else {
            navigate("/worker/profile-form");
          }
        } else if (user.role === 'employer') {
          const profileResponse = await API.get('/users/employer/profile');
          if (profileResponse.status === 200) {
            navigate("/employer-dashboard");
          } else {
            navigate("/employer/profile-form");
          }
        }
      } catch (profileError: any) {
        // If profile doesn't exist (404) or other error, redirect to profile form
        if (user.role === 'worker') {
          navigate("/worker/profile-form");
        } else if (user.role === 'employer') {
          navigate("/employer/profile-form");
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorMessage(
        error.response?.data?.error || 
        "Invalid credentials or server error."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex min-h-[calc(100vh-64px-180px)] flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:w-full sm:max-w-md mx-auto bg-white py-8 px-4 shadow rounded-lg space-y-6">
          <div className="flex justify-center">
            <FaBriefcase size={50} color="blue" />
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
            <div className="mt-4 text-center">
              <Link to="/register" className="text-sm text-blue-500 hover:text-blue-700">Don't have an account? Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
