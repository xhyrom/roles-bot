import { ButtonStyle } from "discord-api-types/v10";

export default function (style: string) {
	switch (style.toLowerCase()) {
		case "primary":
			return ButtonStyle.Primary;
		case "secondary":
			return ButtonStyle.Secondary;
		case "success":
			return ButtonStyle.Success;
		case "danger":
			return ButtonStyle.Danger;
		default:
			return ButtonStyle.Primary;
	}
}
