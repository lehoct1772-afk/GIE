import type { SystemSnapshot, FileEntry, CsvTable } from "./types";

export type RawInput =
  | { kind: "zip"; name: string; data: Uint8Array }
  | { kind: "csv"; name: string; data: string }
  | { kind: "folder"; name: string; files: Array<{ path: string; data: Uint8Array }> };

export function ingest(input: RawInput): SystemSnapshot {
  if (input.kind === "csv") {
    return {
      source: "csv",
      root: input.name,
      files: [],
      records: [parseCsv(input.name, input.data)],
    };
  }

  if (input.kind === "zip") {
    const entries = unzip(input.data);
    return {
      source: "zip",
      root: input.name,
      files: entries.map(toFileEntry),
      records: [],
    };
  }

  return {
    source: "folder",
    root: input.name,
    files: input.files.map(toFileEntry),
    records: [],
  };
}

function toFileEntry(e: { path: string; data: Uint8Array }): FileEntry {
  return {
    path: e.path,
    size: e.data.length,
    hash: hashBytes(e.data),
    content: isText(e.data) ? decodeText(e.data) : undefined,
  };
}

function isText(data: Uint8Array): boolean {
  const sample = data.slice(0, 512);
  for (let i = 0; i < sample.length; i++) {
    if (sample[i] === 0) return false;
  }
  return true;
}

function decodeText(data: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: false }).decode(data);
}

function hashBytes(data: Uint8Array): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < data.length; i++) {
    h ^= data[i]!;
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function parseCsv(name: string, raw: string): CsvTable {
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  const headers = splitCsvLine(lines[0] ?? "");
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    rows.push(splitCsvLine(lines[i]!));
  }
  return { name, headers, rows };
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { out.push(cur); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

function unzip(data: Uint8Array): Array<{ path: string; data: Uint8Array }> {
  // minimal ZIP reader — stored (no compression) entries only
  const entries: Array<{ path: string; data: Uint8Array }> = [];
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let i = 0;
  while (i < data.length - 4) {
    const sig = view.getUint32(i, true);
    if (sig !== 0x04034b50) break;
    const method = view.getUint16(i + 8, true);
    const compSize = view.getUint32(i + 18, true);
    const nameLen = view.getUint16(i + 26, true);
    const extraLen = view.getUint16(i + 28, true);
    const nameStart = i + 30;
    const name = new TextDecoder().decode(data.slice(nameStart, nameStart + nameLen));
    const dataStart = nameStart + nameLen + extraLen;
    const fileData = data.slice(dataStart, dataStart + compSize);
    if (method === 0) {
      entries.push({ path: name, data: fileData });
    }
    i = dataStart + compSize;
  }
  return entries;
}