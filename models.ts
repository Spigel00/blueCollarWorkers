export enum UserRole {
  WORKER = "worker",
  EMPLOYER = "employer"
}

export type LocationType = {
  city: string;
  state: string;
  country: string;
  zip?: string;  // Optional zip, as you have defined
};

export type WorkExperience = {
  id: string;
  title: string;
  company: string;
  location: LocationType;
  startDate: string;
  endDate?: string;
  description: string;
  skills: string[]; 
};


export type WorkerProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: {
    city: string;
    state: string;
    country: string;
    zip?: string;
  };
  bio?: string;
  profilePicture?: string;
  skills: string[];
  experience: WorkExperience[];
  desiredSalary?: number;
  preferredJobTitles: string[];
  joinDate: string;
};


export type EmployerProfile = {
  id: string;
  companyName: string;
  email: string;
  phone?: string; // Optional phone number
  location: {
    city: string;
    state: string;
    country: string;
    zip?: string;
  };
  description?: string; // Optional description
  companyLogo?: string | null; // Optional company logo
  companySize?: string; // Optional company size
  industry: string;
  website?: string;
  joinDate: string;
};


export type JobPosting = {
  id: string;
  title: string;
  description: string;
  location: LocationType;
  salary?: {
    min?: number;
    max?: number;
    type: "hourly" | "weekly" | "monthly" | "yearly"; // Defines the salary type
  };
  employerId: string;
  companyName: string;
  companyLogo?: string; // Optional company logo for the job posting
  requiredSkills: string[];
  experienceLevel: string;
  postDate: string; // When the job was posted
  workerId?: string; // Optional worker ID if this job has been filled
  deadlineDate?: string; // Optional job application deadline
  jobType: "full-time" | "part-time" | "contract" | "temporary"; // Job type is required
  status?: string; // Optional job status (e.g., open/closed)
};

export type User = {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  joined: string; // Join date of the user (either worker or employer)
};

export type Application = {
  id: string;
  job_id: string; // Job ID from the JobPosting
  user_id: string; // User ID from WorkerProfile or EmployerProfile
  status: "pending" | "accepted" | "rejected"; // Application status
  applied_on: string; // Date when the application was submitted

  // Optional nested data (backend might provide full data for convenience)
  job?: JobPosting;  // Job details (if available)
  user?: WorkerProfile; // Worker profile data (if available)
};
