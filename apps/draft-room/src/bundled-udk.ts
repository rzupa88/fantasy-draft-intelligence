import { unzipSync, zipSync } from "fflate";
import { parseUdkZip, type UdkImportPackage } from "./udk-importer.js";
import { extractUdkOutlooks, type UdkOutlookMap } from "./udk-outlook.js";

export const BUNDLED_UDK_LABEL = "Bundled UDK 2026";

export interface BundledUdkData {
  udkPackage: UdkImportPackage;
  outlooks: UdkOutlookMap;
}

export async function loadBundledUdk(): Promise<BundledUdkData> {
  const url = `${import.meta.env.BASE_URL}udk/udk-docs-v2.zip`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to fetch bundled UDK data (${response.status}).`);
  }

  const sourceBytes = new Uint8Array(await response.arrayBuffer());
  const normalizedBytes = normalizeUdkArchiveFilenames(sourceBytes);
  return {
    udkPackage: parseUdkZip(normalizedBytes),
    outlooks: extractUdkOutlooks(normalizedBytes),
  };
}

export function normalizeUdkArchiveFilenames(bytes: Uint8Array): Uint8Array {
  const archive = unzipSync(bytes);
  const normalized: Record<string, Uint8Array> = {};

  for (const [rawPath, fileBytes] of Object.entries(archive)) {
    const path = rawPath.replaceAll("\\", "/");
    const segments = path.split("/");
    const filename = segments.pop() ?? path;
    const normalizedFilename = filename.replace(
      /^UDK - Position Rankings - /i,
      "UDK Position Rankings - ",
    );
    const normalizedPath = [...segments, normalizedFilename].join("/");
    normalized[normalizedPath] = fileBytes;
  }

  return zipSync(normalized, { level: 0 });
}
