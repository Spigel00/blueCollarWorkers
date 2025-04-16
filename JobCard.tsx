
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobPosting } from "@/types/models";
import { MapPin, Briefcase } from "lucide-react";

interface JobCardProps {
  job: JobPosting;
}

export const JobCard = ({ job }: JobCardProps) => {
  const formatSalary = () => {
    if (!job.salary) return "Not specified";
    
    const { min, max, type } = job.salary;
    const formatValue = (val: number) => val.toLocaleString();
    
    let salaryText;
    if (min && max) {
      salaryText = `$${formatValue(min)} - $${formatValue(max)}`;
    } else if (min) {
      salaryText = `$${formatValue(min)}+`;
    } else if (max) {
      salaryText = `Up to $${formatValue(max)}`;
    } else {
      return "Not specified";
    }
    
    switch (type) {
      case "hourly":
        return `${salaryText}/hr`;
      case "weekly":
        return `${salaryText}/week`;
      case "monthly":
        return `${salaryText}/month`;
      default:
        return `${salaryText}/year`;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              <Link to={`/jobs/${job.id}`} className="hover:text-blue-collar-700 transition-colors">
                {job.title}
              </Link>
            </h3>
            <p className="text-gray-500 mb-2">{job.companyName}</p>
          </div>
          {job.companyLogo && (
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="h-10 w-10 object-contain"
            />
          )}
          {!job.companyLogo && (
            <div className="h-10 w-10 rounded-full bg-blue-collar-100 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-blue-collar-600" />
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>
            {job.location.city}, {job.location.state}
          </span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {job.requiredSkills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-blue-collar-50">
              {skill}
            </Badge>
          ))}
          {job.requiredSkills.length > 3 && (
            <Badge variant="outline" className="bg-blue-collar-50">
              +{job.requiredSkills.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-0 pb-4">
        <div className="text-sm">
          <span className="font-semibold">{formatSalary()}</span>
        </div>
        <div className="text-sm text-gray-500">
          {job.jobType.replace("-", " ")} · {job.experienceLevel}
        </div>
      </CardFooter>
    </Card>
  );
};
