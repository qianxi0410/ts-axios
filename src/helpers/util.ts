const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
	return toString.call(val) === '[object Date]'
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isObject(val: any): val is Object {
	return val !== null && typeof val === 'object'
}
