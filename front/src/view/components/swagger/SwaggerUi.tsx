import { Autocomplete, Box, Grid, Paper, TextField } from "@mui/material";
import "./SwaggerUi.scss";
import Button from "@mui/material/Button";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getSwaggerConfig } from "../../../store/module/swagger/swagger.action";
import { SwaggerDetail } from "./SwaggerDetail";
import { useInjection } from "inversify-react";
import { DiKeysService } from "../../../core/di/services/di.keys.service";
import { SwaggerService } from "../../../core/services/swagger/swagger.service";
import { useAsyncState } from "../../hooks/useAsyncState";

type Props = {
	/**
	 * Link to the swagger.json file (url or link to the documentation)
	 */
	href: string;
};

export const SwaggerUi = ({ href }: Props) => {
	const dispatch = useAppDispatch();

	const services = {
		swagger: useInjection<SwaggerService>(DiKeysService.swagger),
	};

	const [url, setUrl] = React.useState(href);

	const getTraefikRouters = React.useCallback(() => services.swagger.getTraefikRouters(), [services.swagger]);

	const { data: routers } = useAsyncState(getTraefikRouters, [], []);

	const fetchConfig = React.useCallback(() => {
		let useUrl = url;
		const router = routers.find((datum) => datum.service === url);
		if (router) {
			useUrl = `https://elyspio.fr${router.path}/swagger/swagger.json`;
		}
		dispatch(getSwaggerConfig(useUrl));
	}, [dispatch, url, routers]);

	const { controllers } = useAppSelector((s) => s.swagger);

	return (
		<Paper className={"h100"} sx={{ overflowY: "auto" }}>
			<Box p={2}>
				<Grid container direction={"column"} spacing={8}>
					<Grid item container alignItems={"center"} spacing={2}>
						<Grid item xs={true} minWidth={800}>
							<Autocomplete
								freeSolo
								onChange={(e, value) => setUrl(value as string)}
								options={routers.map((data) => data.service)}
								renderInput={(params) => <TextField {...params} label={"Url"} value={url} onChange={(e) => setUrl(e.target.value)} />}
							/>
						</Grid>

						<Grid item>
							<Button variant={"outlined"} onClick={fetchConfig}>
								Fetch
							</Button>
						</Grid>
					</Grid>

					{controllers.length > 0 ? <SwaggerDetail /> : ""}
				</Grid>
			</Box>
		</Paper>
	);
};
