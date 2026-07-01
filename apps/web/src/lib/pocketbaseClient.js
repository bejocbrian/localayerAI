import PocketBase from "pocketbase";

const POCKETBASE_URL = import.meta.env.PUBLIC_POCKETBASE_URL || "http://localhost:8090";

let pb = null;

export function getPocketBase() {
  if (typeof window === "undefined") return null;
  if (!pb) {
    pb = new PocketBase(POCKETBASE_URL);
  }
  return pb;
}
