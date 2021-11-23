import { SwaggerParameter } from "../../../../store/module/swagger/swagger.types";
import React from "react";
import { Grid, Typography } from "@mui/material";
import { useInjection } from "inversify-react";
import { SwaggerService } from "../../../../core/services/swagger/swagger.service";
import { DiKeysService } from "../../../../core/di/services/di.keys.service";
import { ObjectViewer } from "../../viewer/ObjectViewer";

export function Parameters({ description, schema, name, required }: SwaggerParameter) {
	const services = {
		swagger: useInjection<SwaggerService>(DiKeysService.swagger),
	};

	if (!schema) return null;

	return (
		<Grid container spacing={4} alignItems={"center"} className={"w100"}>
			<Grid item xs={4}>
				<Grid container alignItems={"center"} spacing={1}>
					<Grid item>
						<Typography variant={"subtitle2"}>{name}</Typography>
					</Grid>
					{required && (
						<Grid item>
							<Typography component={"span"} color={"error"}>
								*
							</Typography>
						</Grid>
					)}
				</Grid>
			</Grid>

			<Grid item xs={3}>
				<Typography color={"secondary"}>{description}</Typography>
			</Grid>

			<Grid item xs={5}>
				{schema.type === "object" || schema.type === "array" ? (
					<ObjectViewer obj={services.swagger.jsonObjectToJsonExample(schema)} schema={schema} />
				) : (
					<pre>{schema.type}</pre>
				)}
			</Grid>
		</Grid>
	);
}
