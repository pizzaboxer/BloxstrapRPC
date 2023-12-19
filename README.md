# BloxstrapRPC Roblox-TS port

# ⚠️ Warning: This package has been deprecated in favour of the official sdk found [here](https://github.com/bloxstraplabs/bloxstrap-rpc-sdk). While this still may work, it will not be receiving any changes or updates and you should abstain from using it. ⚠️

[Adapted from official documentation](https://github.com/pizzaboxer/bloxstrap/wiki/Integrating-Bloxstrap-functionality-into-your-game)

If you're a game developer on Roblox, you may be interested in utilizing the features that Bloxstrap has to offer - but how? 

Bloxstrap features the ability for one-way data communication between it and Roblox scripts, thanks to [activity tracking](https://github.com/pizzaboxer/bloxstrap/wiki/What-is-activity-tracking%3F). This feature is known as BloxstrapRPC, and allows you to send a message from a Roblox script, in order to invoke a command inside Bloxstrap. Messages are ratelimited to one message per second.

Here's a [video](https://www.youtube.com/watch?v=8yGinJMO1Ms) demonstrating what it can do, specifically setting a user's rich presence status [from in-game](https://www.roblox.com/games/13307536247/bloxstrap-message-testing). There's also a [demo place](https://www.roblox.com/games/476005980/BloxstrapRPC-Showcase) for demonstrating rich presence configuration specifically, courtesy of [1011025m](https://github.com/1011025m).

Be aware that any messages you send must be done from the client-side through a LocalScript.

## Example usage

```ts
import BloxstrapRPC from "./BloxstrapRPC";

const timestamp = os.time();

BloxstrapRPC.SetRichPresence({
	details: "Example details",
	state: "Example state",
	timeStart: timestamp,
	timeEnd: timestamp + 60,
	smallImage: {
		assetId: 7541560387,
		hoverText: "Example small image hover text",
	},
	largeImage: {
		assetId: 10361264825,
		hoverText: "Example large image hover text",
	},
});
```

## Module exports

### Types
```ts
type RichPresence = {
	details?: string;
	state?: string;
	timeStart?: number;
	timeEnd?: number;
	smallImage?: RichPresenceImage;
	largeImage?: RichPresenceImage;
};

type RichPresenceImage = {
	assetId?: number;
	hoverText?: string;
	clear?: boolean;
	reset?: boolean;
};
```

### Functions
```ts
SendMessage(command: string, data: unknown): void;  // Used for sending an RPC message. Avoid using this, as every command available will have a dedicated function for it.
SetRichPresence(data: RichPresence): void;  // Used for configuring the user's Discord rich presence activity.
```

## Additional information

When it comes to structuring a RichPresence type, here's what to keep in mind.

- A value of nil/no setting indicates that the current value on the rich presence should be kept as what it already is.
- The values for timeStart and timeEnd expect a UTC epoch timestamp in seconds, which can be obtained with `os.time()`.
- By default, field values will persist, so you don't need to re-set the entire presence just to update one field.
- For erasing fields:
  - string property types can be set as a blank string.
  - number property types can be set as zero.
  - RichPresenceImage property types can have their 'clear' property set to true.
- For reverting fields to their defaults:
  - string property types can be set as `"<reset>"`.
  - RichPresenceImage property types can have their 'reset' property set to true.

## Implementation

This section details how BloxstrapRPC is implemented on the application side. If you're looking to implement BloxstrapRPC (e.g. making a standalone cross-platform rich presence server), you should keep reading.

BloxstrapRPC works by tracing Roblox's log file as it's running, looking for any print entries that are prefixed with `[BloxstrapRPC]`. After this identifier comes the actual message itself, provided in JSON form, with attributes for `command` and `data`. `command` is the name of the procedeure that should be executed, and `data` is the data it should use. Fairly straightforward.

This way, scripts are able to send data to external applications simply by just printing a string to the output. To better demonstrate, here's what the BloxstrapRPC Helper Module is essentially doing:

```lua
print('[BloxstrapRPC] {"command": "SetRichPresence", "data": {"details": "hi"}}')
```

The aim for BloxstrapRPC is for it to be the standard for Roblox scripts signalling data to external applications, not just for it to be used in Bloxstrap. For example, if you want to make your own Roblox rich presence handler application, while also wanting to implement the ability for games to set their own rich presence, it's best to implement it according to BloxstrapRPC instead of devising your own system, if you can. This way, you don't have to worry too much about the implementation details, and you're able to ensure compatibility with as many Roblox games as possible.