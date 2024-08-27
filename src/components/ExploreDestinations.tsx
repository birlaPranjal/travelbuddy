import Image from 'next/image';

const destinations = [
  { name: 'Paris', image: 'https://cdn.usegalileo.ai/stability/981c31bd-5b04-40d7-91a0-063fa69548b9.png' },
  { name: 'New York', image: 'https://cdn.usegalileo.ai/stability/bfc184a0-58ac-4617-8c08-153cd7a500a2.png' },
  { name: 'New Delhi', image: 'https://cdn.usegalileo.ai/stability/981c31bd-5b04-40d7-91a0-063fa69548b9.png' },
  { name: 'Manali', image: 'https://cdn.usegalileo.ai/stability/bfc184a0-58ac-4617-8c08-153cd7a500a2.png' },
  { name: 'Kasaul', image: 'https://cdn.usegalileo.ai/stability/bfc184a0-58ac-4617-8c08-153cd7a500a2.png' },
  // Add more destinations...
];

export default function ExploreDestinations() {
  return (
    <section>
      <h2 className="text-[#0d161b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Explore destinations</h2>
      <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {destinations.map((dest) => (
          <div key={dest.name} className="flex flex-col gap-3 pb-3">
            <Image
              src={dest.image}
              alt={dest.name}
              width={158}
              height={158}
              className="rounded-xl w-full h-auto"
            />
            <p className="text-[#0d161b] text-base font-medium leading-normal">{dest.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}