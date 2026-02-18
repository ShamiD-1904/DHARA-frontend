import Papa from 'papaparse';

export type ParsedResult = {
  rows: Record<string, any>[];
  fields: string[];
};

export async function parseFile(file: File): Promise<ParsedResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawRows = results.data as Record<string, any>[];
        const rawFields = (results.meta.fields || []).map(String);

        // Keep original headers (trimmed) as keys. Avoid aggressive normalization
        const normalizeHeader = (h: string) => (h ? String(h).trim() : h);

        const fieldsMap = rawFields.map(f => ({ raw: f, norm: normalizeHeader(f) }));

        const rows: Record<string, any>[] = rawRows.map(r => {
          const out: Record<string, any> = {};
          for (const { raw, norm } of fieldsMap) {
            const val = (r as any)[raw];
            if (val === undefined) continue;
            // preserve types returned by PapaParse: numbers remain numbers, strings remain strings
            // do not merge different raw columns into the same normalized key
            out[norm] = val;
          }
          return out;
        });

        const fields = fieldsMap.map(f => f.norm);
        resolve({ rows, fields });
      },
      error: (err) => reject(err),
    });
  });
}

export function detectColumns(rows: Record<string, any>[]) {
  const dimensions: string[] = [];
  const metrics: string[] = [];

  if (!rows || rows.length === 0) return { dimensions, metrics };

  const sample = rows[0];
  for (const key of Object.keys(sample)) {
    let isNumber = true;
    for (let i = 0; i < Math.min(rows.length, 50); i++) {
      const v = rows[i][key];
      if (v === null || v === undefined) continue;
      // treat numeric strings as numbers
      const t = typeof v;
      if (!(t === 'number' || (t === 'string' && v !== '' && !Number.isNaN(Number(v))))) {
        isNumber = false;
        break;
      }
    }
    if (isNumber) metrics.push(key);
    else dimensions.push(key);
  }

  return { dimensions, metrics };
}

export function aggregateRows(
  rows: Record<string, any>[],
  groupKey: string,
  valueKey: string
) {
  const map = new Map<string | number, number>();

  for (const r of rows) {
    const g = r[groupKey] ?? 'Unknown';
    const v = Number(r[valueKey]) || 0;
    const key = String(g);
    map.set(key, (map.get(key) || 0) + v);
  }

  const aggregated = Array.from(map.entries()).map(([k, v]) => ({
    [groupKey]: k,
    [valueKey]: v,
  }));

  // sort descending by metric
  aggregated.sort((a: any, b: any) => (b[valueKey] ?? 0) - (a[valueKey] ?? 0));

  return aggregated;
}
