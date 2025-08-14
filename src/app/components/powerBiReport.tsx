"use client";
import React, { useEffect, useRef, useState } from "react";
import type {
  models,
  IEmbedConfiguration,
  Report,
  service,
  factories,
} from "powerbi-client";

type EmbedResponse = {
  embedToken: string;
  embedUrl: string;
  reportId: string;
  expiration?: string;
};

export default function PowerBIReport() {
  const containerRef = useRef<HTMLDivElement>(null);

  // guarda o módulo inteiro do powerbi-client (tipado)
  const [pbi, setPbi] = useState<typeof import("powerbi-client") | null>(null);

  // Carrega powerbi-client no browser
  useEffect(() => {
    import("powerbi-client").then((lib) => setPbi(lib));
  }, []);

  useEffect(() => {
    if (!pbi) return;

    let report: Report | null = null;
    let renewTimer: number | null = null;

    async function run() {
      const resp = await fetch(
        "https://teste-calculadora-backend.vercel.app/getEmbedToken"
      );
      if (!resp.ok) throw new Error("Falha ao obter embed token");
      const data: EmbedResponse = (await resp.json()) as EmbedResponse;
      if (!pbi) return;
      const config: IEmbedConfiguration = {
        type: "report",
        id: data.reportId,
        embedUrl: data.embedUrl,
        accessToken: data.embedToken,
        tokenType: pbi.models.TokenType.Embed,
        permissions: pbi.models.Permissions.Read,
        settings: {
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: false },
          },
        },
      };

      const svc = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory
      );

      if (containerRef.current) {
        svc.reset(containerRef.current);
        // embed retorna um Report quando type === "report"
        report = svc.embed(containerRef.current, config) as Report;

        report.on("error", (e: service.ICustomEvent<models.IError>) => {
          // e.detail contém o objeto de erro do Power BI
          // eslint-disable-next-line no-console
          console.error(e.detail);
        });
      }

      if (data.expiration && report) {
        const renewAt =
          new Date(data.expiration).getTime() - Date.now() - 60_000;

        renewTimer = window.setTimeout(async () => {
          const r = await fetch("/getEmbedToken");
          if (!r.ok) return;
          const j: EmbedResponse = (await r.json()) as EmbedResponse;
          await report?.setAccessToken(j.embedToken);
        }, Math.max(0, renewAt));
      }
    }

    run().catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

    return () => {
      if (renewTimer !== null) {
        clearTimeout(renewTimer);
      }
    };
  }, [pbi]);

  if (!pbi) {
    return <div>Carregando relatório...</div>;
  }

  return (
    <div className="w-[80vw] h-[80vh]">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
