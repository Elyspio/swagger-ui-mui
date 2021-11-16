import { Box, Grid, Paper, TextField } from "@mui/material";
import "./SwaggerUi.scss";
import Button from "@mui/material/Button";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getSwaggerConfig } from "../../../store/module/swagger/swagger.action";
import { SwaggerDetail } from "./SwaggerDetail";

type Props = {
	/**
	 * Link to the swagger.json file (url or link to the documentation)
	 */
	href: string;
};

export const SwaggerUi = ({ href }: Props) => {
	const dispatch = useAppDispatch();

	const [url, setUrl] = React.useState(href);

	const fetchConfig = React.useCallback(() => {
		dispatch(getSwaggerConfig(url));
	}, [dispatch, url]);

	const { controllers } = useAppSelector((s) => s.swagger);

	return (
		<Paper className={"h100"} sx={{ overflowY: "auto" }}>
			<Box p={2}>
				<Grid container direction={"column"} spacing={8}>
					<Grid item container alignItems={"center"} spacing={2}>
						<Grid item xs={true} minWidth={800}>
							<TextField fullWidth label={"Url"} value={url} onChange={(e) => setUrl(e.target.value)} />
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
