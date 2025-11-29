import {
  Home,
  MessageSquare,
  Mail,
} from "lucide-react";
import { MenuItem } from "@/types/dashboard.type";

export const NAVIGATION_CONFIG: Record<string, MenuItem[]> = {
  MENU: [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard",
      hasSubmenu: true,
      submenu: [
        { name: "Gestion des invités", path: "/dashboard/invites" },
        { name: "Gestion des tables", path: "/dashboard/tables" },
      ],
    },
  ],
};