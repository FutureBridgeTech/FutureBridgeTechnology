import data from "@/content/data.json";

export function getPageData(path: string) {
  // @ts-ignore
  return data[path] || null;
}

export function getAllPaths() {
  return Object.keys(data);
}
