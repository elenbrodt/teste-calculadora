"use client";
import React, { useEffect, useRef, useState } from "react";
import type { models, IEmbedConfiguration, service } from "powerbi-client";

type EmbedResponse = {
  embedToken: string;
  embedUrl: string;
  reportId: string;
  expiration?: string;
};

export default function PowerBIReport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pbiClient, setPbiClient] = useState<{
    models: typeof models;
    service: typeof service;
    factories: any;
  } | null>(null);

  // Carrega powerbi-client no browser
  useEffect(() => {
    import("powerbi-client").then((lib) => {
      setPbiClient(lib);
    });
  }, []);

  useEffect(() => {
    if (!pbiClient) return; // evita rodar até ter a lib carregada

    let report: any;
    let renewTimer: number | undefined;

    async function run() {
      const resp = await fetch("http://localhost:3000/getEmbedToken");
      if (!resp.ok) throw new Error("Falha ao obter embed token");
      const data: EmbedResponse = await resp.json();
      if (!pbiClient) return;
      const config: IEmbedConfiguration = {
        type: "report",
        id: data.reportId,
        embedUrl: data.embedUrl,
        accessToken: data.embedToken,
        tokenType: pbiClient.models.TokenType.Embed,
        permissions: pbiClient.models.Permissions.Read,
        settings: {
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: false },
          },
        },
      };

      const service = new pbiClient.service.Service(
        pbiClient.factories.hpmFactory,
        pbiClient.factories.wpmpFactory,
        pbiClient.factories.routerFactory
      );

      if (containerRef.current) {
        service.reset(containerRef.current);
        report = service.embed(containerRef.current, config);

        report.on("error", (e: any) => console.error(e?.detail));
      }

      if (data.expiration) {
        const renewAt =
          new Date(data.expiration).getTime() - Date.now() - 60_000;
        renewTimer = window.setTimeout(async () => {
          const r = await fetch("/getEmbedToken");
          const j: EmbedResponse = await r.json();
          await report?.setAccessToken(j.embedToken);
        }, Math.max(0, renewAt));
      }
    }

    run();

    return () => {
      if (renewTimer) clearTimeout(renewTimer);
    };
  }, [pbiClient]);

  if (!pbiClient) {
    return <div>Carregando relatório...</div>; // placeholder até carregar lib
  }

  return (
    <div className="w-[80vw] h-[80vh]">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
