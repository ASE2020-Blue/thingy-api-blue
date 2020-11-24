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
        <div v-if="selectedEnvParams.length > 0 && seriesChart.length > 0">
          <div
            v-for="(param, index) in seriesChart"
            :key="`env-param-${index}`"
          >
            <v-col
              cols="12"
              sm="6"
              v-if="selectedEnvParams.includes(param[0].name)"
            >
              <h3>Report for {{ param[0].name }}</h3>
              <chart
                v-if="param[0].data.length > 0"
                width="500"
                type="line"
                :options="getChartOptions(param)"
                :series="param"
              />
              <p v-else>No data.</p>
            </v-col>
          </div>
        </div>
        <v-col cols="12" sm="6" v-else-if="selectedEnvParams.length === 0">
          <h4 class="text-center">No selected environment parameter</h4>
        </v-col>
        <v-col cols="12" sm="6" v-else>
          <h3 class="text-center">No data.</h3>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Graphic",
  props: ["series", "envParams", "selectedEnvParams"],
  data() {
    return {
      isLoading: true,
      seriesChart: [],
      xaxis: [],
      dateFrom: new Date(),
      dateTo: new Date(),
    };
  },
  watch: {
    series() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      this.isLoading = true;
      this.seriesChart = [];
      this.series.forEach((serie, index) => {
        const values = [];

        let data = {
          name: this.envParams[index].value,
          data: [],
        };
        serie.data.forEach((envParamValue) => {
          data.data.push(envParamValue.value);
          this.xaxis.push(envParamValue.createdAt);
        });
        values.push(data);
        this.seriesChart.push(values);
      });

      // this.chartOptions.xaxis.title += this.series[0].envParam
      this.isLoading = false;
    },
    getChartOptions(param) {
      console.log(this.dateFrom);
      return {
        chart: {
          height: 350,
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#77B6EA", "#545454"],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: this.xaxis,
          // min: this.dateFrom.toDateString(),
          // max: this.dateTo.toDateString()
        },
        yaxis: {
          title: {
            text: param[0].name,
          },
          min: 5,
          max: 40,
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
      };
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped></style>
