import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-width py-24 text-center">
      <p className="font-serif text-[80px] leading-none text-sand">404</p>
      <h1 className="h-section mt-4">Page not found</h1>
      <p className="mt-3 text-[15px] text-body2">The page you&apos;re looking for may have moved or no longer exists.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn">
          Go to homepage
        </Link>
        <Link href="/collections/all" className="btn-outline">
          Shop all jewellery
        </Link>
      </div>
    </div>
  );
}
