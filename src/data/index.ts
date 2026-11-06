// One object for the whole site.
// - site.json:    fixed settings (domain, address, map, Google data). Not exposed to the client editor.
// - content.json: everything the client can change in Pages CMS (see .pages.yml).
import settings from "./site.json";
import content from "./content.json";

const site = { ...settings, ...content };
export default site;
export type Site = typeof site;

// Images chosen in the editor are stored as "media/<file>" and live in src/assets/media/.
const mediaFiles = import.meta.glob<{ default: ImageMetadata }>("/src/assets/media/*.{jpg,jpeg,png,webp,avif}", { eager: true });
export function mediaImage(path: string): ImageMetadata {
  const key = "/src/assets/" + path.replace(/^\/+/, "");
  const file = mediaFiles[key];
  if (!file) throw new Error(`Image not found in src/assets/media: ${path}`);
  return file.default;
}
