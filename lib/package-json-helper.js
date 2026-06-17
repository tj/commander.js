import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

/**
 * Find the nearest package.json file starting from a given directory.
 * Searches upward through the directory tree.
 *
 * @param {string} startDir - The directory to start searching from
 * @returns {Promise<{path: string, content: object} | null>} - The path and parsed content of package.json, or null if not found
 */
async function findNearestPackageJson(startDir) {
  let currentDir = resolve(startDir);

  while (true) {
    const packageJsonPath = resolve(currentDir, 'package.json');

    try {
      const content = await readFile(packageJsonPath, 'utf-8');
      const parsed = JSON.parse(content);

      // Verify it has the expected package.json structure
      if (typeof parsed === 'object' && parsed !== null) {
        return { path: packageJsonPath, content: parsed };
      }
    } catch (error) {
      // File doesn't exist or can't be parsed, continue searching
    }

    // Move to parent directory
    const parentDir = dirname(currentDir);

    // If we've reached the root or can't go up further, stop
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

/**
 * Extract the package.json fields to use in Commander.
 *
 * @param {object} packageJson - The parsed package.json content
 * @param {{name?: boolean, version?: boolean, description?: boolean}} options - Which fields to use
 * @returns {{name?: string, version?: string, description?: string}} - The extracted fields
 */
function extractPackageFields(packageJson, options) {
  const result = {};

  if (options.name && typeof packageJson.name === 'string') {
    result.name = packageJson.name;
  }

  if (options.version && typeof packageJson.version === 'string') {
    result.version = packageJson.version;
  }

  if (options.description && typeof packageJson.description === 'string') {
    result.description = packageJson.description;
  }

  return result;
}

/**
 * Get the starting directory for package.json search.
 * Handles both ESM (import.meta.url) and CommonJS (__dirname) environments.
 *
 * @param {string | URL} [startFrom] - Optional starting point (file path or URL)
 * @returns {string} - The directory to start searching from
 */
function getStartingDirectory(startFrom) {
  if (!startFrom) {
    // Fallback to current working directory
    return process.cwd();
  }

  // Handle ESM import.meta.url
  if (typeof startFrom === 'string' && startFrom.startsWith('file://')) {
    return dirname(fileURLToPath(startFrom));
  }

  // Handle URL object
  if (startFrom instanceof URL) {
    return dirname(fileURLToPath(startFrom));
  }

  // Handle file path string
  return dirname(resolve(startFrom));
}

export { findNearestPackageJson, extractPackageFields, getStartingDirectory };