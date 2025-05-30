import { FloatingButton } from "../components/FloatingButton";
import { Header } from "../components/Header";
import { HomeBody } from "../components/HomeBody";

export function Home() {
  return (
    <div className="h-screen pt-10">
      {/* pt-10 to offset the fixed header height */}
      <Header />
      <HomeBody />
      <FloatingButton />
    </div>
  );
}
