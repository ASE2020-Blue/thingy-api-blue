import Repository from "./repository";

const resource = "/thingy";
export default {
  getAllThingies() {
    return Repository.get(`${resource}`);
  },
  getEnvironmentValues(thingyUuid, params) {
    return Repository.get(
      `${resource}/${thingyUuid}/locationHistories`,
      params
    );
  },
};
