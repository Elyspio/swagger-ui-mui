import React from "react";
import { HTTPMethod, SwaggerResponse, SwaggerRoute } from "../../../store/module/swagger/swagger.types";
import { Alert, Box, Card, Grid, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "../../../store";
import { AlertColor } from "@mui/material/Alert/Alert";

type Props = {
	data: SwaggerRoute;
};

type MethodChipProps = {
	method: HTTPMethod;
};

function MethodChip({ method }: MethodChipProps) {
	const { palette } = useTheme();
	const theme = useAppSelector((s) => s.theme.current);
	let color = "";
	switch (method) {
		case "get":
			color = palette.info[theme];
			break;
		case "post":
			color = palette.success[theme];
			break;
		case "patch":
			color = "#a45dc7";
			break;
		case "delete":
			color = palette.error[theme];
			break;
		case "put":
			color = palette.warning[theme];
			break;
	}

	return (
		<Box p={1.5} sx={{ backgroundColor: color }}>
			<Typography variant={"overline"}>{method}</Typography>
		</Box>
	);
}

function ResponseChip({ description, statusCode }: SwaggerResponse) {
	let color: AlertColor = "info";
	if (statusCode >= 200 && statusCode <= 299) color = "success";
	if (statusCode >= 300 && statusCode <= 399) color = "warning";
	if (statusCode >= 400 && statusCode <= 599) color = "error";

	return (
		<Alert color={color} icon={false}>
			<Typography>
				<Typography component={"span"} fontWeight={"bold"}>
					{statusCode}
				</Typography>{" "}
				{description}
			</Typography>
		</Alert>
	);
}

export function SwaggerEntry({ data }: Props) {
	return (
		<Card>
			<Grid item container alignItems={"center"} spacing={2}>
				<Grid item sx={{ width: 100 }}>
					<MethodChip method={data.method} />
				</Grid>
				<Grid item>
					<Typography>{data.uri}</Typography>
				</Grid>
				<Grid item>
					<Typography pr={2} color={"secondary"}>
						{data.description}
					</Typography>
				</Grid>
			</Grid>

			{/*<Grid item container spacing={0.5}>*/}
			{/*	{data.responses.map((res) => (*/}
			{/*		<Grid item xs={true}>*/}
			{/*			<ResponseChip key={res.statusCode} {...res} />*/}
			{/*		</Grid>*/}
			{/*	))}*/}
			{/*</Grid>*/}
		</Card>
	);
}
