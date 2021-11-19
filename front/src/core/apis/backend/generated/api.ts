/* tslint:disable */
/* eslint-disable */
/**
 * Api documentation
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Configuration } from "./configuration";
import globalAxios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
// Some imports not used depending on template conditions
// @ts-ignore
import {
	assertParamExists,
	createRequestFunction,
	DUMMY_BASE_URL,
	serializeDataIfNeeded,
	setApiKeyToObject,
	setBasicAuthToObject,
	setBearerAuthToObject,
	setOAuthToObject,
	setSearchParams,
	toPathString,
} from "./common";
// @ts-ignore
import { BASE_PATH, BaseAPI, COLLECTION_FORMATS, RequestArgs, RequiredError } from "./base";

/**
 *
 * @export
 * @interface TraefikRouterModel
 */
export interface TraefikRouterModel {
	/**
	 *
	 * @type {string}
	 * @memberof TraefikRouterModel
	 */
	path: string;
	/**
	 *
	 * @type {string}
	 * @memberof TraefikRouterModel
	 */
	name: string;
	/**
	 *
	 * @type {string}
	 * @memberof TraefikRouterModel
	 */
	service: string;
	/**
	 *
	 * @type {string}
	 * @memberof TraefikRouterModel
	 */
	status: TraefikRouterModelStatusEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum TraefikRouterModelStatusEnum {
	Enabled = "enabled",
	Disabled = "disabled",
}

/**
 * SwaggerApi - axios parameter creator
 * @export
 */
export const SwaggerApiAxiosParamCreator = function (configuration?: Configuration) {
	return {
		/**
		 * Get swagger/openapi configuration without cors issues
		 * @param {string} href Link to the documentation
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		getConfig: async (href: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
			// verify required parameter 'href' is not null or undefined
			assertParamExists("getConfig", "href", href);
			const localVarPath = `/api/swagger/fetch`;
			// use dummy base URL string because the URL constructor only accepts absolute URLs.
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) {
				baseOptions = configuration.baseOptions;
			}

			const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
			const localVarHeaderParameter = {} as any;
			const localVarQueryParameter = {} as any;

			if (href !== undefined) {
				localVarQueryParameter["href"] = href;
			}

			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions,
			};
		},
		/**
		 *
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		getRouters: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
			const localVarPath = `/api/swagger/routers`;
			// use dummy base URL string because the URL constructor only accepts absolute URLs.
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) {
				baseOptions = configuration.baseOptions;
			}

			const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
			const localVarHeaderParameter = {} as any;
			const localVarQueryParameter = {} as any;

			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions,
			};
		},
	};
};

/**
 * SwaggerApi - functional programming interface
 * @export
 */
export const SwaggerApiFp = function (configuration?: Configuration) {
	const localVarAxiosParamCreator = SwaggerApiAxiosParamCreator(configuration);
	return {
		/**
		 * Get swagger/openapi configuration without cors issues
		 * @param {string} href Link to the documentation
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		async getConfig(href: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getConfig(href, options);
			return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
		},
		/**
		 *
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		async getRouters(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TraefikRouterModel>>> {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getRouters(options);
			return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
		},
	};
};

/**
 * SwaggerApi - factory interface
 * @export
 */
export const SwaggerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
	const localVarFp = SwaggerApiFp(configuration);
	return {
		/**
		 * Get swagger/openapi configuration without cors issues
		 * @param {string} href Link to the documentation
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		getConfig(href: string, options?: any): AxiosPromise<string> {
			return localVarFp.getConfig(href, options).then((request) => request(axios, basePath));
		},
		/**
		 *
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		getRouters(options?: any): AxiosPromise<Array<TraefikRouterModel>> {
			return localVarFp.getRouters(options).then((request) => request(axios, basePath));
		},
	};
};

/**
 * SwaggerApi - object-oriented interface
 * @export
 * @class SwaggerApi
 * @extends {BaseAPI}
 */
export class SwaggerApi extends BaseAPI {
	/**
	 * Get swagger/openapi configuration without cors issues
	 * @param {string} href Link to the documentation
	 * @param {*} [options] Override http request option.
	 * @throws {RequiredError}
	 * @memberof SwaggerApi
	 */
	public getConfig(href: string, options?: AxiosRequestConfig) {
		return SwaggerApiFp(this.configuration)
			.getConfig(href, options)
			.then((request) => request(this.axios, this.basePath));
	}

	/**
	 *
	 * @param {*} [options] Override http request option.
	 * @throws {RequiredError}
	 * @memberof SwaggerApi
	 */
	public getRouters(options?: AxiosRequestConfig) {
		return SwaggerApiFp(this.configuration)
			.getRouters(options)
			.then((request) => request(this.axios, this.basePath));
	}
}
