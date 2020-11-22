<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="8" sm="6" md="4">
        <v-select
          :items="thingies"
          item-text="uuid"
          item-value="uuid"
          label="Available thingies"
          v-model="selectedThingy"
          outlined
          return-object
        />
      </v-col>
      <v-col cols="8" sm="6" md="4">
        <v-select
          :items="envParams"
          item-text="value"
          item-value="value"
          label="Environment parameter"
          v-model="selectedEnvParam"
          outlined
          return-object
        />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="8" sm="6" md="4">
        <v-radio-group v-model="selectedPeriod" max="1">
          <v-radio
            v-for="reportPeriod in reportPeriods"
            :key="reportPeriod"
            :label="`${reportPeriod} report`"
            :value="reportPeriod"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="8" sm="6" md="4"></v-col>
      <!--<v-spacer></v-spacer>-->
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6">
        <h3 v-for="envVal in envValues" :key="`envVal-${envVal.id}`">
          {{ envVal }}
        </h3>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6">
        <Graphic />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Thingies from "@/api/Thingies";
import { ENV_PARAMETERS } from "@/helpers/environmentParameters";
import Graphic from "@/components/Graphic";

export default {
  name: "Thingies",
  components: { Graphic },
  data() {
    return {
      thingies: undefined,
      selectedThingy: undefined,
      reportPeriods: ["weekly", "monthly"],
      selectedPeriod: undefined,
      envValues: [],
      envParams: [],
      selectedEnvParam: undefined,
    };
  },
  watch: {
    selectedThingy(value) {
      this.selectedThingy = value;
      Thingies.getEnvironmentValues(value.uuid)
        .then((res) => {
          this.envValues = res.data;
        })
        .catch((err) => console.error(err));
    },
    selectedEnvParam(value) {
      // TODO
      value.toString();
    },
  },
  created() {
    this.selectedPeriod = this.reportPeriods[0];
    this.envParams = ENV_PARAMETERS;
    this.selectedEnvParam = this.envParams[0];
    Thingies.getAllThingies()
      .then((res) => {
        this.thingies = res.data;
        this.thingies.sort((a, b) => (a.uuid > b.uuid ? 1 : -1));
        if (this.thingies.length > 0) this.selectedThingy = this.thingies[0];
      })
      .catch((err) => console.error(err));
  },
};
</script>

<style scoped></style>
