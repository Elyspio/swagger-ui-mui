import { HTTPMethod, SwaggerResponse } from "../../../../store/module/swagger/swagger.types";
import React, { useState } from "react";
import { AlertColor } from "@mui/material/Alert/Alert";
import { Alert, FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";

export function ResponseChip({ description, statusCode, content, uri, method }: SwaggerResponse & { uri: string; method: HTTPMethod }) {
	const contentTypes = React.useMemo(() => {
		return Object.keys(content ?? {});
	}, [content]);

	const [contentType, setContentType] = useState(contentTypes[0] ?? "");

	let color: AlertColor = "info";
	if (statusCode >= 200 && statusCode <= 299) color = "success";
	if (statusCode >= 300 && statusCode <= 399) color = "warning";
	if (statusCode >= 400 && statusCode <= 599) color = "error";

	return (
		<Alert color={color} icon={false}>
			<Grid container spacing={4} alignItems={"center"} justifyContent={"space-between"} className={"w100"}>
				<Grid item xs={6}>
					<Typography>
						<Typography component={"span"} fontWeight={"bold"}>
							{statusCode}
						</Typography>{" "}
						{description}
					</Typography>
				</Grid>
				<Grid item xs={3}>
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
									<MenuItem value={type}>{type}</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				</Grid>
				<Grid item xs={3}>
					{contentTypes[0] && <Typography>{JSON.stringify(content?.[contentType].schema, null, 2)}</Typography>}
				</Grid>
			</Grid>
		</Alert>
	);
}
