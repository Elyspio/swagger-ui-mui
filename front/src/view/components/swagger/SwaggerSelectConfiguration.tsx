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
	href?: string;
};

export function SwaggerSelectConfiguration({ href }: Props) {
	const services = {
		swagger: useInjection<SwaggerService>(DiKeysService.swagger),
	};

	const dispatch = useAppDispatch();

	const [url, setUrl] = React.useState(href);

	const getTraefikRouters = React.useCallback(() => services.swagger.getTraefikRouters(), [services.swagger]);

	const { data: routers } = useAsyncState(getTraefikRouters, [], []);

	const fetchConfig = React.useCallback(
		(urlCb?: string) => {
			let useUrl = urlCb ?? url;
			const router = routers.find((datum) => datum.service === urlCb ?? url);
			if (router) {
				useUrl = router.swagger;
			}
			if (useUrl) {
				dispatch(getSwaggerConfig(useUrl));
			}
		},
		[dispatch, url, routers]
	);

	React.useEffect(() => {
		if (href) {
			dispatch(getSwaggerConfig(href));
		}
	}, [href, dispatch]);

	const { palette } = useTheme();

	let onPreChange = React.useCallback(
		(e, value) => {
			setUrl(value as string);
			fetchConfig(value as string);
		},
		[fetchConfig]
	);
	return (
		<Grid container alignItems={"center"} spacing={2} sx={{ backgroundColor: palette.background.paper }} pb={2}>
			<Grid item xs={true} minWidth={400} p={0}>
				<Autocomplete
					freeSolo
					onChange={onPreChange}
					options={routers.map((data) => data.service)}
					value={url}
					renderInput={(params) => <TextField {...params} label={"Url"} value={url} onChange={(e) => setUrl(e.target.value)} />}
				/>
			</Grid>

			<Grid item>
				<Button variant={"outlined"} onClick={() => fetchConfig()}>
					Fetch
				</Button>
			</Grid>
		</Grid>
	);
}
