import { Header } from "../components/Header";
import { HomeBody } from "../components/HomeBody";

export function Home() {
  return (
    <div className="h-screen pt-14">
      {/* pt-10 to offset the fixed header height */}
      <Header />
      <HomeBody />
    </div>
  );
}
