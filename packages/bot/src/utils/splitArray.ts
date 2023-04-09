export default function <T>(array: T[], x: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < array.length; i += x) {
		result.push(array.slice(i, i + x));
	}
	return result;
}
