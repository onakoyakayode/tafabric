import Footer from "../components/shop/Footer";
import Navbar from "../components/shop/Navbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-screen w-full mx-auto px-4 lg:px-20 xl:px-25 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
