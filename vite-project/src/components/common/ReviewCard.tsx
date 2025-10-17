import { Card, CardContent, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import reviewLogo from "../../assets/reviewTitle.png";

interface ReviewCardProps {
  _id: string,
  review?: string;
  rating?: number;
  userId: {
    _id: string;
    fullName: string;
  };
}

export default function ReviewCard({
  review,
  rating,
  userId,
}: ReviewCardProps) {
  return (
    <Card className="bg-darkgray w-[370px] h-[300px]">
      <CardTitle>
        <img src={reviewLogo} alt="review" />
      </CardTitle>
      <CardContent>
        <div className="flex flex-col gap-4 p-4">
          <div className="text-2xl font-semibold">
            { userId?.fullName || "FANTASTIC Event Management"}
          </div>
          <div className="flex flex-col gap-4 max-w-[350px] h-[200px]">
            <div className="text-gray-400">
              {review ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </div>
            <Badge variant="secondary">⭐ {rating ?? "5.0"}</Badge>
          </div>
          {/* <div className="flex flex-col gap-2">
            <div className="text-lg">{userId?.fullName || "Anonymous"}</div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
