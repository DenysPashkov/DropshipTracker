import { FloatingButton } from "../components/FloatingButton";
import Footer from "../components/Footer";
import { Header } from "../components/Header";
import { HomeBody } from "../components/HomeBody";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-14 space-y-30">
      <Header />
      <main className="flex-grow">
        <HomeBody />
        <FloatingButton />
      </main>
      <Footer />
    </div>
  );
}

