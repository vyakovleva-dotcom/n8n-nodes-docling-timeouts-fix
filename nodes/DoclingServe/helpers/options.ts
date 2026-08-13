import type { IDataObject } from 'n8n-workflow';
import { POLLING } from '../constants';
import type { ChunkingOptions, ConvertOptions } from '../types/requests';

const HTTP_TIMEOUT_BUFFER_MS = 60_000;

export function buildConvertOptions(
	additionalOptions: IDataObject,
): ConvertOptions | undefined {
	const options: ConvertOptions = {};

	if (additionalOptions.ocrEngine) {
		options.ocr_engine = additionalOptions.ocrEngine as string;
	}

	if (additionalOptions.documentTimeout) {
		options.document_timeout = additionalOptions.documentTimeout as number;
	}

	return Object.keys(options).length > 0 ? options : undefined;
}

export function buildChunkingOptions(
	additionalOptions: IDataObject,
): ChunkingOptions | undefined {
	const chunkingOptions: ChunkingOptions = {};

	if (additionalOptions.maxTokens !== undefined) {
		chunkingOptions.max_tokens = additionalOptions.maxTokens as number;
	}

	if (additionalOptions.mergePeers !== undefined) {
		chunkingOptions.merge_peers = additionalOptions.mergePeers as boolean;
	}

	return Object.keys(chunkingOptions).length > 0 ? chunkingOptions : undefined;
}

export function appendConvertFormFields(
	formData: FormData,
	options: ConvertOptions | undefined,
	prefix = '',
): void {
	if (!options) {
		return;
	}

	if (options.ocr_engine) {
		formData.append(`${prefix}ocr_engine`, options.ocr_engine);
	}

	if (options.document_timeout) {
		formData.append(`${prefix}document_timeout`, String(options.document_timeout));
	}
}

export function appendChunkingFormFields(
	formData: FormData,
	options: ChunkingOptions | undefined,
): void {
	if (!options) {
		return;
	}

	if (options.max_tokens !== undefined) {
		formData.append('chunking_max_tokens', String(options.max_tokens));
	}

	if (options.merge_peers !== undefined) {
		formData.append('chunking_merge_peers', String(options.merge_peers));
	}
}

export function getHttpTimeoutMs(additionalOptions: IDataObject): number | undefined {
	const requestTimeout = additionalOptions.requestTimeout as number | undefined;
	if (requestTimeout && requestTimeout > 0) {
		return requestTimeout;
	}

	const documentTimeout = additionalOptions.documentTimeout as number | undefined;
	if (documentTimeout && documentTimeout > 0) {
		return documentTimeout * 1000 + HTTP_TIMEOUT_BUFFER_MS;
	}

	return undefined;
}

export function getPollMaxAttempts(additionalOptions: IDataObject): number {
	const documentTimeout = additionalOptions.documentTimeout as number | undefined;
	if (!documentTimeout || documentTimeout <= 0) {
		return POLLING.DEFAULT_MAX_ATTEMPTS;
	}

	const attemptsFromTimeout =
		Math.ceil((documentTimeout * 1000) / POLLING.DEFAULT_INTERVAL_MS) + 60;

	return Math.max(POLLING.DEFAULT_MAX_ATTEMPTS, attemptsFromTimeout);
}
