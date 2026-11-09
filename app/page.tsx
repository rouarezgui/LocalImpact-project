import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth/dal";
import HomeClient from "./home-client";

async function HomeContent() {
  const user = await getCurrentUser();

  return <HomeClient user={user} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Chargement de LocalImpact...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
