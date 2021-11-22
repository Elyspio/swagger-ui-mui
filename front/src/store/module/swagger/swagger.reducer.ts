import { createReducer } from "@reduxjs/toolkit";
import { getSwaggerConfig } from "./swagger.action";
import type { OpenAPIObject, ParameterObject, PathItemObject, ReferenceObject, RequestBodyObject } from "../../../core/services/swagger/swagger.types";
import { ResponseObject } from "../../../core/services/swagger/swagger.types";
import { httpMethods, SwaggerRequestBody, SwaggerResponse, SwaggerRoute } from "./swagger.types";

export interface SwaggerState {
	config?: OpenAPIObject;
	models: Required<OpenAPIObject>["components"]["schemas"];
	controllers: {
		name: string;
		description?: string;
		routes: SwaggerRoute[];
	}[];
}

const defaultState: SwaggerState = {
	controllers: [],
	models: {},
};

const getRefName = (str: string) => str.replace(new RegExp("#/components/schemas/(.*)"), "$1");
type ReferenceOrAny = ReferenceObject | Required<any>;
const isRefType = (obj: ReferenceOrAny): obj is ReferenceObject => (obj as ReferenceObject).$ref !== undefined;

const findModel = <Obj extends ReferenceOrAny>(state: SwaggerState, obj: Obj): any => {
	let ret = obj;
	for (const k of Object.keys(obj ?? {})) {
		console.log(obj, k, obj[k], obj[k].$ref);
		if (k === "$ref") {
			const modelName = getRefName(obj[k]);
			return state.config?.components?.["schemas"]?.[modelName] as any;
		} else if (typeof obj === "object") {
			ret[k] = findModel(state, ret[k]);
		}
	}
	return ret as any;
};

function parseReqBody(state: SwaggerState, body?: RequestBodyObject): SwaggerRequestBody | undefined {
	console.log("parseReqBody");
	if (body === undefined) return undefined;

	let content: SwaggerRequestBody["content"] = {};

	Object.entries(body.content).forEach(([contentType, value]: [string, RequestBodyObject["content"][string]]) => {
		let schema = findModel(state, value.schema!);

		content[contentType] = {
			encoding: value.encoding,
			schema,
		};
	});

	return {
		content: content,
		description: body.description,
		required: body.required ?? false,
	};
}

let parseReqParameters = (state, param: ParameterObject) => {
	console.log("parseReqParameters");
	let schema = findModel(state, param.schema!);

	return {
		deprecated: param.deprecated ?? false,
		description: param.description,
		schema,
		name: param.name,
		in: param.in,
		allowEmptyValue: param.allowEmptyValue ?? false,
		allowReserved: param.allowReserved ?? false,
		required: param.required ?? false,
	};
};

export const swaggerReducer = createReducer(defaultState, (builder) => {
	builder.addCase(getSwaggerConfig.fulfilled, (state, action) => {
		state.config = action.payload;
		const controllers: SwaggerState["controllers"] = [];
		const models = state.config.components?.schemas ?? {};

		Object.entries(models).forEach(([key, value]) => {
			models[key] = findModel(state, value);
		});

		Object.entries(action.payload.paths).forEach(([path, param]: [string, PathItemObject]) => {
			httpMethods.forEach((method) => {
				const query = param[method];
				if (query) {
					const [controllerName] = query.tags!;
					let controller = controllers.find((ctrl) => ctrl.name === controllerName);
					if (!controller) {
						controller = {
							name: controllerName,
							routes: [],
						};
						controllers.push(controller);
					}

					const responses: SwaggerResponse[] = [];

					Object.entries(query.responses).forEach(([httpStatus, response]: [string, ResponseObject]) => {
						responses.push({
							statusCode: Number.parseInt(httpStatus),
							...response,
						});
					});

					controller.routes.push({
						method,
						description: query.description,
						deprecated: query.deprecated ?? false,
						parameters: (query.parameters ?? []).map((param) => parseReqParameters(state, param as ParameterObject)),
						requestBody: query.requestBody ? (isRefType(query.requestBody) ? undefined : parseReqBody(state, query.requestBody)) : undefined,
						responses,
						uri: path,
					});
				}
			});
		});

		controllers.sort((ctrlA, ctrlB) => ctrlA.name.localeCompare(ctrlB.name));
		controllers.forEach((ctrl) => {
			ctrl.routes.sort((routeA, routeB) => routeA.uri.localeCompare(routeB.uri));
		});

		state.models = models;
		state.controllers = controllers;
	});
});
