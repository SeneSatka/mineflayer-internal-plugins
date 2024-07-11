import assert from "assert";
import { Bot, BotOptions } from "./types";

export default (bot: Bot, options: BotOptions) => {
  let loaded = false;
  const pluginList = [];
  bot.once("inject_allowed", onInjectAllowed);

  function onInjectAllowed() {
    loaded = true;
    injectPlugins();
  }

  function loadPlugin(plugin) {
    assert.ok(typeof plugin === "function", "plugin needs to be a function");

    if (hasPlugin(plugin)) {
      return;
    }

    pluginList.push(plugin);

    if (loaded) {
      plugin(bot, options);
    }
  }

  function loadPlugins(plugins) {
    // While type checking if already done in the other function, it's useful to do
    // it here to prevent situations where only half the plugin list is loaded.
    assert.ok(
      plugins.filter((plugin) => typeof plugin === "function").length ===
        plugins.length,
      "plugins need to be an array of functions"
    );

    plugins.forEach((plugin) => {
      loadPlugin(plugin);
    });
  }

  function injectPlugins() {
    pluginList.forEach((plugin) => {
      plugin(bot, options);
    });
  }

  function hasPlugin(plugin) {
    return pluginList.indexOf(plugin) >= 0;
  }

  bot.loadPlugin = loadPlugin;
  bot.loadPlugins = loadPlugins;
  bot.hasPlugin = hasPlugin;
};
