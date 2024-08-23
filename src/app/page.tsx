import Hero from "@/components/Hero";
import ExploreDestinations from "@/components/ExploreDestinations";
import TravelAlerts from "@/components/TravelAlerts";
import TravelReviews from "@/components/TravelReviews";

export default function Home() {
  return (
    <main className="px-4 md:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <Hero />
        <ExploreDestinations />
        <TravelAlerts />
        <TravelReviews />
      </div>
    </main>
  );
}
