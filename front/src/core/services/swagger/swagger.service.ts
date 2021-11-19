import { inject, injectable } from "inversify";
import { SwaggerApiClient } from "../../apis/backend";
import { DiKeysApi } from "../../di/apis/di.keys.api";
import { OpenAPIObject } from "./swagger.types";

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
}
