import { Box, Palette, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "../../../../store";
import React from "react";
import { HTTPMethod } from "../../../../store/module/swagger/swagger.types";
import { Themes } from "../../../../config/theme";

export function MethodChip({ method }: MethodChipProps) {
	const { palette } = useTheme();
	const theme = useAppSelector((s) => s.theme.current);
	let color = getChipColor(palette, theme, method);
	return (
		<Box p={1.5} sx={{ backgroundColor: color }}>
			<Typography variant={"overline"}>{method}</Typography>
		</Box>
	);
}

type MethodChipProps = {
	method: HTTPMethod;
};

export function getChipColor(palette: Palette, theme: Themes, method: HTTPMethod) {
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
	return color;
}
