import { createReducer } from "@reduxjs/toolkit";
import { getSwaggerConfig } from "./swagger.action";
import type { OpenAPIObject, SchemaObject } from "../../../core/services/swagger/swagger.types";
import { SwaggerRoute } from "./swagger.types";
import { container } from "../../../core/di";
import { SwaggerService } from "../../../core/services/swagger/swagger.service";
import { DiKeysService } from "../../../core/di/services/di.keys.service";

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

const service = container.get<SwaggerService>(DiKeysService.swagger);

export const swaggerReducer = createReducer(defaultState, (builder) => {
	builder.addCase(getSwaggerConfig.fulfilled, (state, action) => {
		state.config = action.payload;

		state.models = service.parseModels((state.config.components?.schemas as Record<string, SchemaObject>) ?? {});
		state.controllers = service.parseControllers(state.models, action.payload.paths);
	});
});
