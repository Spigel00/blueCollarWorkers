import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, User } from "lucide-react";
import { UserRole } from "@/types/models";
import { useAppContext } from "@/contexts/AppContext";

const Home = () => {
  const { currentUser } = useAppContext();

  return (
    <AppLayout>
      <section className="hero-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left lg:w-2/3">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Connect Blue-Collar Talent with the Right Opportunities
            </h1>
            <p className="text-xl mb-8 text-blue-collar-100">
              Our platform matches skilled workers with employers looking for their exact expertise. Whether you're a carpenter, plumber, electrician, or other skilled professional.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              {!currentUser && (
                <>
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-blue-collar-800 hover:bg-blue-collar-50">
                      <User className="mr-2 h-5 w-5" />
                      I'm a Worker
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-blue-collar-700">
                      <Briefcase className="mr-2 h-5 w-5" />
                      I'm an Employer
                    </Button>
                  </Link>
                </>
              )}

              {currentUser?.role === UserRole.WORKER && (
                <Link to="/jobs">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-collar-800 hover:bg-blue-collar-50">
                    <Search className="mr-2 h-5 w-5" />
                    Find Jobs
                  </Button>
                </Link>
              )}

              {currentUser?.role === UserRole.EMPLOYER && (
                <Link to="/post-job">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-collar-800 hover:bg-blue-collar-50">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Post a Job
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Home;
