import type { Bot } from "@/state/store";

/**
 * Cmd+1..9 and Cmd+Shift+[ / ] should follow the bots in the order the sidebar
 * shows them: section order, custom order, and skipping collapsed sections.
 * The sidebar already rendered that list, so read its rows instead of
 * rebuilding the same rules here. With no rows on screen (sidebar closed),
 * keep the old order.
 */
export function shortcutBotOrder(bots: Bot[], rowIds: readonly string[]): Bot[] {
  const visible = bots.filter((bot) => !bot.hidden);
  const byId = new Map(visible.map((bot) => [bot.id, bot]));
  const seen = new Set<string>();
  const ordered: Bot[] = [];
  for (const id of rowIds) {
    const bot = byId.get(id);
    if (!bot || seen.has(id)) continue;
    seen.add(id);
    ordered.push(bot);
  }
  return ordered.length > 0 ? ordered : visible;
}

export function sidebarBotRowIds(root: ParentNode = document): string[] {
  return [...root.querySelectorAll<HTMLElement>("[data-sidebar-bot-row]")]
    .map((row) => row.dataset.sidebarBotRow ?? "")
    .filter(Boolean);
}
