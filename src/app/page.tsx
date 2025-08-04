import Image from "next/image";

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
          <iframe
            title="Simulador RT - Simples Nacional v1.1"
            width="100%"
            height="100%"
            src="https://app.powerbi.com/reportEmbed?reportId=bdf168cb-54a7-4354-bda7-d8ae57f4581a&autoAuth=true&ctid=09c84ef1-b748-483c-9a33-9e33fbda6ee3"
            allowFullScreen={true}
            className="w-[80vw] h-[80vh]"
          ></iframe>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
      </main>
    </div>
  );
}
