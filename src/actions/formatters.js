const LOW_BATTERY = -1;

const formatResource = (resource) => ({
  ...resource,
  className: `company-zone-${resource.companyZoneId}${LOW_BATTERY === resource.batteryLevel ? ' low-battery' : ''}`,
  latitude: resource.y,
  longitude: resource.x,
});

export const formatResources = (resources) => {
  if (resources && resources.length) {
    return resources.map(formatResource);
  }
  return [];
};

export const formatError = (error) =>
  (error &&
    error.response &&
    error.response.data &&
    error.response.data.errors &&
    0 < error.response.data.errors.length &&
    error.response.data.errors[0].message) ||
  (error && error.message);
