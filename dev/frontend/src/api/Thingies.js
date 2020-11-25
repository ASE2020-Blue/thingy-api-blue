import Repository from "./repository";
import { appendParamsToUrl } from "@/api/appendParamsToUrl";

const resource = "/thingy";
export default {
  getAllThingies() {
    return Repository.get(`${resource}`);
  },
  getLastLocation(thingyUuid, params) {
    return Repository.get(
      `${resource}/${thingyUuid}/lastLocation`, // TODO
      params
    );
  },
  getEnvironmentValues(thingyUuid, params) {
    return Repository.get(
      appendParamsToUrl(
        `${resource}/${thingyUuid}/environmentParamsValues`,
        params
      )
    );
  },
  createEnvironmentValues(params) {
    // todo: remove
    return Repository.put(`environmentParamsValue`, params);
  },
};
