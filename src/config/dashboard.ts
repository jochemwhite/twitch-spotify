import { DashboardConfig } from "@/types";

import { LayoutGrid, User2 } from "lucide-react";
import { BsChatSquareText } from "react-icons/bs";
import { FaCircle, FaMusic } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";

export const dashboardConfig: DashboardConfig = {
  overview: {
    routes: [
      {
        label: "Overview",
        href: "/dashboard/",
        icon: LayoutGrid,
      },
    ],
  },
  twitch: {
    title: "Twitch",
    routes: [
      {
        label: "Commands",
        href: "/dashboard/commands/",
        icon: BsChatSquareText,
        beta: true,
      },
      {
        label: "Channel Points",
        href: "/dashboard/channelpoints/",
        icon: FaCircle,
        beta: true,
      },
    ],
  },
  song_request: {
    title: "Song Request",
    routes: [
      {
        label: "Banned Chatters",
        href: "/dashboard/banned-chatters/",
        icon: User2,
        beta: true,
      },
      {
        label: "Banned Songs",
        href: "/dashboard/banned-songs/",
        icon: FaMusic,
        beta: true,
      },
      {
        label: "Settings",
        href: "/dashboard/song-request-settings/",
        icon: GiSettingsKnobs,
        beta: true,
      },
    ],
  },

  community: {
    title: "Community",
    routes: [
      {
        label: "User Management",
        href: "/dashboard/user-management/",
        icon: User2,
        disabled: true,
        commingSoon: true,
      },
    ],
  },

  // admin: {
  //   title: 'Admin',
  //   routes: [
  //     {
  //       label: 'Admin Panel',
  //       href: '/dashboard/admin',
  //       icon: Lock,
  //     },
  //     {
  //       label: 'Analytics',
  //       href: '/dashboard/analytics',
  //       icon: AreaChart,
  //     },
  //   ],
  // },
};
