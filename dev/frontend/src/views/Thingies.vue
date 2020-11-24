<template>
  <div>
    <v-container v-if="isLoading">
      <v-row>
        <v-col
          :class="{ 'text-center': true }"
          col="12"
          align-self="center"
          justify-self="center"
        >
          <v-progress-circular
            :size="100"
            :width="10"
            color="primary"
            indeterminate
          />
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
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
      </v-row>
      <v-row justify="center">
        <v-col cols="8" sm="6" md="4">
          <v-checkbox
            v-for="(envParam, index) in envParams"
            :key="`checkbox-param-${index}`"
            :label="envParam.value"
            :value="envParam.value"
            v-model="selectedEnvParams"
            hide-details
            @click="clickEnvParam"
          />
        </v-col>
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
      </v-row>
      <Graphic
        v-bind:envParams="envParams"
        v-bind:series="graphSeries"
        v-bind:selectedEnvParams="selectedEnvParams"
      />
    </v-container>
  </div>
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
      reportPeriods: ["this week", "this month"],
      selectedPeriod: undefined,
      envValues: [],
      envParams: [],
      selectedEnvParam: undefined,
      graphSeries: [],
      isLoading: true,
      selectedEnvParams: [],
    };
  },
  watch: {
    selectedThingy(value) {
      this.selectedThingy = value;
      this.loadEnvParamValues();
    },
    selectedEnvParam(value) {
      // TODO
      this.loadEnvParamValues();
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

        // this.createEnvParamValues()
      })
      .catch((err) => console.error(err))
      .finally((this.isLoading = false));
  },
  methods: {
    loadEnvParamValues() {
      if (this.selectedThingy) {
        const promises = [];
        this.envParams.forEach((envParam) => {
          const params = {
            dateFrom: new Date(),
            dateTo: new Date(),
            envParam: envParam.value,
          };
          promises.push(
            Thingies.getEnvironmentValues(this.selectedThingy.uuid, params)
          );
        });
        Promise.all(promises)
          .then((resAll) => {
            this.graphSeries = resAll;
          })
          .catch((err) => console.error(err));
      }
    },
    /*createEnvParamValues() { // TODO remove
      let params = {
        uuid: this.selectedThingy.uuid,
        value: 22,
        envParam: ENV_PARAMETERS[0].value
      }
      Thingies.createEnvironmentValues(params)
    }*/
  },
};
</script>

<style scoped>
.v-container {
  max-width: 70%;
}
</style>
