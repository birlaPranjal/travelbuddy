import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Hero() {
  return (
    <div className="@container">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
          style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%), url("https://cdn.usegalileo.ai/stability/16feec3a-cc08-496c-84a8-8f0e794b9ad6.png")'}}
        >
          <h1 className="text-white pt-[15vw] text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] text-center">
            Discover your next adventure
          </h1>
          <div className="flex w-full max-w-[480px] items-center">
            <Input placeholder="Where are you going?" className="rounded-r-none focus:outline-none" />
            <Button className="rounded-l-none bg-slate-700">Search</Button>
          </div>
        </div>
      </div>
    </div>
  );
}