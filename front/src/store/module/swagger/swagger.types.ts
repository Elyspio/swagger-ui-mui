import type { ParameterLocation, RequestBodyObject, ResponseObject, SchemaObject } from "../../../core/services/swagger/swagger.types";

export const httpMethods = ["get", "post", "patch", "delete", "put", "options", "trace"] as const;
export type HTTPMethod = typeof httpMethods[number];

export type SwaggerRoute = {
	uri: string;
	method: HTTPMethod;
	description?: string;
	parameters: SwaggerParameter[];
	requestBody?: RequestBodyObject;
	responses: SwaggerResponse[];
	deprecated: boolean;
};

export type SwaggerParameter = {
	name: string;
	in: ParameterLocation; // "query" | "header" | "path" | "cookie";
	description?: string;
	required: boolean;
	deprecated: boolean;
	allowEmptyValue: boolean;
	allowReserved: boolean;
	schema?: SchemaObject;
};

export type SwaggerResponse = ResponseObject & { statusCode: number };
