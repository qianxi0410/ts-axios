import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import xhr from '../xhr'
import { bulidURL } from '../helpers/url'
import { transformRequest } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import transform from './transform'

export default function axios(config: AxiosRequestConfig): AxiosPromise {
	throwIfCancellationRequested(config)

	processConfig(config)
	return xhr(config).then(res => {
		return transformResponseData(res)
	})
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
	res.data = transform(res.data, res.headers, res.config.transformResponse)
	return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
	if (config.cancelToken) {
		config.cancelToken.throwIfRequested()
	}
}

function processConfig(config: AxiosRequestConfig): void {
	config.url = transformUrl(config)
	config.data = transform(config.data, config.headers, config.transformRequest)
	config.headers = flattenHeaders(config.headers, config.method!)
}

function transformHeaders(config: AxiosRequestConfig): string {
	const { headers = {}, data } = config
	return processHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): void {
	return transformRequest(config.data)
}

function transformUrl(config: AxiosRequestConfig): string {
	const { url = '/', params } = config
	return bulidURL(url, params)
}
