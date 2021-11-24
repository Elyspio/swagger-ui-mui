import { HTTPMethod, SwaggerRequestBody } from "../../../../store/module/swagger/swagger.types";
import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useInjection } from "inversify-react";
import { SwaggerService } from "../../../../core/services/swagger/swagger.service";
import { DiKeysService } from "../../../../core/di/services/di.keys.service";
import { ObjectViewer } from "../../viewer/ObjectViewer";

export function RequestBody({ description, content }: SwaggerRequestBody & { uri: string; method: HTTPMethod }) {
	const contentTypes = React.useMemo(() => {
		return Object.keys(content ?? {});
	}, [content]);

	const [contentType] = useState(contentTypes[0] ?? "");

	let schema = React.useMemo(() => content?.[contentType]?.schema, [content, contentType]);

	const services = {
		swagger: useInjection<SwaggerService>(DiKeysService.swagger),
	};

	if (!schema) return null;

	return (
		<Grid container spacing={4} className={"w100"} direction={"column"}>
			{description && (
				<Grid item xs={4}>
					<Typography color={"secondary"}>{description}</Typography>
				</Grid>
			)}

			{/*<Grid item xs={3}>*/}
			{/*	{contentTypes[0] && (*/}
			{/*		<FormControl>*/}
			{/*			<Select*/}
			{/*				fullWidth*/}
			{/*				variant={"standard"}*/}
			{/*				autoWidth={false}*/}
			{/*				labelId={`ResponseChip-${uri}-${method}`}*/}
			{/*				value={contentType}*/}
			{/*				onChange={(e) => setContentType(e.target.value)}*/}
			{/*			>*/}
			{/*				{contentTypes.map((type) => (*/}
			{/*					<MenuItem value={type}>{type}</MenuItem>*/}
			{/*				))}*/}
			{/*			</Select>*/}
			{/*		</FormControl>*/}
			{/*	)}*/}
			{/*</Grid>*/}

			<Grid item xs={12}>
				{schema.type === "object" || schema.type === "array" ? (
					<ObjectViewer obj={services.swagger.jsonObjectToJsonExample(schema)} schema={schema} />
				) : (
					<pre>{schema.type}</pre>
				)}
			</Grid>
		</Grid>
	);
}
