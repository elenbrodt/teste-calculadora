import Image from "next/image";

export default function Teste() {
  return (
    <div className="font-sans items-center justify-center h-screen p-4 pb-20 gap-16 min-w-2xl">
      <main className="flex items-center justify-center w-full">
        <div>
          <iframe
            src="https://teste-calculadora-zoom.netlify.app/"
            className="w-[100vw] h-[100vh]"
            allowFullScreen
          ></iframe>
        </div>
      </main>
    </div>
  );
}
