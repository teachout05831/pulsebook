import { PREVIEW_SAMPLES_1 } from "./blockPreviewSamples1";
import { PREVIEW_SAMPLES_2 } from "./blockPreviewSamples2";

const sampleData: Record<string, string> = { ...PREVIEW_SAMPLES_1, ...PREVIEW_SAMPLES_2 };

export function generatePreviewData(variables: string[]): Record<string, string> {
  return variables.reduce((acc, varName) => {
    acc[varName] = sampleData[varName] || `Sample ${varName}`;
    return acc;
  }, {} as Record<string, string>);
}
