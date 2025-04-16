import React, { useEffect, useState } from 'react';
import axios from '../contexts/api';
import { WorkerProfile, JobPosting, EmployerProfile } from '../types/models';
import { WorkerCard } from '../components/WorkerCard';


const EmployerDashboard = () => {
  const [appliedJobs, setAppliedJobs] = useState<JobPosting[]>([]);
  const [recommendedWorkers, setRecommendedWorkers] = useState<WorkerProfile[]>([]);
  const [allWorkers, setAllWorkers] = useState<WorkerProfile[]>([]);
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [
        appliedJobsRes,
        recommendedRes,
        employerProfileRes,
        allWorkersRes,
      ] = await Promise.all([
        axios.get('/application/applied'),
        axios.get('/recommendation/workers'),
        axios.get('/users/employer/profile'),
        axios.get('/profiles/workers'),
      ]);

      setAppliedJobs(appliedJobsRes.data.jobs || []);
      setRecommendedWorkers(recommendedRes.data.recommended_workers || []);
      setProfile(employerProfileRes.data.profile || null);
      setAllWorkers(allWorkersRes.data.workers || []);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">Employer Dashboard</h1>

      {/* Employer Profile */}
      {profile ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p><strong>Company Name:</strong> {profile.companyName}</p> {/* Updated field */}
          <p><strong>Location:</strong> {profile.location.city}, {profile.location.state}</p>
          <p><strong>Contact:</strong> {profile.phone}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      ) : (
        <p className="text-red-500">Profile not found. Please complete your profile first.</p>
      )}

      {/* Applied Jobs Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Job Posts (with Applications)</h2>
        {appliedJobs.length > 0 ? (
          <ul className="space-y-2">
            {appliedJobs.map((job) => (
              <li key={job.id} className="border p-3 rounded">
                <p><strong>Title:</strong> {job.title}</p>
                <p><strong>Salary:</strong> ₹{job.salary?.min} - ₹{job.salary?.max}</p>
                <p><strong>Address:</strong> {job.location.city}, {job.location.state}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No applications yet for your posted jobs.</p>
        )}
      </div>

      {/* Recommended Workers */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recommended Workers</h2>
        {recommendedWorkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <p>No recommended workers found.</p>
        )}
      </div>

      {/* All Worker Profiles */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">All Available Workers</h2>
        {allWorkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <p>No workers registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
