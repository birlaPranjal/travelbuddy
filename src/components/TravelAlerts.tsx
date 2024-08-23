import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TravelAlerts() {
  return (
    <section>
      <h2 className="text-[#0d161b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Travel alerts</h2>
      <div className="p-4">
        <Card>
          <CardContent className="flex flex-col md:flex-row items-stretch justify-between gap-4 p-4">
            <div className="flex flex-[2_2_0px] flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[#4c7d9a] text-sm font-normal leading-normal">COVID-19</p>
                <p className="text-[#0d161b] text-base font-bold leading-tight">Travel restrictions</p>
                <p className="text-[#4c7d9a] text-sm font-normal leading-normal">Check the latest COVID-19 travel restrictions in your destination country.</p>
              </div>
              <Button variant="outline">Learn more</Button>
            </div>
            <Image
              src="https://cdn.usegalileo.ai/sdxl10/4c8b5742-6763-44c5-8041-689f3fa98a70.png"
              alt="COVID-19 alert"
              width={300}
              height={200}
              className="rounded-xl w-full md:w-auto h-auto"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}