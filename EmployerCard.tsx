import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EmployerProfile } from "@/types/models";
import { MapPin } from "lucide-react";
import { ReactNode } from "react";

interface EmployerCardProps {
  employer: EmployerProfile;
  children?: ReactNode;  // Accepts any content as children
}

export const EmployerCard = ({ employer, children }: EmployerCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent>
        <div className="flex items-start">
          <div className="mr-4">
            {employer.companyLogo ? (
              <img
                src={employer.companyLogo}
                alt={employer.companyName}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-blue-collar-100 flex items-center justify-center">
                {/* Icon for missing company logo */}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">
              <Link to={`/employers/${employer.id}`} className="hover:text-blue-collar-700">
                {employer.companyName}
              </Link>
            </h3>

            <p className="text-gray-500 text-sm mb-1">{employer.industry}</p>

            <div className="flex items-center text-gray-500 text-sm mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {employer.location.city}, {employer.location.state}
              </span>
            </div>

            {employer.description && (
              <p className="text-gray-700 mb-4">{employer.description}</p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="text-sm text-gray-500">
          {employer.companySize ? `${employer.companySize} employees` : "Company size not specified"}
        </div>
      </CardFooter>

      {/* Render children passed to the EmployerCard */}
      {children && <div className="mt-4">{children}</div>}
    </Card>
  );
};
