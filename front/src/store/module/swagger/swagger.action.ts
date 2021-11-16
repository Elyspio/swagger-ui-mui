import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { container } from "../../../core/di";
import { DiKeysService } from "../../../core/di/services/di.keys.service";
import { SwaggerService } from "../../../core/services/swagger/swagger.service";

const service = container.get<SwaggerService>(DiKeysService.swagger);

export const getSwaggerConfig = createAsyncThunk("authentication/logout", async (uri: string) => {
	return await toast.promise(service.getSwaggerConfig(uri), {
		error: `Could not fetch configuration at ${uri}`,
		pending: `Fetching ${uri}`,
		success: `Configuration successfully fetched`,
	});
});
