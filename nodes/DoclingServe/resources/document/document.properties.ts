import type { INodeProperties } from "n8n-workflow";
import { OUTPUT_FORMATS } from "../../constants";

export const sourceUrlProperty: INodeProperties = {
  displayName: "Source URL",
  name: "sourceUrl",
  type: "string",
  default: "",
  required: true,
  placeholder: "https://example.com/document.pdf",
  description: "URL of the document to convert",
};

export const binaryPropertyNameProperty: INodeProperties = {
  displayName: "Input Binary Field",
  name: "binaryPropertyName",
  type: "string",
  default: "data",
  required: true,
  description: "Name of the binary property containing the file to convert",
};

// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
export const outputFormatProperty: INodeProperties = {
  displayName: "Output Format",
  name: "outputFormat",
  type: "options",
  options: [
    {
      name: "Markdown",
      value: OUTPUT_FORMATS.MARKDOWN,
    },
    {
      name: "HTML",
      value: OUTPUT_FORMATS.HTML,
    },
    {
      name: "JSON",
      value: OUTPUT_FORMATS.JSON,
    },
    {
      name: "DocTags",
      value: OUTPUT_FORMATS.DOCTAGS,
    },
  ],
  default: OUTPUT_FORMATS.MARKDOWN,
  description: "The format to convert the document to",
};

export const additionalOptionsProperty: INodeProperties = {
  displayName: "Additional Options",
  name: "additionalOptions",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  options: [
    {
      displayName: "Document Timeout",
      name: "documentTimeout",
      type: "number",
      default: 300,
      typeOptions: {
        minValue: 1,
      },
      description:
        "Seconds Docling Serve may spend processing the document (server-side document_timeout). Not the HTTP client wait. Use seconds, e.g. 600, not milliseconds like 700000.",
    },
    {
      displayName: "HTTP Request Timeout",
      name: "requestTimeout",
      type: "number",
      default: 0,
      description:
        "Milliseconds the HTTP client should wait for the response. 0 uses the default (typically 5 minutes), or Document Timeout plus 60s when that is set.",
    },
    {
      displayName: "OCR Engine",
      name: "ocrEngine",
      type: "options",
      options: [
        {
          name: "EasyOCR (Default)",
          value: "easyocr",
        },
        {
          name: "Tesseract",
          value: "tesseract",
        },
      ],
      default: "easyocr",
      description: "OCR engine to use for scanned documents",
    },
  ],
};

export const taskIdProperty: INodeProperties = {
  displayName: "Task ID",
  name: "taskId",
  type: "string",
  default: "",
  required: true,
  description: "ID of the async task to check or retrieve",
};
