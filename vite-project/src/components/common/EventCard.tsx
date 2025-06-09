import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Genre {
  id: string;
  name: string;
}

interface Ticket {
  price: number;
}

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  img1: string;
  startDate: string;
  genres: Genre[];
  rating: number;
  tickets?: Ticket[];
}

function EventCard({
  id,
  img1,
  title,
  description,
  startDate,
  genres,
  rating,
  tickets = [],
}: EventCardProps) {
  const navigate = useNavigate();

  const formattedDate = new Date(startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lowestPrice = tickets.length
    ? Math.min(...tickets.map((t) => t.price))
    : null;

  return (
    <div onClick={() => navigate(`/events/${id}`)} className="cursor-pointer">
      <Card>
        <CardContent>
          <div>
            <img
              src={img1}
              alt="img1"
              className="w-[410px] h-[274px] object-fill rounded-t-lg"
            />
          </div>
          <div className="bg-darkgray w-[415px] h-[228px] p-4 flex flex-col gap-2">
            <div className=" flex flex-row justify-between">
              <Badge variant="secondary">⭐ {rating}</Badge>
              <div className="flex gap-2">
                {genres.map((genre, index) => (
                  <Badge key={index}>{genre.name}</Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="text-2xl font-semibold">{title}</div>
              <div className="text-lg text-gray-400">{description}</div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="text-xl font-semibold">
                {lowestPrice !== null ? `From Rs ${lowestPrice}` : "No tickets"}
              </div>
              <div className="text-mint">{formattedDate}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventCard;
