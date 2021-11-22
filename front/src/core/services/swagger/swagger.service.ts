import { inject, injectable } from "inversify";
import { SwaggerApiClient } from "../../apis/backend";
import { DiKeysApi } from "../../di/apis/di.keys.api";
import type {
	ComponentsObject,
	OpenAPIObject,
	ParameterObject,
	PathItemObject,
	PathsObject,
	ReferenceObject,
	RequestBodyObject,
	ResponseObject,
	SchemaObject,
} from "./swagger.types";
import { httpMethods, SwaggerContent, SwaggerRequestBody, SwaggerResponse } from "../../../store/module/swagger/swagger.types";
import type { SwaggerState } from "../../../store/module/swagger/swagger.reducer";

type ReferenceOrAny = ReferenceObject | Required<any>;

@injectable()
export class SwaggerService {
	@inject(DiKeysApi.swagger)
	private swaggerApi!: SwaggerApiClient;

	public getSwaggerConfig = async (url: string): Promise<OpenAPIObject> => {
		return (await this.swaggerApi.client.getConfig(url).then((x) => x.data)) as OpenAPIObject;
	};

	public async getTraefikRouters() {
		return await this.swaggerApi.client.getRouters().then((x) => x.data);
	}

	// region parse

	public parseModels(models: Record<string, SchemaObject>): Record<string, SchemaObject> {
		const ret = {};
		Object.entries(models).forEach(([key, value]) => {
			ret[key] = this.findModel(models, value);
		});
		return ret;
	}

	public parseControllers(schemas: ComponentsObject["schemas"], paths: PathsObject) {
		const controllers: SwaggerState["controllers"] = [];
		Object.entries(paths).forEach(([path, param]: [string, PathItemObject]) => {
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
						parameters: (query.parameters ?? []).map((param) => this.parseReqParameters(schemas, param as ParameterObject)),
						requestBody: query.requestBody ? (this.isRefType(query.requestBody) ? undefined : this.parseReqBody(schemas, query.requestBody)) : undefined,
						responses: responses.map((res) => this.parseResponses(schemas, res)),
						uri: path,
					});
				}
			});
		});

		controllers.sort((ctrlA, ctrlB) => ctrlA.name.localeCompare(ctrlB.name));
		controllers.forEach((ctrl) => {
			ctrl.routes.sort((routeA, routeB) => routeA.uri.localeCompare(routeB.uri));
		});
		return controllers;
	}

	private getRefName = (str: string) => str.replace(new RegExp("#/components/schemas/(.*)"), "$1");

	private isRefType = (obj: ReferenceOrAny): obj is ReferenceObject => (obj as ReferenceObject).$ref !== undefined;

	private findModel<Obj extends ReferenceOrAny>(schemas: ComponentsObject["schemas"], obj: Obj): any {
		let ret = obj;
		for (const k of Object.keys(obj ?? {})) {
			if (k === "$ref") {
				const modelName = this.getRefName(obj[k]);
				const model = schemas?.[modelName] as any;
				model.name = modelName;
				return model;
			} else if (typeof obj === "object") {
				ret[k] = this.findModel(schemas, ret[k]);
			}
		}
		return ret as any;
	}

	private parseReqBody(schemas: ComponentsObject["schemas"], body?: RequestBodyObject): SwaggerRequestBody | undefined {
		console.log("parseReqBody");
		if (body === undefined) return undefined;

		let content: SwaggerRequestBody["content"] = {};

		Object.entries(body.content).forEach(([contentType, value]: [string, RequestBodyObject["content"][string]]) => {
			let schema = this.findModel(schemas, value.schema!);

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

	private parseResponses(schemas: ComponentsObject["schemas"], response: SwaggerResponse): SwaggerResponse {
		console.log("parseReqBody");

		let content: SwaggerRequestBody["content"] = {};

		Object.entries(response.content ?? {}).forEach(([contentType, value]: [string, SwaggerContent[string]]) => {
			let schema = this.findModel(schemas, value.schema!);

			content[contentType] = {
				encoding: value.encoding,
				schema,
			};
		});

		return {
			content: content,
			description: response.description,
			statusCode: response.statusCode,
			headers: response.headers,
			links: response.links,
		};
	}

	private parseReqParameters(state: ComponentsObject["schemas"], param: ParameterObject) {
		console.log("parseReqParameters");
		let schema = this.findModel(state, param.schema!);

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
	}

	// endregion
}
