import { describe, expect, test } from 'bun:test';
import {
	appendChunkingFormFields,
	appendConvertFormFields,
	buildChunkingOptions,
	buildConvertOptions,
	getHttpTimeoutMs,
	getPollMaxAttempts,
} from '../../nodes/DoclingServe/helpers/options';
import { POLLING } from '../../nodes/DoclingServe/constants';

describe('buildConvertOptions', () => {
	test('returns undefined when no convert options are set', () => {
		expect(buildConvertOptions({})).toBeUndefined();
	});

	test('maps documentTimeout to document_timeout in seconds', () => {
		expect(buildConvertOptions({ documentTimeout: 600 })).toEqual({
			document_timeout: 600,
		});
	});

	test('maps ocrEngine to ocr_engine', () => {
		expect(buildConvertOptions({ ocrEngine: 'tesseract' })).toEqual({
			ocr_engine: 'tesseract',
		});
	});
});

describe('buildChunkingOptions', () => {
	test('maps n8n fields to chunking_options payload', () => {
		expect(
			buildChunkingOptions({
				maxTokens: 512,
				mergePeers: true,
			}),
		).toEqual({
			max_tokens: 512,
			merge_peers: true,
		});
	});
});

describe('chunk multipart field prefixes', () => {
	test('prefixes convert fields with convert_ for chunk file endpoints', () => {
		const formData = new FormData();
		appendConvertFormFields(
			formData,
			{
				ocr_engine: 'easyocr',
				document_timeout: 600,
			},
			'convert_',
		);

		const keys = [...formData.keys()];
		expect(keys).toContain('convert_ocr_engine');
		expect(keys).toContain('convert_document_timeout');
		expect(keys).not.toContain('document_timeout');
		expect(keys).not.toContain('ocr_engine');
		expect(formData.get('convert_document_timeout')).toBe('600');
	});

	test('leaves convert fields unprefixed for convert file endpoints', () => {
		const formData = new FormData();
		appendConvertFormFields(formData, { document_timeout: 600 });

		expect([...formData.keys()]).toEqual(['document_timeout']);
		expect(formData.get('document_timeout')).toBe('600');
	});

	test('prefixes chunking fields with chunking_', () => {
		const formData = new FormData();
		appendChunkingFormFields(formData, {
			max_tokens: 256,
			merge_peers: false,
		});

		const keys = [...formData.keys()];
		expect(keys).toContain('chunking_max_tokens');
		expect(keys).toContain('chunking_merge_peers');
		expect(keys).not.toContain('max_tokens');
		expect(keys).not.toContain('merge_peers');
	});
});

describe('getHttpTimeoutMs', () => {
	test('uses explicit requestTimeout in milliseconds', () => {
		expect(getHttpTimeoutMs({ requestTimeout: 700000 })).toBe(700000);
	});

	test('derives axios timeout from documentTimeout seconds plus 60s buffer', () => {
		expect(getHttpTimeoutMs({ documentTimeout: 600 })).toBe(660000);
	});

	test('prefers explicit requestTimeout over derived documentTimeout', () => {
		expect(
			getHttpTimeoutMs({
				documentTimeout: 600,
				requestTimeout: 900000,
			}),
		).toBe(900000);
	});

	test('returns undefined so n8n keeps its default when neither is set', () => {
		expect(getHttpTimeoutMs({})).toBeUndefined();
	});
});

describe('getPollMaxAttempts', () => {
	test('uses the default when documentTimeout is unset', () => {
		expect(getPollMaxAttempts({})).toBe(POLLING.DEFAULT_MAX_ATTEMPTS);
	});

	test('extends polling to cover documentTimeout', () => {
		expect(getPollMaxAttempts({ documentTimeout: 600 })).toBe(360);
	});
});
