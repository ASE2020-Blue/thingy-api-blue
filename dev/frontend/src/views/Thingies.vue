<template>
  <div>
    <v-container>
      <v-row>
        <v-col :class="{ 'text-center': true }">
          <h1>Your report</h1>
        </v-col>
      </v-row>
    </v-container>
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
      <v-row class="d-flex  justify-space-between mb-3">
        <v-col cols="8" sm="4" class="pa-2">
          <v-select
            style="padding-top: 20px"
            :items="thingies"
            item-text="uuid"
            item-value="uuid"
            label="Available thingies"
            v-model="selectedThingy"
            outlined
            return-object
          />
        </v-col>

        <div cols="8" sm="4" class="pa-2">
          <v-col>
            <v-checkbox
              v-for="(envParam, index) in envParams"
              :key="`checkbox-param-${index}`"
              :label="envParam.value"
              :value="envParam.value"
              v-model="selectedEnvParams"
              hide-details
            />
          </v-col>
        </div>

        <v-col cols="8" sm="4" class="pa-2">
          <p class="text-body-1" style="padding-top: 20px">
            Show report of the
          </p>
          <v-radio-group v-model="selectedPeriod" max="1">
            <v-radio
              v-for="reportPeriod in reportPeriods"
              :key="reportPeriod"
              :label="`last ${reportPeriod} days`"
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

const today = new Date();
export default {
  name: "Thingies",
  components: { Graphic },
  data() {
    return {
      thingies: undefined,
      selectedThingy: undefined,
      reportPeriods: [7, 30],
      selectedPeriod: undefined,
      envValues: [],
      envParams: [],
      selectedEnvParam: undefined,
      graphSeries: [],
      isLoading: true,
      selectedEnvParams: [],
      dateFrom: undefined,
      dateTo: today,
    };
  },
  watch: {
    selectedThingy(value) {
      this.selectedThingy = value;
      this.loadEnvParamValues();
    },
    selectedPeriod(value) {
      this.selectedPeriod = value;
      this.dateFrom = new Date(today.getTime() - value * 24 * 60 * 60 * 1000);
      this.loadEnvParamValues();
    },
    selectedEnvParam() {
      this.loadEnvParamValues();
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
      .catch((err) => console.error(err))
      .finally((this.isLoading = false));
  },
  methods: {
    clearData() {
      this.envValues = [];
      this.graphSeries = [];
    },
    loadEnvParamValues() {
      if (this.selectedThingy) {
        const promises = [];
        this.envParams.forEach((envParam) => {
          const params = {
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
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
  },
};
</script>

<style scoped>
.v-container {
  max-width: 70%;
}
</style>
