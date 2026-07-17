export type Announcement = {
  id: string;
  message: string;
  date: string;
};

export type Leader = {
  id: string;
  name: string;
  rank: string;
  role: string;
  bio: string;
};

export type GalleryCategory = "Parades" | "Camps" | "Drills" | "All";

export type GalleryItem = {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  type: "image" | "video";
  src: string;
  alt: string;
  thumbnail?: string;
};

export type ResourceCategory =
  | "Naval Knowledge"
  | "Drill & Ceremonies"
  | "First Aid & Survival";

export type Resource = {
  id: string;
  title: string;
  description: string;
  badge: string;
  category: ResourceCategory;
  url: string;
  action: "download" | "view";
};

export type KnotStep = {
  step: number;
  instruction: string;
};

export type Knot = {
  id: string;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  imagePlaceholder: string;
  steps: KnotStep[];
};

export type JoinFormData = {
  fullName: string;
  studentId: string;
  age: string;
  nextOfKin: string;
  motivation: string;
};

export type FormErrors = Partial<Record<keyof JoinFormData, string>>;
