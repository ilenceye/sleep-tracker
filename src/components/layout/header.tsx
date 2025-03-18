import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function Header({ label }: { label: string }) {
  return (
    <div className="relative text-center">
      <div className="absolute">
        <Link to="/">
          <ArrowLeft size={20} />
        </Link>
      </div>
      <h2 className="font-bold">{label}</h2>
    </div>
  );
}
