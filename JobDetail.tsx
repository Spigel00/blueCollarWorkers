
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkerCard } from "@/components/WorkerCard";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { JobPosting, UserRole, WorkerProfile } from "@/types/models";
import { MapPin, Calendar, Briefcase, ArrowUp } from "lucide-react";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getJobById, getRecommendedWorkers, getUserRole } = useAppContext();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [recommendedWorkers, setRecommendedWorkers] = useState<WorkerProfile[]>([]);
  const userRole = getUserRole();

  useEffect(() => {
    if (id) {
      const jobData = getJobById(id);
      if (jobData) {
        setJob(jobData);
        if (userRole === UserRole.EMPLOYER) {
          setRecommendedWorkers(getRecommendedWorkers(id));
        }
      }
    }
  }, [id, getJobById, getRecommendedWorkers, userRole]);

  const formatSalary = (job: JobPosting) => {
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!job) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold">Job not found</h2>
          <p className="mt-4">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="mt-6 inline-block">
            <Button>Browse all jobs</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/jobs" className="text-blue-collar-600 hover:text-blue-collar-700 flex items-center">
            <ArrowUp className="h-4 w-4 mr-1 rotate-90" />
            Back to Jobs
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                    <p className="text-lg text-gray-600 mb-4">{job.companyName}</p>
                    
                    <div className="flex flex-wrap items-center text-gray-600 gap-x-6 gap-y-2 mb-6">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-1" />
                        <span>
                          {job.location.city}, {job.location.state}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-1" />
                        <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-1" />
                        <span>Posted {formatDate(job.postDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {job.companyLogo && (
                    <img
                      src={job.companyLogo}
                      alt={`${job.companyName} logo`}
                      className="h-16 w-16 object-contain"
                    />
                  )}
                  {!job.companyLogo && (
                    <div className="h-16 w-16 rounded-lg bg-blue-collar-100 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-blue-collar-600" />
                    </div>
                  )}
                </div>

                {/* Call to Action for Workers */}
                {userRole === UserRole.WORKER && (
                  <div className="my-6 p-4 bg-blue-collar-50 rounded-lg border border-blue-collar-200">
                    <Button className="w-full md:w-auto">Apply for this job</Button>
                  </div>
                )}
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{job.description}</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Salary</p>
                      <p className="font-medium">{formatSalary(job)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Job Type</p>
                      <p className="font-medium capitalize">{job.jobType.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Experience Level</p>
                      <p className="font-medium">{job.experienceLevel}</p>
                    </div>
                    {job.deadlineDate && (
                      <div>
                        <p className="text-gray-500 text-sm">Application Deadline</p>
                        <p className="font-medium">{formatDate(job.deadlineDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-collar-50 text-blue-collar-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About {job.companyName}</h2>
                  <p className="mb-4 text-gray-700">
                    {job.companyName} is a leading company in the {job.title.split(' ')[0]} industry.
                  </p>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <span>
                        {job.location.city}, {job.location.state}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {userRole === UserRole.EMPLOYER && recommendedWorkers.length > 0 && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Recommended Workers</h2>
                    <div className="space-y-4">
                      {recommendedWorkers.slice(0, 3).map((worker) => (
                        <div key={worker.id} className="p-4 border border-gray-200 rounded-lg hover:bg-blue-collar-50">
                          <Link to={`/workers/${worker.id}`} className="block">
                            <div className="flex items-start">
                              <div className="mr-3">
                                {worker.profilePicture ? (
                                  <img
                                    src={worker.profilePicture}
                                    alt={worker.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-blue-collar-100 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-blue-collar-600" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">{worker.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {worker.experience.length > 0 ? worker.experience[0].title : "Professional"}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {worker.location.city}, {worker.location.state}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                      <Link to="/workers">
                        <Button variant="outline" className="w-full mt-2">
                          View all workers
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default JobDetail;
