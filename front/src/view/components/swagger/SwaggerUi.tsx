import { Box, Grid, Paper, TextField } from "@mui/material";
import "./SwaggerUi.scss";
import Button from "@mui/material/Button";
import * as React from "react";
import { useInjection } from "inversify-react";
import { SwaggerService } from "../../../core/services/swagger/swagger.service";
import { DiKeysService } from "../../../core/di/services/di.keys.service";

type Props = {
	/**
	 * Link to the swagger.json file (url or link to the documentation)
	 */
	href: string;
};

export const SwaggerUi = ({ href }: Props) => {
	const services = {
		swagger: useInjection<SwaggerService>(DiKeysService.swagger),
	};

	const [url, setUrl] = React.useState(href);

	return (
		<Paper>
			<Box p={2}>
				<Grid container direction={"column"} spacing={2}>
					<Grid item container alignItems={"center"} spacing={4}>
						<Grid item>
							<TextField fullWidth label={"Url"} value={url} onChange={(e) => setUrl(e.target.value)} />
						</Grid>

						<Grid item>
							<Button variant={"outlined"} onClick={() => services.swagger.getSwaggerConfig(url)}>
								Fetch
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
};
