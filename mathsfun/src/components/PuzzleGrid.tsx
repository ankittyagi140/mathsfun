import { allPuzzleApps } from "@/utils/allPuzzleApps";
import Link from "next/link";

{allPuzzleApps.map((app) => (
  <Link
    key={app.id}
    href={`/puzzles/${app.slug}`}
    aria-label={`Play ${app.name} puzzle`}
    className="group"
  >
    <h3 className="font-medium text-sm sm:text-base md:text-lg">
      {app.name}
    </h3>
  </Link>
))}