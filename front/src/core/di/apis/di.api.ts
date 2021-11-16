import { DiKeysApi } from "./di.keys.api";
import { SwaggerApiClient } from "../../apis/backend";
import { AuthenticationApiClient } from "../../apis/authentication";
import { container } from "../index";

container.bind<SwaggerApiClient>(DiKeysApi.swagger).to(SwaggerApiClient);

container.bind<AuthenticationApiClient>(DiKeysApi.authentication).to(AuthenticationApiClient);
