import { Suspense } from "react";
import { PlayerClient } from "./PlayerClient";

export default async function PlayerPage(props: { searchParams: Promise<{ title?: string }> }) {
  const searchParams = await props.searchParams;
  const title = searchParams.title || "Filme";

  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center text-white">
        Carregando player...
      </div>
    }>
      <PlayerClient title={title} />
    </Suspense>
  );
}