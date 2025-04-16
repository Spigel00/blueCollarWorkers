import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkerProfile } from "@/types/models";
import { MapPin, User } from "lucide-react";

interface WorkerCardProps {
  worker: WorkerProfile;
}

export const WorkerCard = ({ worker }: WorkerCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start">
          <div className="mr-4">
            {worker.profilePicture ? (
              <img
                src={worker.profilePicture}
                alt={worker.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-blue-collar-100 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-collar-600" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">
              <Link to={`/workers/${worker.id}`} className="hover:text-blue-collar-700 transition-colors">
                {worker.name}
              </Link>
            </h3>

            <p className="text-gray-500 text-sm mb-1">
              {worker.experience?.[0]?.title || "Professional"}
            </p>

            {worker.location && (
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{worker.location.city}, {worker.location.state}</span>
              </div>
            )}

            {worker.bio && (
              <p className="text-gray-700 mb-4 line-clamp-2">
                {worker.bio}
              </p>
            )}
          </div>
        </div>

        {worker.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {worker.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-blue-collar-50">
                {skill}
              </Badge>
            ))}
            {worker.skills.length > 4 && (
              <Badge variant="outline" className="bg-blue-collar-50">
                +{worker.skills.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <div className="text-sm text-gray-500">
          {worker.experience?.length
            ? `${worker.experience.length} past role(s)`
            : "New professional"}
        </div>
      </CardFooter>
    </Card>
  );
};
