import Repository from "./repository";

export default {
  login(email, password) {
    return new Promise((resolve, reject) => {
      Repository.post("/auth/login", { email, password })
        .then(res => resolve(res))
        .catch(error => reject(error));
    });
  },
  logout() {
    return new Promise(resolve => {
      Repository.get("/auth/logout")
        .then(res => resolve(res))
        .catch(error => {
          // to avoid having an error in views
          try {
            resolve(error);
          } catch (e) {
            // nothing
          }
        });
    });
  }
};
