import { AnyOf, Property, Required } from "@tsed/schema";
import { ExternalDocumentationObject, OperationObject, ParameterObject, PathItemObject, ReferenceObject, ServerObject, ServerVariableObject } from "./swagger.types";

export class ExternalDocumentationObjectModel implements ExternalDocumentationObject {
	@Property()
	@Required()
	public description: string;
	@Property()
	@Required()
	public url: string;
}

export class ServerObjectModel implements ServerObject {
	@Property()
	@Required()
	public description: string;
	@Property()
	public url: string;
	@Property()
	public variables: { [p: string]: ServerVariableObject };
}

export class OperationObjectModel implements Partial<OperationObject> {
	@Property()
	public deprecated: boolean;
	@Property()
	@Required()
	public description: string;
	@Property()
	public externalDocs: ExternalDocumentationObjectModel;
	@Property()
	@Required()
	public operationId: string;
	@AnyOf()
	public parameters: (ParameterObject | ReferenceObject)[];

	@Property(ServerObjectModel)
	public servers: ServerObjectModel[];
	@Property()
	@Required()
	public summary: string;
	@Property()
	@Required()
	public tags: string[];
}

export class PathItemObjectModel implements PathItemObject {
	@Property()
	summary?: string;
	@Property()
	description?: string;
	@Property()
	get?: OperationObject;
	@Property()
	put?: OperationObject;
	@Property()
	post?: OperationObject;
	@Property()
	delete?: OperationObject;
	@Property()
	options?: OperationObject;
	@Property()
	head?: OperationObject;
	@Property()
	patch?: OperationObject;
	@Property()
	trace?: OperationObject;
	@Property()
	servers?: ServerObject[];
	parameters?: (ParameterObject | ReferenceObject)[];
}
