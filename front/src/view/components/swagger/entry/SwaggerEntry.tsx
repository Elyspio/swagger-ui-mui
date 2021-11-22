import React from "react";
import { SwaggerRoute } from "../../../../store/module/swagger/swagger.types";
import { Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "../../../../store";
import { useModal } from "../../../hooks/useModal";
import { getChipColor, MethodChip } from "./MethodChip";
import "./SwaggerEntry.scss";
import { ResponseChip } from "./ResponseChip";
import { Parameters } from "./Parameters";

type Props = {
	data: SwaggerRoute;
};

export function SwaggerEntry({ data }: Props) {
	const { open, setOpen, setClose } = useModal(false);
	const theme = useAppSelector((s) => s.theme.current);
	const { palette } = useTheme();
	return (
		<Card>
			<Grid item container alignItems={"center"} spacing={2} onClick={setOpen}>
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

			<Dialog open={open} onClose={setClose} maxWidth={false}>
				<DialogTitle>
					<Grid container spacing={2} alignItems={"center"}>
						<Grid item>
							<Typography color={getChipColor(palette, theme, data.method)}>{data.method.toUpperCase()}</Typography>
						</Grid>
						<Grid item>
							<Typography color={"secondary"}>{data.uri}</Typography>
						</Grid>
					</Grid>
				</DialogTitle>
				<DialogContent dividers={true}>
					<Grid container spacing={3} direction={"column"}>
						<Grid item>
							<DialogContentText>{data.description}</DialogContentText>
						</Grid>

						<Grid container item>
							<Grid item>
								<Typography variant={"overline"}>Parameters</Typography>
							</Grid>

							<Grid container item spacing={0.7}>
								{data.parameters.map((param) => (
									<Grid item className={"w100"}>
										<Parameters key={param.name} {...param} />
									</Grid>
								))}
							</Grid>
						</Grid>

						<Grid container item>
							<Grid item>
								<Typography variant={"overline"}>HTTP Responses</Typography>
							</Grid>

							<Grid container item spacing={0.7} direction={"column"}>
								{data.responses.map((res) => (
									<Grid item xs={true}>
										<ResponseChip key={res.statusCode} {...res} uri={data.uri} method={data.method} />
									</Grid>
								))}
							</Grid>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={setClose}>Send</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
}
