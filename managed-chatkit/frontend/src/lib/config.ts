/**
 * Environment configuration and validation for ChatKit frontend.
 */

interface Config {
  workflowId: string;
  apiUrl: string;
}

class ConfigError extends Error {
  name = "ConfigError";
  constructor(message: string) {
    super(message);
  }
}

/**
 * Get and validate ChatKit workflow ID from environment.
 * @throws ConfigError if workflow ID is missing or invalid
 */
function getWorkflowId(): string {
  const id = import.meta.env.VITE_CHATKIT_WORKFLOW_ID;
  if (!id || typeof id !== "string") {
    throw new ConfigError(
      "Missing VITE_CHATKIT_WORKFLOW_ID environment variable. " +
      "Set it in .env.local. Get a workflow ID from OpenAI Agent Builder (starts with 'wf_')."
    );
  }

  const trimmed = id.trim();
  if (!trimmed.startsWith("wf_")) {
    throw new ConfigError(
      `Invalid VITE_CHATKIT_WORKFLOW_ID format. Expected to start with 'wf_', got '${trimmed.substring(0, 20)}...'`
    );
  }

  if (trimmed.includes("replace")) {
    throw new ConfigError(
      "VITE_CHATKIT_WORKFLOW_ID contains placeholder text. Please set it to a real workflow ID."
    );
  }

  return trimmed;
}

/**
 * Get API URL for backend requests.
 */
function getApiUrl(): string {
  // Allow override via environment variable
  return import.meta.env.VITE_API_URL || "/api";
}

/**
 * Validate and return configuration.
 * @param strict if true, require all config to be set
 * @throws ConfigError if required config is missing or invalid
 */
export function validateConfig(strict = true): Config {
  return {
    workflowId: getWorkflowId(),
    apiUrl: getApiUrl(),
  };
}

/**
 * Get configuration with error messages.
 * Returns config if valid, throws ConfigError if invalid.
 */
export function getConfig(): Config {
  try {
    return validateConfig();
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error("❌ Environment Configuration Error:", error.message);
      throw error;
    }
    throw error;
  }
}

/**
 * Print configuration info for debugging (no sensitive values).
 */
export function printConfigInfo(): void {
  try {
    const config = validateConfig();
    console.log("\n✓ ChatKit Frontend Configuration:");
    console.log(`  Workflow ID: ${config.workflowId.substring(0, 20)}...`);
    console.log(`  API URL: ${config.apiUrl}`);
    console.log();
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error(`\n✗ Configuration Error: ${error.message}\n`);
    }
  }
}
