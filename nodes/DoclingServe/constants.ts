export const ENDPOINTS = {
	CONVERT_SOURCE: '/v1/convert/source',
	CONVERT_FILE: '/v1/convert/file',
	CONVERT_SOURCE_ASYNC: '/v1/convert/source/async',
	CONVERT_FILE_ASYNC: '/v1/convert/file/async',
	STATUS_POLL: '/v1/status/poll',
	RESULT: '/v1/result',
	CHUNK_HYBRID_SOURCE: '/v1/chunk/hybrid/source',
	CHUNK_HYBRID_FILE: '/v1/chunk/hybrid/file',
	CHUNK_HYBRID_SOURCE_ASYNC: '/v1/chunk/hybrid/source/async',
	CHUNK_HYBRID_FILE_ASYNC: '/v1/chunk/hybrid/file/async',
	CHUNK_HIERARCHICAL_SOURCE: '/v1/chunk/hierarchical/source',
	CHUNK_HIERARCHICAL_FILE: '/v1/chunk/hierarchical/file',
	CHUNK_HIERARCHICAL_SOURCE_ASYNC: '/v1/chunk/hierarchical/source/async',
	CHUNK_HIERARCHICAL_FILE_ASYNC: '/v1/chunk/hierarchical/file/async',
	HEALTH: '/health',
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
export type EndpointValue = (typeof ENDPOINTS)[EndpointKey];

export const OUTPUT_FORMATS = {
	MARKDOWN: 'markdown',
	HTML: 'html',
	JSON: 'json',
	DOCTAGS: 'doctags',
} as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[keyof typeof OUTPUT_FORMATS];

export const CHUNKER_TYPES = {
	HYBRID: 'hybrid',
	HIERARCHICAL: 'hierarchical',
} as const;

export type ChunkerType = (typeof CHUNKER_TYPES)[keyof typeof CHUNKER_TYPES];

export const POLLING = {
	DEFAULT_MAX_ATTEMPTS: 300,
	DEFAULT_INTERVAL_MS: 2000,
	COMPLETED_STATUSES: ['success', 'failure'],
} as const;

export const OPERATIONS = {
	DOCUMENT: {
		CONVERT_FROM_URL: 'convertFromUrl',
		CONVERT_FROM_FILE: 'convertFromFile',
		CONVERT_FROM_URL_ASYNC: 'convertFromUrlAsync',
		CONVERT_FROM_FILE_ASYNC: 'convertFromFileAsync',
		GET_STATUS: 'getStatus',
		GET_RESULT: 'getResult',
	},
	CHUNK: {
		CHUNK_FROM_URL: 'chunkFromUrl',
		CHUNK_FROM_FILE: 'chunkFromFile',
		CHUNK_FROM_URL_ASYNC: 'chunkFromUrlAsync',
		CHUNK_FROM_FILE_ASYNC: 'chunkFromFileAsync',
	},
	SYSTEM: {
		HEALTH_CHECK: 'healthCheck',
	},
} as const;

export const RESOURCES = {
	DOCUMENT: 'document',
	CHUNK: 'chunk',
	SYSTEM: 'system',
} as const;
