import english from "../constants/english";
import spanish from "../constants/spanish";

export function useLanguage(langstring = "EN") {
  const language = langstring === "EN" ? english : spanish;

  const { trueApp } = language;
  return trueApp;
}
