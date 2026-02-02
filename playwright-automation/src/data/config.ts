import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Environment configuration reader
 * Converted from GlobalConfigsReader.java and EnvInfoReader.java
 */
export const config = {
    // Environment
    envName: process.env.ENV_NAME || 'Staging',

    // URLs
    baseUrl: process.env.BASE_URL || 'https://v2staging.garantieavantageplus.ca',
    adminPortalUrl: process.env.ADMIN_PORTAL_URL || 'https://v2staging.garantieavantageplus.ca/admin',
    dealerPortalUrl: process.env.DEALER_PORTAL_URL || 'https://v2staging.garantieavantageplus.ca/dealer',

    // Docker/Remote settings
    dockerRun: process.env.DOCKER_RUN === 'true',
    remoteUrl: process.env.REMOTE_URL || '',

    // Wait times (in milliseconds)
    defaultWaitTime: parseInt(process.env.DEFAULT_WAIT_TIME || '10000', 10),

    // Credentials
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || '',
    },
    dealer: {
        username: process.env.DEALER_USERNAME || 'dealer',
        password: process.env.DEALER_PASSWORD || '',
    },
};

/**
 * Get environment-specific configuration
 */
export function getEnvConfig(key: string): string {
    return process.env[key] || '';
}

/**
 * Check if running in Docker
 */
export function isDockerRun(): boolean {
    return config.dockerRun;
}

/**
 * Get the appropriate base URL based on portal type
 */
export function getPortalUrl(portal: 'admin' | 'dealer'): string {
    switch (portal) {
        case 'admin':
            return config.adminPortalUrl;
        case 'dealer':
            return config.dealerPortalUrl;
        default:
            return config.baseUrl;
    }
}
