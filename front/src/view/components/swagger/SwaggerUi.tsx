import { Box, Grid, Paper, useTheme } from "@mui/material";
import * as React from "react";
import { useAppSelector } from "../../../store";
import { SwaggerDetail } from "./SwaggerDetail";
import { SwaggerSelectConfiguration } from "./SwaggerSelectConfiguration";

type Props = {
	/**
	 * Link to the swagger.json file (url or link to the documentation)
	 */
	href?: string;
};

export const SwaggerUi = ({ href }: Props) => {
	const { controllers } = useAppSelector((s) => s.swagger);
	const { palette } = useTheme();
	return (
		<Paper className={"h100 w100"} sx={{ overflowY: "auto" }}>
			<Box p={2}>
				<Grid container direction={"column"} spacing={8}>
					<Grid item sx={{ position: "sticky", top: -50, left: 0, zIndex: 99, width: "100%", backgroundColor: palette.background.paper }}>
						<SwaggerSelectConfiguration href={href} />
					</Grid>

					{controllers.length > 0 ? (
						<Grid item>
							<SwaggerDetail />
						</Grid>
					) : (
						""
					)}
				</Grid>
			</Box>
		</Paper>
	);
};
