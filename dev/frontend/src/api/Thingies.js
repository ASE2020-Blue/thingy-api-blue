import Repository from "./repository";
import { appendParamsToUrl } from "./appendParamsToUrl";

const resource = "/thingy";

export default {
  getAllThingies() {
    return Repository.get(`${resource}`);
  },
  getThingyLocations(thingyUuid, params) {
    return Repository.get(
      `${resource}/${thingyUuid}/locationHistories`,
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
};
