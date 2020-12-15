import Repository from "./repository";

export default {
  async login(email, password) {
    await Repository.post("/auth/login", { email, password });
  }
};
