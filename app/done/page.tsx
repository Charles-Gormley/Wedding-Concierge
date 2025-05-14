import Link from "next/link";

export default function Page() {
  return (
    <div className="container">
      <p className="message">Your purchase was successful</p>
      <Link href="/" className="button">
        Back to products
      </Link>
    </div>
  );
} 