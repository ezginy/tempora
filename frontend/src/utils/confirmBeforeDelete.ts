export function getConfirmBeforeDelete(): boolean {
  return localStorage.getItem("confirmBeforeDelete") !== "false";
}