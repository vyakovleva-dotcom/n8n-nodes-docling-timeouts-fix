import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { ENDPOINTS, CHUNKER_TYPES, type ChunkerType } from '../../constants';
import { doclingApiRequest, doclingFormRequest } from '../../helpers/api';
import { buildFileFormData } from '../../helpers/binary';
import { completeAsyncTask } from '../../helpers/polling';
import {
	appendChunkingFormFields,
	appendConvertFormFields,
	buildChunkingOptions,
	buildConvertOptions,
	getHttpTimeoutMs,
	getPollMaxAttempts,
} from '../../helpers/options';
import type { ChunkRequest } from '../../types/requests';
import type { TaskStatusResponse } from '../../types/responses';

function getChunkEndpoint(
	chunkerType: ChunkerType,
	isFile: boolean,
	isAsync = false,
): string {
	if (chunkerType === CHUNKER_TYPES.HYBRID) {
		if (isFile) {
			return isAsync ? ENDPOINTS.CHUNK_HYBRID_FILE_ASYNC : ENDPOINTS.CHUNK_HYBRID_FILE;
		}
		return isAsync
			? ENDPOINTS.CHUNK_HYBRID_SOURCE_ASYNC
			: ENDPOINTS.CHUNK_HYBRID_SOURCE;
	}

	if (isFile) {
		return isAsync
			? ENDPOINTS.CHUNK_HIERARCHICAL_FILE_ASYNC
			: ENDPOINTS.CHUNK_HIERARCHICAL_FILE;
	}

	return isAsync
		? ENDPOINTS.CHUNK_HIERARCHICAL_SOURCE_ASYNC
		: ENDPOINTS.CHUNK_HIERARCHICAL_SOURCE;
}

function buildChunkRequest(
	sourceUrl: string,
	additionalOptions: IDataObject,
): ChunkRequest {
	return {
		sources: [{ kind: 'http', url: sourceUrl }],
		chunking_options: buildChunkingOptions(additionalOptions),
		convert_options: buildConvertOptions(additionalOptions),
		include_converted_doc: (additionalOptions.includeConvertedDoc as boolean) ?? false,
	};
}

function appendChunkFormFields(formData: FormData, additionalOptions: IDataObject): void {
	appendChunkingFormFields(formData, buildChunkingOptions(additionalOptions));
	appendConvertFormFields(formData, buildConvertOptions(additionalOptions), 'convert_');
	if (additionalOptions.includeConvertedDoc) {
		formData.append('include_converted_doc', 'true');
	}
}

export async function chunkFromUrl(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const sourceUrl = this.getNodeParameter('sourceUrl', itemIndex) as string;
	const chunkerType = this.getNodeParameter('chunkerType', itemIndex) as ChunkerType;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	const response = await doclingApiRequest.call(
		this,
		'POST',
		getChunkEndpoint(chunkerType, false),
		buildChunkRequest(sourceUrl, additionalOptions) as unknown as IDataObject,
		undefined,
		getHttpTimeoutMs(additionalOptions),
	);

	return {
		json: response as IDataObject,
		pairedItem: itemIndex,
	};
}

export async function chunkFromFile(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const binaryPropertyName = this.getNodeParameter(
		'binaryPropertyName',
		itemIndex,
	) as string;
	const chunkerType = this.getNodeParameter('chunkerType', itemIndex) as ChunkerType;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	const formData = await buildFileFormData.call(this, itemIndex, binaryPropertyName);
	appendChunkFormFields(formData, additionalOptions);

	const response = await doclingFormRequest.call(
		this,
		getChunkEndpoint(chunkerType, true),
		formData,
		getHttpTimeoutMs(additionalOptions),
	);

	return {
		json: response as IDataObject,
		pairedItem: itemIndex,
	};
}

export async function chunkFromUrlAsync(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const sourceUrl = this.getNodeParameter('sourceUrl', itemIndex) as string;
	const chunkerType = this.getNodeParameter('chunkerType', itemIndex) as ChunkerType;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	const taskResponse = (await doclingApiRequest.call(
		this,
		'POST',
		getChunkEndpoint(chunkerType, false, true),
		buildChunkRequest(sourceUrl, additionalOptions) as unknown as IDataObject,
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

export async function chunkFromFileAsync(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const binaryPropertyName = this.getNodeParameter(
		'binaryPropertyName',
		itemIndex,
	) as string;
	const chunkerType = this.getNodeParameter('chunkerType', itemIndex) as ChunkerType;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	const formData = await buildFileFormData.call(this, itemIndex, binaryPropertyName);
	appendChunkFormFields(formData, additionalOptions);

	const taskResponse = (await doclingFormRequest.call(
		this,
		getChunkEndpoint(chunkerType, true, true),
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
