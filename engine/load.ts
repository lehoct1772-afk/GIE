import type { SystemSnapshot, FileEntry } from "./types";

export async function loadFromFileList(files: FileList, rootName: string): Promise<SystemSnapshot> {
  const entries: FileEntry[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;

    const relPath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
    const data = new Uint8Array(await file.arrayBuffer());

    entries.push({
      path: relPath,
      size: data.length,
      hash: hashBytes(data),
      content: isText(data) ? new TextDecoder("utf-8", { fatal: false }).decode(data) : undefined,
    });
  }

  return {
    source: "folder",
    root: rootName,
    files: entries,
    records: [],
  };
}

export async function loadFromCsvFile(file: File): Promise<SystemSnapshot> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const headers = splitCsvLine(lines[0] ?? "");
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) rows.push(splitCsvLine(lines[i]!));

  return {
    source: "csv",
    root: file.name,
    files: [],
    records: [{ name: file.name, headers, rows }],
  };
}

function isText(data: Uint8Array): boolean {
  const sample = data.slice(0, 512);
  for (let i = 0; i < sample.length; i++) if (sample[i] === 0) return false;
  return true;
}

function hashBytes(data: Uint8Array): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < data.length; i++) {
    h ^= data[i]!;
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
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