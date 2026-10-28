import { Suspense } from "react";
import PassesClient from "./PassesClient";

export default function PassesPage() {
  return (
    <Suspense>
      <PassesClient />
    </Suspense>
  );
}
