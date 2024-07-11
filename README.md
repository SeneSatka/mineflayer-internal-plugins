# mineflayer-internal-plugins

<p align="center">
<img src="https://img.shields.io/npm/d18m/mineflayer-internal-plugins?style=for-the-badge&color=red
"/>
<img src="https://img.shields.io/github/package-json/v/SeneSatka/mineflayer-internal-plugins?style=for-the-badge&color=red"/>

## Download

```code
npm i mineflayer-internal-plugins
```

## Usage

```js
import { InternalPlugins } from "mineflayer-internal-plugins"
const { InternalPlugins } = require("mineflayer-internal-plugins")

const bot = createBot(/*Options*/);
const plugins= Object.keys(InternalPlugins).map(p=>InternalPlugins[p])
bot loadPlugins([...plugins])

```
