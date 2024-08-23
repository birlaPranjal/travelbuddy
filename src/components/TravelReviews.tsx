import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon } from "@heroicons/react/20/solid";

const reviews = [
  {
    name: 'Jenny',
    date: 'Oct 10, 2023',
    avatar: 'https://cdn.usegalileo.ai/stability/ae0e072e-acbb-416d-b5cf-1a5e4cb24984.png',
    rating: 5,
    comment: 'Fantastic experience! The hotel was clean and comfortable, and the staff were friendly and helpful. The location is great, close to shopping and restaurants. I would definitely stay here again.'
  },
  // Add more reviews...
];

export default function TravelReviews() {
  return (
    <section>
      <h2 className="text-[#0d161b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Travel reviews</h2>
      <div className="flex flex-col gap-8 overflow-x-hidden bg-slate-50 p-4">
        {reviews.map((review, index) => (
          <Card key={index}>
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>{review.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-[#0d161b] text-base font-medium leading-normal">{review.name}</p>
                  <p className="text-[#4c7d9a] text-sm font-normal leading-normal">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-[#139cec]" />
                ))}
              </div>
              <p className="text-[#0d161b] text-base font-normal leading-normal">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}