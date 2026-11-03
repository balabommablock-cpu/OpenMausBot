import { describe, expect, it } from "vitest";

import type { Bot } from "@/state/store";
import { shortcutBotOrder, sidebarBotRowIds } from "./sidebar-shortcut-order";

const bot = (id: string, extra: Partial<Bot> = {}) => ({ id, name: id, ...extra }) as Bot;
// Created a..f; the sidebar shows sections in a different order and "Ops" collapsed.
const bots = [bot("a"), bot("b", { section: "Ops" }), bot("c", { section: "Ops" }), bot("d", { section: "Sales" }), bot("e"), bot("f", { hidden: true })];

describe("shortcutBotOrder", () => {
  it("follows the rows the sidebar shows, not creation order", () => {
    expect(shortcutBotOrder(bots, ["d", "e", "a"]).map((b) => b.id)).toEqual(["d", "e", "a"]);
  });

  it("skips bots in collapsed sections because they have no row", () => {
    const order = shortcutBotOrder(bots, ["e", "a", "d"]).map((b) => b.id);
    expect(order).not.toContain("b");
    expect(order).not.toContain("c");
  });

  it("never opens a hidden bot, an unknown row or the same bot twice", () => {
    expect(shortcutBotOrder(bots, ["f", "zzz", "a", "a", "e"]).map((b) => b.id)).toEqual(["a", "e"]);
  });

  it("keeps the old order when the sidebar shows no bot rows", () => {
    expect(shortcutBotOrder(bots, []).map((b) => b.id)).toEqual(["a", "b", "c", "d", "e"]);
  });
});

describe("sidebarBotRowIds", () => {
  it("reads row ids in document order", () => {
    const rows = ["d", "", "a"].map((id) => ({ dataset: { sidebarBotRow: id } }));
    const root = { querySelectorAll: () => rows } as unknown as ParentNode;
    expect(sidebarBotRowIds(root)).toEqual(["d", "a"]);
  });
});
