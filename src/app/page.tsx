import AuthFooter from "@/components/AuthFooter";
import Navbar from "@/components/Navbar";
import { typography } from "@/styles/styles";
export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Navbar />
      <h1 style={{ fontFamily: typography.h1 }}>VitalFit</h1>
      <AuthFooter text="hola" linkText="mundo" href="hola.com" />
    </div>
  );
}
