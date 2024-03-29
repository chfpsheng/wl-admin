import defaultSettings from "@/settings";
import i18n from "@/lang";

const title = defaultSettings.title || "物联网云平台";

export default function getPageTitle(key) {
  const hasKey = i18n.te(`route.${key}`);
  console.log("getPageTitle", hasKey);
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`);
    return `${pageName}`;
  }
  return `${key}`;
}
