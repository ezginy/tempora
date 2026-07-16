export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
};
