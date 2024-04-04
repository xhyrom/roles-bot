// rome-ignore lint/suspicious/noExplicitAny: <explanation>
type RecursiveError = Record<string, any>;

export function parseErrors(
	obj: RecursiveError,
): { code: string; message: string }[] {
	const errors = [];

	for (const key in obj) {
		if (key === "_errors") {
			errors.push(obj[key]);
		} else if (typeof obj[key] === "object") {
			errors.push(...parseErrors(obj[key]));
		}
	}

	return errors.flat();
}
