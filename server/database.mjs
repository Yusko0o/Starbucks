import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
export function openDatabase(
  filename = process.env.DATABASE_PATH || "data/coffee.sqlite",
) {
  if (filename !== ":memory:")
    mkdirSync(path.dirname(filename), { recursive: true });
  const sqlite = new DatabaseSync(filename);
  sqlite.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
  sqlite.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
  return {
    close: () => sqlite.close(),
    prepare(sql) {
      return {
        bind(...args) {
          const statement = sqlite.prepare(sql);
          return {
            first: async () => statement.get(...args) || null,
            all: async () => ({ results: statement.all(...args) }),
            run: async () => statement.run(...args),
          };
        },
      };
    },
  };
}
