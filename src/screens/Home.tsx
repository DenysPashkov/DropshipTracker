import { FloatingButton } from "../components/FloatingButton";
import Footer from "../components/Footer";
import { Header } from "../components/Header";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-14">
      <Header />
      <main className="flex-grow">
        <FloatingButton />
      </main>
      <Footer />
    </div>
  );
}
