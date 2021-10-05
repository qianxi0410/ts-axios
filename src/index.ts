import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { bulidURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'

export default function axios(config: AxiosRequestConfig): void {
	processConfig(config)
	xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
	config.url = transformUrl(config)
	config.headers = transformHeaders(config)
	config.data = transformRequestData(config)
}

function transformHeaders(config: AxiosRequestConfig): string {
	const { headers = {}, data } = config
	return processHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): void {
	return transformRequest(config.data)
}

function transformUrl(config: AxiosRequestConfig): string {
	const { url, params } = config
	return bulidURL(url, params)
}
