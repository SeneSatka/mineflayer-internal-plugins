import anvil from "./plugins/anvil";
import bed from "./plugins/bed";
import block_actions from "./plugins/block_actions";
import blocks from "./plugins/blocks";
import book from "./plugins/book";
import boss_bar from "./plugins/boss_bar";
import breath from "./plugins/breath";
import chat from "./plugins/chat";
import chest from "./plugins/chest";
import command_block from "./plugins/command_block";
import craft from "./plugins/craft";
import creative from "./plugins/creative";
import digging from "./plugins/digging";
import enchantment_table from "./plugins/enchantment_table";
import entities from "./plugins/entities";
import experience from "./plugins/experience";
import explosion from "./plugins/explosion";
import fishing from "./plugins/fishing";
import furnace from "./plugins/furnace";
import game from "./plugins/game";
import generic_place from "./plugins/generic_place";
import health from "./plugins/health";
import inventory from "./plugins/inventory";
import kick from "./plugins/kick";
import particle from "./plugins/particle";
import physics from "./plugins/physics";
import place_block from "./plugins/place_block";
import place_entity from "./plugins/place_entity";
import rain from "./plugins/rain";
import ray_trace from "./plugins/ray_trace";
import resource_pack from "./plugins/resource_pack";
import settings from "./plugins/settings";
import simple_inventory from "./plugins/simple_inventory";
import sound from "./plugins/sound";
import spawn_point from "./plugins/spawn_point";
import tablist from "./plugins/tablist";
import team from "./plugins/team";
import time from "./plugins/time";
import title from "./plugins/title";
import villager from "./plugins/villager";
import scoreboard from "./utils/scoreboard";

export default {
  bed: bed,
  title: title,
  block_actions: block_actions,
  blocks: blocks,
  book: book,
  boss_bar: boss_bar,
  breath: breath,
  chat: chat,
  chest: chest,
  command_block: command_block,
  craft: craft,
  creative: creative,
  digging: digging,
  enchantment_table: enchantment_table,
  entities: entities,
  experience: experience,
  explosion: explosion,
  fishing: fishing,
  furnace: furnace,
  game: game,
  health: health,
  inventory: inventory,
  kick: kick,
  physics: physics,
  place_block: place_block,
  rain: rain,
  ray_trace: ray_trace,
  resource_pack: resource_pack,
  scoreboard: scoreboard,
  team: team,
  settings: settings,
  simple_inventory: simple_inventory,
  sound: sound,
  spawn_point: spawn_point,
  tablist: tablist,
  time: time,
  villager: villager,
  anvil: anvil,
  place_entity: place_entity,
  generic_place: generic_place,
  particle: particle,
};
