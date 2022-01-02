export const isJSON = (data: any): boolean => {
	if (typeof data !== 'string') return false;
	try {
		const result = JSON.parse(data);
		const type = result.toString();

		return type === '[object Object]' || type === '[object Array]';
	} catch (err) {
		return false;
	}
};