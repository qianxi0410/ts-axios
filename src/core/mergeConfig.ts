import { deprecate } from 'util'
import { deepMerge, isPlainObject } from '../helpers/util'
import { AxiosRequestConfig } from '../types/index'

type MergeFn = (val1: any, val2: any) => any
const strats = new Map<string, MergeFn>()

export default function mergeConfig(
	config1: AxiosRequestConfig,
	config2?: AxiosRequestConfig
): AxiosRequestConfig {
	if (!config2) {
		config2 = {}
	}

	const config = Object.create(null)

	for (const key in config2) {
		mergeField(key)
	}

	for (const key in config1) {
		if (!config2[key]) {
			mergeField(key)
		}
	}

	function mergeField(key: string): void {
		const strat = strats.get(key) || defaultStrat
		config[key] = strat(config1[key], config2![key])
	}

	return config
}

function defaultStrat(val1: any, val2: any): any {
	return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
	if (typeof val2 !== 'undefined') {
		return val2
	}
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
	strats.set(key, fromVal2Strat)
})

function deepMergeStrat(val1: any, val2: any): any {
	if (isPlainObject(val2)) {
		return deepMerge(val1, val2)
	} else if (typeof val2 !== 'undefined') {
		return val2
	} else if (isPlainObject(val1)) {
		return deepMerge(val1)
	} else if (typeof val1 !== 'undefined') {
		return val1
	}
}

const stratKeysDeepMerge = ['headers']

stratKeysDeepMerge.forEach(key => {
	strats.set(key, deepMergeStrat)
})
