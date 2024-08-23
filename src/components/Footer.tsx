import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex justify-center">
      <div className="flex max-w-[960px] flex-1 flex-col">
        <div className="flex flex-col gap-6 px-5 py-10 text-center @container">
          <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
            <Link href="#" className="text-[#4c7d9a] text-base font-normal leading-normal min-w-40">About Us</Link>
            <Link href="#" className="text-[#4c7d9a] text-base font-normal leading-normal min-w-40">Contact Us</Link>
            <Link href="#" className="text-[#4c7d9a] text-base font-normal leading-normal min-w-40">Terms of Service</Link>
            <Link href="#" className="text-[#4c7d9a] text-base font-normal leading-normal min-w-40">Privacy Policy</Link>
          </div>
          {/* Add social media icons here */}
        </div>
      </div>
    </footer>
  );
}