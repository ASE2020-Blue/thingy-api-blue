import Repository from './repository';

const resource = '/thingy';
export default {

  getAllThingies() {
    return Repository.get(`${resource}`);
  },
};
