export interface TraefikRouter {
	entryPoints: EntryPoint[];
	service: string;
	rule: string;
	priority?: number;
	status: Status;
	using: EntryPoint[];
	name: string;
	provider: Provider;
	middlewares?: string[];
}

export enum EntryPoint {
	External = "external",
	Internal = "internal",
	InternalTCP = "internal-tcp",
	Traefik = "traefik",
}

export enum Provider {
	Docker = "docker",
	Internal = "internal",
}

export enum Status {
	Enabled = "enabled",
	Disabled = "disabled",
}
