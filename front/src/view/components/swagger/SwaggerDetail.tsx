import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography, useTheme } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { SwaggerEntry } from "./SwaggerEntry";
import { useAppSelector } from "../../../store";
import { SwaggerState } from "../../../store/module/swagger/swagger.reducer";

function mergeByLetter(routes: SwaggerState["controllers"]) {
	const map: Record<string, SwaggerState["controllers"]> = {};
	routes.forEach((route) => {
		let firstLetter = route.name[0];
		if (!map[firstLetter]) {
			map[firstLetter] = [];
		}
		map[firstLetter].push(route);
	});
	return map;
}

export function SwaggerDetail() {
	const { controllers } = useAppSelector((s) => s.swagger);

	const { palette } = useTheme();

	const mappedControllers = React.useMemo(() => Object.values(mergeByLetter(controllers)), [controllers]);

	return (
		<Grid container item direction={"row"} spacing={2}>
			{mappedControllers.map((ctrls, index) => (
				<Grid item container p={4} key={index} spacing={2}>
					{ctrls.map((ctrl) => (
						<Grid item key={ctrl.name}>
							<Accordion sx={{ backgroundColor: palette.background.default }}>
								<AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" id="panel1bh-header">
									<Typography variant={"overline"} sx={{ width: "33%", flexShrink: 0 }}>
										{ctrl.name}
									</Typography>
									<Typography sx={{ color: "text.secondary" }}>{ctrl.description}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Box p={2}>
										{ctrl.routes.map((route) => (
											<Box key={`${ctrl.name}:${route.method}:${route.uri}`} py={1}>
												<SwaggerEntry data={route} />
											</Box>
										))}
									</Box>
								</AccordionDetails>
							</Accordion>
						</Grid>
					))}
				</Grid>
			))}
		</Grid>
	);
}

export default SwaggerEntry;
