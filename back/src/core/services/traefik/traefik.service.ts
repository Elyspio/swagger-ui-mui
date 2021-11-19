import { TraefikRouter } from "./traefik.type";
import axios from "axios";
import { Injectable } from "@tsed/di";

export type TraefikRouterData = {
	service: TraefikRouter["service"];
	path: TraefikRouter["rule"];
	status: TraefikRouter["status"];
	name: TraefikRouter["name"];
};

const traefikBaseUrl = process.env.TRAEFIK_BASE_URL ?? "https://elyspio.fr/proxy";

@Injectable()
export class TraefikService {
	async getRouters(): Promise<TraefikRouterData[]> {
		const { data } = await axios.get<TraefikRouter[]>(`${traefikBaseUrl}/api/http/routers`);

		const ret: TraefikRouterData[] = [];

		data.forEach((datum) => {
			if (datum.rule.includes("PathPrefix") && !datum.service.includes("@")) {
				ret.push({
					service: datum.service,
					path: datum.rule.replace(/PathPrefix\(`(.*)`\)/g, "$1"),
					status: datum.status,
					name: datum.name,
				});
			}
		});

		return ret;
	}
}
