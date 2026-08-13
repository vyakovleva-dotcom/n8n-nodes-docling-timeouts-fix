import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { ENDPOINTS } from '../../constants';
import { doclingApiRequest, doclingFormRequest } from '../../helpers/api';
import { buildFileFormData } from '../../helpers/binary';
import { completeAsyncTask, getTaskResult } from '../../helpers/polling';
import {
	appendConvertFormFields,
	buildConvertOptions,
	getHttpTimeoutMs,
	getPollMaxAttempts,
} from '../../helpers/options';
import type { TaskStatusResponse } from '../../types/responses';
import type { ConvertSourceRequest } from '../../types/requests';

export async function convertFromUrl(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const sourceUrl = this.getNodeParameter('sourceUrl', itemIndex) as string;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	const requestBody: ConvertSourceRequest = {
		sources: [{ kind: 'http', url: sourceUrl }],
		options: buildConvertOptions(additionalOptions),
	};

	const response = await doclingApiRequest.call(
		this,
		'POST',
		ENDPOINTS.CONVERT_SOURCE,
		requestBody as unknown as IDataObject,
		undefined,
		getHttpTimeoutMs(additionalOptions),
	);

	return {
		json: response as IDataObject,
		pairedItem: itemIndex,
	};
}

export async function convertFromFile(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const binaryPropertyName = this.getNodeParameter(
		'binaryPropertyName',
		itemIndex,
	) as string;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	const formData = await buildFileFormData.call(this, itemIndex, binaryPropertyName);
	appendConvertFormFields(formData, buildConvertOptions(additionalOptions));

	const response = await doclingFormRequest.call(
		this,
		ENDPOINTS.CONVERT_FILE,
		formData,
		getHttpTimeoutMs(additionalOptions),
	);

	return {
		json: response as IDataObject,
		pairedItem: itemIndex,
	};
}

export async function convertFromUrlAsync(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const sourceUrl = this.getNodeParameter('sourceUrl', itemIndex) as string;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	const requestBody: ConvertSourceRequest = {
		sources: [{ kind: 'http', url: sourceUrl }],
		options: buildConvertOptions(additionalOptions),
	};

	const taskResponse = (await doclingApiRequest.call(
		this,
		'POST',
		ENDPOINTS.CONVERT_SOURCE_ASYNC,
		requestBody as unknown as IDataObject,
		undefined,
		getHttpTimeoutMs(additionalOptions),
	)) as TaskStatusResponse;

	const result = await completeAsyncTask.call(
		this,
		taskResponse.task_id,
		getPollMaxAttempts(additionalOptions),
	);

	return {
		json: result as IDataObject,
		pairedItem: itemIndex,
	};
}

export async function convertFromFileAsync(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const binaryPropertyName = this.getNodeParameter(
		'binaryPropertyName',
		itemIndex,
	) as string;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	const formData = await buildFileFormData.call(this, itemIndex, binaryPropertyName);
	appendConvertFormFields(formData, buildConvertOptions(additionalOptions));

	const taskResponse = (await doclingFormRequest.call(
		this,
		ENDPOINTS.CONVERT_FILE_ASYNC,
		formData,
		getHttpTimeoutMs(additionalOptions),
	)) as TaskStatusResponse;

	const result = await completeAsyncTask.call(
		this,
		taskResponse.task_id,
		getPollMaxAttempts(additionalOptions),
	);

	return {
		json: result as IDataObject,
		pairedItem: itemIndex,
	};
}

export async function getStatus(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const taskId = this.getNodeParameter('taskId', itemIndex) as string;

	const response = await doclingApiRequest.call(
		this,
		'GET',
		`${ENDPOINTS.STATUS_POLL}/${taskId}`,
	);

	return {
		json: response as IDataObject,
		pairedItem: itemIndex,
	};
}

export async function getResult(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const taskId = this.getNodeParameter('taskId', itemIndex) as string;

	const response = await getTaskResult.call(this, taskId);

	return {
		json: response as IDataObject,
		pairedItem: itemIndex,
	};
}
