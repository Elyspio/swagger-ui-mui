import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses, TreeItemProps } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import Label from "@mui/icons-material/Label";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { SvgIconProps } from "@mui/material/SvgIcon";
import { Remove } from "@mui/icons-material";
import { SwaggerSchema } from "../../../store/module/swagger/swagger.types";

declare module "react" {
	interface CSSProperties {
		"--tree-view-color"?: string;
		"--tree-view-bg-color"?: string;
	}
}

type StyledTreeItemProps = TreeItemProps & {
	bgColor?: string;
	color?: string;
	labelIcon: React.ElementType<SvgIconProps>;
	labelInfo?: string;
	labelText?: string;
	hideKey?: boolean;
	required?: boolean;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
	color: theme.palette.text.secondary,
	[`& .${treeItemClasses.content}`]: {
		color: theme.palette.text.secondary,
		borderTopRightRadius: theme.spacing(2),
		borderBottomRightRadius: theme.spacing(2),
		paddingRight: theme.spacing(1),
		fontWeight: theme.typography.fontWeightMedium,
		"&.Mui-expanded": {
			fontWeight: theme.typography.fontWeightRegular,
		},
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
		"&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
			backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
			color: "var(--tree-view-color)",
		},
		[`& .${treeItemClasses.label}`]: {
			fontWeight: "inherit",
			color: "inherit",
		},
	},
	[`& .${treeItemClasses.group}`]: {
		marginLeft: 0,
		[`& .${treeItemClasses.content}`]: {
			paddingLeft: theme.spacing(2),
		},
	},
}));

function StyledTreeItem(props: StyledTreeItemProps) {
	const { bgColor, color, labelIcon: LabelIcon, labelInfo, labelText, ...other } = props;

	return (
		<StyledTreeItemRoot
			label={
				<Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
					<Box component={LabelIcon} color="inherit" sx={{ mr: 1, marginLeft: props.hideKey ? 2 : 0 }} />
					{!props.hideKey && (
						<Typography variant="body2" sx={{ fontWeight: "inherit", flexGrow: 0.75 }}>
							{labelText}
							{props.required && (
								<Typography component={"span"} color={"error"} mx={1}>
									*
								</Typography>
							)}
						</Typography>
					)}
					<Typography variant="caption" color="inherit" sx={{ flexGrow: 0.25 }}>
						{labelInfo}
					</Typography>
				</Box>
			}
			style={{
				"--tree-view-color": color,
				"--tree-view-bg-color": bgColor,
			}}
			{...other}
		/>
	);
}

let x = 0;

function UnderTree({ obj, hideKey, schema }: { obj: object; hideKey?: boolean; schema?: SwaggerSchema }) {
	return (
		<>
			{Object.entries(obj).map(([key, val]: [string, any]) => {
				if (typeof val === "object") {
					if (val instanceof Array) {
						return (
							<StyledTreeItem hideKey={hideKey} nodeId={x++ + ""} labelText={key} labelIcon={Label} required={schema?.required?.includes(key) ?? false}>
								{val.map((v) => (
									<UnderTree obj={v} hideKey schema={schema?.properties[key]} />
								))}
							</StyledTreeItem>
						);
					} else {
						return (
							<StyledTreeItem hideKey={hideKey} nodeId={x++ + ""} labelText={key} labelIcon={Label} required={schema?.required?.includes(key) ?? false}>
								<UnderTree obj={val} schema={schema?.properties[key]} />
							</StyledTreeItem>
						);
					}
				} else if (typeof val === "boolean" || typeof val === "string" || typeof val === "number") {
					return (
						<StyledTreeItem
							hideKey={hideKey}
							nodeId={x++ + ""}
							labelText={key}
							labelIcon={Remove}
							labelInfo={val + ""}
							required={schema?.required?.includes(key) ?? false}
						/>
					);
				} else {
					return null;
				}
			})}
		</>
	);
}

export function ObjectViewer({ obj, schema }: { obj: object; schema: SwaggerSchema }) {
	console.log(obj);
	return (
		<TreeView
			defaultCollapseIcon={<ArrowDropDownIcon />}
			defaultExpandIcon={<ArrowRightIcon />}
			defaultEndIcon={<div style={{ width: 24 }} />}
			sx={{ flexGrow: 1, maxWidth: 300 }}
		>
			<UnderTree obj={obj} schema={schema} />
		</TreeView>
	);
}
