export interface Configuration {
  outageStartDate?: string;
  outageEndDate?: string;
  outageMessage?: string;
  maintenanceMode?: boolean;
  featureFlags?: FeatureFlagConfiguration;
}

export interface FeatureFlagConfiguration {
  useUpdatedComplianceFields: boolean;
}
