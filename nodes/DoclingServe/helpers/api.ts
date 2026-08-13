import type {
	IExecuteFunctions,
	IHttpRequestMethods,
	IDataObject,
} from 'n8n-workflow';

export async function doclingApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
	timeout?: number,
): Promise<unknown> {
	const credentials = await this.getCredentials('doclingServeApi');
	const baseUrl = credentials.baseUrl as string;
	const apiKey = credentials.apiKey as string;

	return this.helpers.httpRequest({
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			...(apiKey ? { 'X-Api-Key': apiKey } : {}),
		},
		body,
		qs,
		json: true,
		...(timeout && timeout > 0 ? { timeout } : {}),
	});
}

export async function doclingFormRequest(
	this: IExecuteFunctions,
	endpoint: string,
	formData: FormData,
	timeout?: number,
): Promise<unknown> {
	const credentials = await this.getCredentials('doclingServeApi');
	const baseUrl = credentials.baseUrl as string;
	const apiKey = credentials.apiKey as string;

	return this.helpers.httpRequest({
		method: 'POST',
		url: `${baseUrl}${endpoint}`,
		headers: {
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
		body: formData,
		...(timeout && timeout > 0 ? { timeout } : {}),
	});
}
