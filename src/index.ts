export { default as pluginLoader } from "./utils/plugin_loader";
export * from "./utils/types";
import minecraftData from "minecraft-data";
import version from "./utils/version";
export { default as Location } from "./utils/location";
export { default as Painting } from "./utils/painting";
export { default as Scoreboard } from "./utils/scoreboard";
export { default as Particle } from "./plugins/particle";
export const latestSupportedVersion = version.latestSupportedVersion;
export const oldestSupportedVersion = version.oldestSupportedVersion;
export const testedVersions = version.testedVersions;
export const supportFeature = (feature, version) =>
  minecraftData(version).supportFeature(feature);
export { default as InternalPlugins } from "./plugins";
