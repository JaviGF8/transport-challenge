import axios from 'axios';
import { formatResources } from './formatters';

const API_URL =
  'https://apidev.meep.me/tripplan/api/v1/routers/lisboa/resources?lowerLeftLatLon=38.711046,-9.160096&upperRightLatLon=38.739429,-9.137115&companyZoneIds=545,467,473';

const get = (url) =>
  new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(({ data }) => {
        const companyZones = [];
        if (data && data.length) {
          data.forEach(
            ({ companyZoneId }) => -1 === companyZones.indexOf(companyZoneId) && companyZones.push(companyZoneId),
          );
        }
        resolve({ resources: formatResources(data), companyZones });
      })
      .catch((error) => {
        reject(error);
      });
  });

const getResources = () => get(API_URL);

export default getResources;
