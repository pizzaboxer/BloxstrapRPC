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

/**
 * Used for sending an RPC message. Avoid using this, as every command available will have a dedicated function for it.
 * @param command The command to send to the Bloxstrap client
 * @param data The data to send to the Bloxstrap client
 */
export declare const SendMessage: (command: string, data: unknown) => void;
/**
 * Used for configuring the user's Discord rich presence activity.
 * @param data The data to send to the Bloxstrap client
 */
export declare const SetRichPresence: (data: RichPresence) => void;
