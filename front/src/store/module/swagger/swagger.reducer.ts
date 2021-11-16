import { createReducer } from "@reduxjs/toolkit";
import { getSwaggerConfig } from "./swagger.action";
import type { OpenAPIObject, ParameterObject, PathItemObject, RequestBodyObject, SchemaObject } from "../../../core/services/swagger/swagger.types";
import { ResponseObject } from "../../../core/services/swagger/swagger.types";
import { httpMethods, SwaggerResponse, SwaggerRoute } from "./swagger.types";

export interface SwaggerState {
	config?: OpenAPIObject;
	controllers: {
		name: string;
		description?: string;
		routes: SwaggerRoute[];
	}[];
}

const defaultState: SwaggerState = {
	controllers: [],
};

export const swaggerReducer = createReducer(defaultState, (builder) => {
	builder.addCase(getSwaggerConfig.fulfilled, (state, action) => {
		state.config = action.payload;
		const controllers: SwaggerState["controllers"] = [];

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
						parameters: (query.parameters ?? []).map((p) => {
							const obj = p as ParameterObject;
							const schema = ("$ref" in (obj.schema ?? {}) ? state.config!.components?.schemas?.[obj.schema!["$ref"]] : obj.schema) as SchemaObject;
							return {
								deprecated: obj.deprecated ?? false,
								description: obj.description,
								schema,
								name: obj.name,
								in: obj.in,
								allowEmptyValue: obj.allowEmptyValue ?? false,
								allowReserved: obj.allowReserved ?? false,
								required: obj.required ?? false,
							};
						}),
						requestBody: query.requestBody as RequestBodyObject,
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

		state.controllers = controllers;
	});
});
