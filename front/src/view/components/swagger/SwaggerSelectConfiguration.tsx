import React from "react";
import { Autocomplete, Grid, TextField, useTheme } from "@mui/material";
import { useInjection } from "inversify-react";
import { SwaggerService } from "../../../core/services/swagger/swagger.service";
import { DiKeysService } from "../../../core/di/services/di.keys.service";
import { useAsyncState } from "../../hooks/useAsyncState";
import { getSwaggerConfig } from "../../../store/module/swagger/swagger.action";
import { useAppDispatch } from "../../../store";
import Button from "@mui/material/Button";

type Props = {
	/**
	 * Link to the swagger.json file (url or link to the documentation)
	 */
	href: string;
};

export function SwaggerSelectConfiguration({ href }: Props) {
	const services = {
		swagger: useInjection<SwaggerService>(DiKeysService.swagger),
	};

	const dispatch = useAppDispatch();

	const [url, setUrl] = React.useState(href);

	const getTraefikRouters = React.useCallback(() => services.swagger.getTraefikRouters(), [services.swagger]);

	const { data: routers } = useAsyncState(getTraefikRouters, [], []);

	const fetchConfig = React.useCallback(() => {
		let useUrl = url;
		const router = routers.find((datum) => datum.service === url);
		if (router) {
			useUrl = router.swagger;
		}
		dispatch(getSwaggerConfig(useUrl));
	}, [dispatch, url, routers]);

	const { palette } = useTheme();

	return (
		<Grid container alignItems={"center"} spacing={2} sx={{ backgroundColor: palette.background.paper }} pb={2}>
			<Grid item xs={true} minWidth={800} p={0}>
				<Autocomplete
					freeSolo
					onChange={(e, value) => setUrl(value as string)}
					options={routers.map((data) => data.service)}
					value={url}
					renderInput={(params) => <TextField {...params} label={"Url"} value={url} onChange={(e) => setUrl(e.target.value)} />}
				/>
			</Grid>

			<Grid item>
				<Button variant={"outlined"} onClick={fetchConfig}>
					Fetch
				</Button>
			</Grid>
		</Grid>
	);
}
