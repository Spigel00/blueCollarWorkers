import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkerProfile, JobPosting } from '../types/models';
import { AppLayout } from '@/components/AppLayout';
import API from '@/contexts/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/JobCard';

const WorkerDashboard: React.FC = () => {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [profileRes, jobsRes] = await Promise.all([
        API.get('/users/worker/profile'),
        API.get('/jobs/recommendations')
      ]);

      setProfile(profileRes.data);
      setRecommendedJobs(jobsRes.data || []);
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl font-semibold">Loading dashboard...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold">Worker Dashboard</h1>

        {/* Worker Profile Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            {profile ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Experience:</strong> {profile.years_experience} years</p>
                <p><strong>Contact:</strong> {profile.contact_number}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                {profile.skills && (
                  <div>
                    <strong>Skills:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Button 
                  onClick={() => navigate('/worker/profile-form')} 
                  variant="outline" 
                  className="mt-4"
                >
                  Edit Profile
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-red-500 mb-4">Profile not found. Please complete your profile first.</p>
                <Button onClick={() => navigate('/worker/profile-form')}>
                  Create Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Jobs Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recommended Jobs</h2>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : recommendedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <p>No recommended jobs found. Check back later!</p>
            )}
            <Button 
              onClick={() => navigate('/jobs')} 
              variant="outline" 
              className="mt-4"
            >
              View All Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default WorkerDashboard;
