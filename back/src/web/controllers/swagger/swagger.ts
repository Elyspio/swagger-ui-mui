import { Controller, Get, QueryParams } from "@tsed/common";
import { Description, Required, Returns } from "@tsed/schema";
import { Log } from "../../../core/utils/decorators/logger";
import { getLogger } from "../../../core/utils/logger";
import axios from "axios";
import { Inject } from "@tsed/di";
import { TraefikService } from "../../../core/services/traefik/traefik.service";
import { TraefikRouterModel } from "./swagger.model";

@Controller("/swagger")
export class Swagger {
	private static log = getLogger.controller(Swagger);

	@Inject()
	traefikService: TraefikService;

	@Get("/fetch")
	@(Returns(200, String).ContentType("application/json"))
	@Description("Get swagger/openapi configuration without cors issues")
	@Log(Swagger.log)
	async getConfig(
		@Required()
		@Description("Link to the documentation")
		@QueryParams("href")
		href: string
	) {
		return axios.get(href).then((x) => x.data);
	}

	@Get("/routers")
	@(Returns(200, Array).Of(TraefikRouterModel))
	async getRouters() {
		return this.traefikService.getRouters();
	}
}
