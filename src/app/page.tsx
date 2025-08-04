import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          src="/zoom-logo.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div>
          <iframe
            title="Simulador RT - Simples Nacional v1.1"
            width="1140"
            height="541.25"
            src="https://app.powerbi.com/reportEmbed?reportId=bdf168cb-54a7-4354-bda7-d8ae57f4581a&autoAuth=true&ctid=09c84ef1-b748-483c-9a33-9e33fbda6ee3"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
      </main>
    </div>
  );
}
