import Link from "next/link";

export default function RootNotFound() {
  return (
    <div style={{ padding: "96px 20px", textAlign: "center" }}>
      <h1 className="h-section">Page not found</h1>
      <Link href="/" className="btn mt-8">
        Go to homepage
      </Link>
    </div>
  );
}
