export interface HostConfiguration {
    ownerMfaRequired: boolean;
};

const hostConfigurationMap: {[key: string]: Partial<HostConfiguration> } = {
    "acme-communities": {
        ownerMfaRequired: true
    },
    "globex": {
        ownerMfaRequired: false
    }
};

const defaultConfiguration: HostConfiguration = {
    ownerMfaRequired: false
};

export function getHostConfiguration(host: string): HostConfiguration {
    const hostConfiguration = hostConfigurationMap[host] || {};
    return { ...defaultConfiguration, ...hostConfiguration };
}