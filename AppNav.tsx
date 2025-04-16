import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/models";
import { Briefcase, Search, User } from "lucide-react";

export const AppNav = () => {
  const { currentUser, logout, getUserRole } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = getUserRole(); // No issues now

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Briefcase className="h-8 w-8 text-blue-collar-700" />
              <span className="ml-2 text-xl font-bold text-blue-collar-900">
                Blue Collar Connect
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/jobs" className="text-gray-700 hover:text-blue-collar-700 px-3 py-2 rounded-md">
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-1" />
                Find Jobs
              </div>
            </Link>
            
            {!currentUser ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            ) : (
              <>
                {userRole === UserRole.WORKER && (
                  <Link to="/worker-dashboard" className="text-gray-700 hover:text-blue-collar-700 px-3 py-2 rounded-md">
                    My Dashboard
                  </Link>
                )}
                
                {userRole === UserRole.EMPLOYER && (
                  <>
                    <Link to="/employer-dashboard" className="text-gray-700 hover:text-blue-collar-700 px-3 py-2 rounded-md">
                      My Dashboard
                    </Link>
                    <Link to="/post-job">
                      <Button size="sm">Post a Job</Button>
                    </Link>
                  </>
                )}
                
                <div className="flex items-center">
                  <Link to="/profile" className="text-gray-700 hover:text-blue-collar-700 px-3 py-2 rounded-md">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Profile
                    </div>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-collar-700"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/jobs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-collar-700">
            Find Jobs
          </Link>
          
          {!currentUser ? (
            <div className="space-y-2">
              <Link to="/login" className="block w-full">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="block w-full">
                <Button className="w-full">Register</Button>
              </Link>
            </div>
          ) : (
            <>
              {userRole === UserRole.WORKER && (
                <Link to="/worker-dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-collar-700">
                  My Dashboard
                </Link>
              )}
              
              {userRole === UserRole.EMPLOYER && (
                <>
                  <Link to="/employer-dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-collar-700">
                    My Dashboard
                  </Link>
                  <Link to="/post-job" className="block w-full mt-2">
                    <Button className="w-full">Post a Job</Button>
                  </Link>
                </>
              )}
              
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-collar-700">
                Profile
              </Link>
              
              <Button variant="ghost" className="w-full mt-2" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
