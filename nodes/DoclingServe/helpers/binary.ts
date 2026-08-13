import type { IExecuteFunctions, IBinaryData } from 'n8n-workflow';

export async function prepareBinaryData(
	this: IExecuteFunctions,
	itemIndex: number,
	binaryPropertyName: string,
): Promise<{ base64: string; filename: string; mimeType: string }> {
	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	return {
		base64: buffer.toString('base64'),
		filename: binaryData.fileName ?? 'document',
		mimeType: binaryData.mimeType ?? 'application/octet-stream',
	};
}

export async function buildFileFormData(
	this: IExecuteFunctions,
	itemIndex: number,
	binaryPropertyName: string,
): Promise<FormData> {
	const binaryData = await prepareBinaryData.call(this, itemIndex, binaryPropertyName);
	const formData = new FormData();
	const blob = new Blob([Buffer.from(binaryData.base64, 'base64')], {
		type: binaryData.mimeType,
	});
	formData.append('files', blob, binaryData.filename);
	return formData;
}

export function isBinaryDataAvailable(binaryData: IBinaryData | undefined): boolean {
	return binaryData !== undefined && binaryData.data !== undefined;
}
