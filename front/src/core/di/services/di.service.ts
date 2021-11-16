import { AuthenticationService } from "../../services/authentication.service";
import { ThemeService } from "../../services/theme.service";
import { LocalStorageService } from "../../services/localStorage.service";
import { DiKeysService } from "./di.keys.service";
import { container } from "../index";
import { SwaggerService } from "../../services/swagger/swagger.service";

container.bind<AuthenticationService>(DiKeysService.authentication).to(AuthenticationService);

container.bind<SwaggerService>(DiKeysService.swagger).to(SwaggerService);

container.bind<ThemeService>(DiKeysService.theme).to(ThemeService);

container.bind<LocalStorageService>(DiKeysService.localStorage.settings).toConstantValue(new LocalStorageService("elyspio-authentication-settings"));

container.bind<LocalStorageService>(DiKeysService.localStorage.validation).toConstantValue(new LocalStorageService("elyspio-authentication-validation"));
