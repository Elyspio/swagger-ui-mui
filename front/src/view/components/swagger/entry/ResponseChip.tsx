import { HTTPMethod, SwaggerResponse } from "../../../../store/module/swagger/swagger.types";
import React, { useState } from "react";
import { AlertColor } from "@mui/material/Alert/Alert";
import { Alert, FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useInjection } from "inversify-react";
import { SwaggerService } from "../../../../core/services/swagger/swagger.service";
import { DiKeysService } from "../../../../core/di/services/di.keys.service";
import { ObjectViewer } from "../../viewer/ObjectViewer";

export function ResponseChip({ description, statusCode, content, uri, method }: SwaggerResponse & { uri: string; method: HTTPMethod }) {
	const contentTypes = React.useMemo(() => {
		return Object.keys(content ?? {});
	}, [content]);

	const [contentType, setContentType] = useState(contentTypes[0] ?? "");

	let color: AlertColor = "info";
	if (statusCode >= 200 && statusCode <= 299) color = "success";
	if (statusCode >= 300 && statusCode <= 399) color = "warning";
	if (statusCode >= 400 && statusCode <= 599) color = "error";

	let schema = React.useMemo(() => content?.[contentType]?.schema, [content, contentType]);

	const services = {
		swagger: useInjection<SwaggerService>(DiKeysService.swagger),
	};

	if (!schema) return null;

	return (
		<Alert color={color} icon={false}>
			<Grid container spacing={4} alignItems={"center"} className={"w100"}>
				<Grid item xs={4}>
					<Typography>
						<Typography component={"span"} fontWeight={"bold"}>
							{statusCode}
						</Typography>{" "}
						{description}
					</Typography>
				</Grid>
				<Grid item xs={3} width={100}>
					{contentTypes[0] && (
						<FormControl>
							<Select
								fullWidth
								variant={"standard"}
								autoWidth={false}
								labelId={`ResponseChip-${uri}-${statusCode}-${method}`}
								value={contentType}
								onChange={(e) => setContentType(e.target.value)}
							>
								{contentTypes.map((type) => (
									<MenuItem key={type} value={type}>
										{type}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				</Grid>
				<Grid item xs={5}>
					{contentTypes[0] &&
						(schema.type === "object" || schema.type === "array" ? (
							<ObjectViewer obj={services.swagger.jsonObjectToJsonExample(schema)} schema={schema} />
						) : (
							<pre>{schema.type}</pre>
						))}
				</Grid>
			</Grid>
		</Alert>
	);
}
