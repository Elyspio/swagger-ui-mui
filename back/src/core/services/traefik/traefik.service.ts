import { TraefikRouter } from "./traefik.type";
import axios from "axios";
import { Injectable } from "@tsed/di";

export type TraefikRouterData = {
	service: TraefikRouter["service"];
	path: TraefikRouter["rule"];
	status: TraefikRouter["status"];
	name: TraefikRouter["name"];
	swagger: string;
};

const traefikBaseUrl = process.env.TRAEFIK_BASE_URL ?? "https://elyspio.fr/proxy";

@Injectable()
export class TraefikService {
	async getRouters(): Promise<TraefikRouterData[]> {
		const { data } = await axios.get<TraefikRouter[]>(`${traefikBaseUrl}/api/http/routers`);

		const ret: TraefikRouterData[] = [];

		await Promise.all(
			data.map(async (datum) => {
				if (datum.rule.includes("PathPrefix") && !datum.service.includes("@")) {
					let path = datum.rule.replace(/PathPrefix\(`(.*)`\)/g, "$1");
					const swagger = `https://elyspio.fr${path}/swagger/swagger.json`;

					try {
						await axios.get(swagger, { timeout: 500 });

						ret.push({
							service: datum.service,
							path: path,
							status: datum.status,
							name: datum.name,
							swagger,
						});
					} catch {}
				}
			})
		);

		return ret;
	}
}
