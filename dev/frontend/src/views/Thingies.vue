<template>
  <div>
    <h1>Hello thingies' world!</h1>
    <h3 v-for="thingy in thingies" :key="thingy.uuid">
      Thingy: {{ thingy.uuid }}
    </h3>
  </div>
</template>

<script>
import Thingies from "@/api/Thingies";

export default {
  name: "Thingies",
  data() {
    return {
      thingies: undefined,
    };
  },
  mounted() {
    Thingies.getAllThingies()
      .then((res) => {
        this.thingies = res.data;
      })
      .catch((err) => console.error(err));
  },
};
</script>

<style scoped></style>
