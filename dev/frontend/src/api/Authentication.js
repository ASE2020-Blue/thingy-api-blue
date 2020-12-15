import Repository from "./repository";

export default {
  login(email, password) {
    return new Promise((resolve, reject) => {
      Repository.post("/auth/login", { email, password })
        .then(res => resolve(res))
        .catch(error => reject(error));
    });
  }
};
