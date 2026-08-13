export type DefaultView = "board" | "analytics" | "notifications";

export function getDefaultView(): DefaultView {
  const stored = localStorage.getItem("defaultView");
  if (stored === "analytics" || stored === "notifications") return stored;
  return "board";
}

export const DEFAULT_VIEW_LABELS: Record<DefaultView, string> = {
  board: "Board",
  analytics: "Analytics",
  notifications: "Notifications",
};