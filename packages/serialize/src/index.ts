import msgPack from "msgpack-lite";

export const encode = (data: Generic) => msgPack.encode(data);
export const decode = (data: Buffer) => msgPack.decode(data);

export const encodeToHex = (data: Generic) =>
	buffer_to_hex(msgPack.encode(data));
export const decodeFromString = (data: string) =>
	msgPack.decode(hex_to_buffer(data));

function buffer_to_hex(buffer: Buffer) {
	return Array.prototype.map
		.call(buffer, function (val) {
			let hex = val.toString(16).toUpperCase();
			if (val < 16) hex = `0${hex}`;
			return hex;
		})
		.join(" ");
}

function hex_to_buffer(string: string) {
	return string
		.split(/\s+/)
		.filter(function (chr) {
			return chr !== "";
		})
		.map(function (chr) {
			return parseInt(chr, 16);
		});
}

export type Generic =
	| string
	| number
	| boolean
	| bigint
	| Date
	| null
	| undefined
	| Generic[]
	| { [key: string]: Generic };
