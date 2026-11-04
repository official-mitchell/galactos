/* 2026-11-03: MAX-1002. Lucide icon wrapper. Stroke 1.5. Sizes 16, 20, or 24. */

import {
  Calendar,
  CreditCard,
  Database,
  FileText,
  MessageSquare,
  Settings,
  Sparkles,
  Tag,
  User,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  user: User,
  "file-text": FileText,
  database: Database,
  "credit-card": CreditCard,
  tag: Tag,
  "message-square": MessageSquare,
  settings: Settings,
  calendar: Calendar,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
export type IconSize = 16 | 20 | 24;

type IconProps = {
  name: IconName;
  size?: IconSize;
  className?: string;
};

export function Icon({ name, size = 20, className }: IconProps) {
  const Glyph = ICONS[name];
  return <Glyph className={className} size={size} strokeWidth={1.5} aria-hidden="true" />;
}
