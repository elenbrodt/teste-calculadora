import Image from "next/image";
import PowerBIReport from "./components/powerBiReport";

export default function Home() {
  return (
    <div className="font-sans items-center justify-center h-screen p-4 pb-20 gap-16 min-w-2xl">
      <main className="flex flex-col gap-[32px] items-center justify-center">
        <Image
          src="/zoom-logo.png"
          alt="Zoom logo"
          width={180}
          height={38}
          priority
        />
        <div>
          <PowerBIReport />;
        </div>
      </main>
    </div>
  );
}
