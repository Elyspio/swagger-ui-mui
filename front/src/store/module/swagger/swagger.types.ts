import type { EncodingPropertyObject, ParameterLocation, ResponseObject, SchemaObject } from "../../../core/services/swagger/swagger.types";

export const httpMethods = ["get", "post", "patch", "delete", "put", "options", "trace"] as const;
export type HTTPMethod = typeof httpMethods[number];

export type SwaggerRoute = {
	uri: string;
	method: HTTPMethod;
	description?: string;
	parameters: SwaggerParameter[];
	requestBody?: SwaggerRequestBody;
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
	schema?: SwaggerSchema;
};

export type SwaggerResponse = Omit<ResponseObject, "content"> & { statusCode: number } & { content?: SwaggerContent };

export type SwaggerSchema = Omit<SchemaObject, "properties" | "items"> & {
	properties: Record<string, SwaggerSchema>;
	items: SwaggerSchema;
	name: string;
};

export type SwaggerContent = {
	[contentType: string]: {
		schema?: SwaggerSchema;
		encoding?: {
			[contentType in string]: EncodingPropertyObject;
		};
	};
};

export interface SwaggerRequestBody {
	description?: string;
	content: SwaggerContent;
	required: boolean;
}
