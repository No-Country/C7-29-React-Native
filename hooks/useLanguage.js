import english from "../constants/english";
import spanish from "../constants/spanish";
import { useSelector } from "react-redux";

export function useLanguage() {
  const langstring = useSelector((state) => state.lang.lang);
  const language = langstring === "EN" ? english : spanish;

  const { trueApp } = language;
  return trueApp;
}
