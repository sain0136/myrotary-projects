div
<script lang="ts">
export default {
  name: "Stats",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import H3 from "@/components/headings/H3.vue";
import H2 from "@/components/headings/H2.vue";
import Banners from "@/components/banners/Banners.vue";
import BaseSelect from "@/components/form/BaseSelect.vue";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { ApiClient } from "@/api/ApiClient";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { DistrictApi } from "@/api/services/DistrictsApi";
import type { PaginationResult } from "@/utils/types/commonTypes";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import type {
  IClubProject,
  IDmProject,
  IDsgProject,
  IGenericProject,
} from "@/utils/interfaces/IProjects";
import Dinero from "dinero.js";
import { useCurrencyFormatter } from "@/utils/composables/CurrencyFormatter";
import { PieChart, BarChart, DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

/* Data */
Chart.register(...registerables);
Chart.defaults.plugins.legend.display = false;
const { currencyFormatterFunding, convertCentsToFloat, convertFloatToCents } =
  useCurrencyFormatter();
const projectsApi = new ProjectsApi(new ApiClient());
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const rotaryYearsList = ref(["Any Year"] as string[]);
const year = ref("Any Year");
const longYearToYear = reactive(new Map<string, string>());
const districtApi = new DistrictApi(new ApiClient());
const districtNameList = ref([] as string[]);
const districtMapChosenDistrictToID = reactive(new Map<string, number>());
const districtId = ref(0);
const allProjects = ref<
  Array<IDistrict | IDsgProject | IGenericProject | IDmProject | IClubProject>
>([]);
const districtChosen = ref("");
let computed1 = [] as number[];
let computed2 = [] as number[];
const chartData = ref({
  labels: [
    langTranslations.value.projectFormLabels.clubProjectHeader,
    langTranslations.value.projectFormLabels.dsgProjectsHeader,
    langTranslations.value.projectFormLabels.dmProjectsHeader,
    "Global Project",
  ],
  datasets: [
    {
      label: "Data One",
      backgroundColor: ["#ffb607", "#00000", "#41B883", "#881a8f"],
      data: [0, 0, 0, 0],
    },
  ],
});
const chartData2 = ref({
  labels: [
    "Club Projects",
    "District Simplified Projects",
    "District Matching Projects",
    "Global Projects",
  ],
  datasets: [
    {
      backgroundColor: ["#ffb607", "#00000", "#41B883", "#881a8f"],
      data: [] as number[],
    },
  ],
});
const chartOptions2 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};
const chartOptions = {
  responsive: true,
};

/*Computed*/
const totalBuget = computed(() => {
  let fundingGoalSumAllProjects = Dinero({ amount: 0 });
  let currentFundingSumAllProjects = Dinero({ amount: 0 });
  let pledgeSumForAllProjects = Dinero({ amount: 0 });
  let grantypeArrayNumberTotal: number[] = [0, 0, 0, 0];
  let grantypeArrayNumberTotalByDistrict: number[] = [0, 0, 0, 0];
  let allProjectsCalculation = 0;
  let currentChartData1: number[] = [0, 0, 0, 0];
  if (year.value !== "Any Year") {
    allProjectsCalculation = 0;
  }
  allProjects.value.forEach((project) => {
    let yearFilter = "";
    if (year.value !== "Any Year") {
      yearFilter = longYearToYear.get(year.value) as string;
    }
    const projectStretech = project as IClubProject | IDmProject | IDsgProject;
    if (
      yearFilter === projectStretech.rotary_year &&
      year.value !== "Any Year"
    ) {
      allProjectsCalculation += 1;
      fundingGoalSumAllProjects = fundingGoalSumAllProjects.add(
        Dinero({ amount: projectStretech.funding_goal })
      );
      currentFundingSumAllProjects = currentFundingSumAllProjects.add(
        Dinero({ amount: projectStretech.anticipated_funding })
      );
      pledgeSumForAllProjects = pledgeSumForAllProjects.add(
        Dinero({ amount: projectStretech.total_pledges })
      );
    } else if (year.value === "Any Year") {
      allProjectsCalculation += 1;
      fundingGoalSumAllProjects = fundingGoalSumAllProjects.add(
        Dinero({ amount: projectStretech.funding_goal })
      );
      currentFundingSumAllProjects = currentFundingSumAllProjects.add(
        Dinero({ amount: projectStretech.anticipated_funding })
      );
      pledgeSumForAllProjects = pledgeSumForAllProjects.add(
        Dinero({ amount: projectStretech.total_pledges })
      );
    }
    switch (projectStretech.grant_type) {
      case "Club Project":
        if (
          districtId.value > 0 &&
          projectStretech.district_id === districtId.value
        ) {
          grantypeArrayNumberTotalByDistrict[0] += 1;
        }
        if (yearFilter === projectStretech.rotary_year) {
          currentChartData1[0] += 1;
          //   grantypeArrayNumberTotal[0] += 1;
        } else if (!yearFilter) {
          currentChartData1[0] += 1;
          //   grantypeArrayNumberTotal[0] += 1;
        }

        break;
      case "District Simplified Project":
        if (
          districtId.value > 0 &&
          projectStretech.district_id === districtId.value
        ) {
          grantypeArrayNumberTotalByDistrict[1] += 1;
        }
        if (yearFilter === projectStretech.rotary_year) {
          currentChartData1[1] += 1;

          //   grantypeArrayNumberTotal[1] += 1;
        } else if (!yearFilter) {
          currentChartData1[1] += 1;

          //   grantypeArrayNumberTotal[1] += 1;
        }
        break;
      case "District Matching Project":
        if (
          districtId.value > 0 &&
          projectStretech.district_id === districtId.value
        ) {
          grantypeArrayNumberTotalByDistrict[2] += 1;
        }
        if (yearFilter === projectStretech.rotary_year) {
          currentChartData1[2] += 1;
        } else if (!yearFilter) {
          currentChartData1[2] += 1;
        }
        break;
      case "Global Project":
        if (
          districtId.value > 0 &&
          projectStretech.district_id === districtId.value
        ) {
          grantypeArrayNumberTotalByDistrict[3] += 1;
        }
        if (yearFilter === projectStretech.rotary_year) {
          currentChartData1[3] += 1;
        } else if (!yearFilter) {
          currentChartData1[3] += 1;
        }
        break;
      default:
        break;
    }
  });
  chartData.value.datasets[0].data = currentChartData1;
  chartData2.value.datasets[0].data = grantypeArrayNumberTotalByDistrict;
  return {
    totalCurrentFunds: currencyFormatterFunding(
      currentFundingSumAllProjects.getAmount()
    ),
    totalBudget: currencyFormatterFunding(
      fundingGoalSumAllProjects.getAmount()
    ),
    totalProjects: allProjectsCalculation,
    pledgeAmount: currencyFormatterFunding(pledgeSumForAllProjects.getAmount()),
    grantypeArrayNumberTotal: grantypeArrayNumberTotal,
    grantypeArrayNumberTotalByDistrict: grantypeArrayNumberTotalByDistrict,
  };
});

/* Hooks */
watch(districtChosen, async () => {
  districtId.value = districtMapChosenDistrictToID.get(
    districtChosen.value as string
  ) as number;
  chartData2.value.datasets[0].data =
    totalBuget.value.grantypeArrayNumberTotalByDistrict;
});

watch(computed1, async () => {
  chartData.value.datasets[0].data = totalBuget.value.grantypeArrayNumberTotal;
});

watch(computed2, async () => {
  chartData2.value.datasets[0].data =
    totalBuget.value.grantypeArrayNumberTotalByDistrict;
});

onMounted(async () => {
  try {
    const response = await projectsApi.getRotaryYears();
    response.allRotaryYears.forEach((year) => {
      rotaryYearsList.value.push(year);
      longYearToYear.set(year, year.replace(/-\d{4}$/, ""));
    });
    year.value = response.currentRotaryYear;
    await getAllProjects();
    await getAllDistricts();
    computed1 = totalBuget.value.grantypeArrayNumberTotal;
    computed2 = totalBuget.value.grantypeArrayNumberTotal;
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

/* Methods */
const getAllProjects = async () => {
  try {
    const response = await projectsApi.getAllProjects(1, 10000000);
    allProjects.value = [
      ...(response.data as Array<IDsgProject | IDmProject | IClubProject>),
    ];
  } catch (error) {
    handleError(error as CustomErrors);
  }
};
const getAllDistricts = async () => {
  try {
    const response = await districtApi.getAllDistricts();
    if ((response as unknown as PaginationResult).data.length > 0) {
      (response as unknown as PaginationResult).data.forEach((district) => {
        districtNameList.value.push((district as IDistrict).district_name);
        districtMapChosenDistrictToID.set(
          (district as IDistrict).district_name,
          (district as IDistrict).district_id
        );
      });
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const showHide = () => {
  let total = 0;
  chartData.value.datasets[0].data.forEach((i) => {
    total += i;
  });
  if (total > 0) {
    return true;
  }
  return false;
};
</script>

<template>
  <Banners :banner-text="langTranslations.statsLabel" />
  <div class="mt-8">
    <H2 class="text-center mb-8" :content="langTranslations.statsHeaderLabel" />
  </div>
  <div class="flex flex-col items-center gap-4 py-8">
    <BaseSelect
      v-model="year"
      :label="langTranslations.selectLabelRotaryYear"
      :options="rotaryYearsList"
    />
  </div>
  <div class="flex flex-col items-center gap-4">
    <p class="mb-5 text-lg font-bold text-primary-black">
      {{ langTranslations.projectsLabel + ":" }}
      <span class="text-primary-dark-color font-bold">{{
        totalBuget.totalProjects
      }}</span>
    </p>
    <p class="mb-5 text-lg font-bold text-primary-black">
      {{ langTranslations.totalBudgetAmount }}
      <span class="text-primary-dark-color font-bold">{{
        totalBuget.totalBudget
      }}</span>
    </p>
    <p class="mb-5 text-lg font-bold text-primary-black">
      {{ langTranslations.totalFundsRaised }}
      <span class="text-primary-dark-color font-bold">{{
        totalBuget.totalCurrentFunds
      }}</span>
    </p>
    <p class="mb-5 text-lg font-bold text-primary-black">
      {{ langTranslations.projectFormLabels.pledgesLabel }}
      <span class="text-primary-dark-color font-bold">{{
        totalBuget.pledgeAmount
      }}</span>
    </p>
  </div>
  <div
    class="chart_container items-center justify-center flex flex-col gap-4 my-8"
  >
    <h1 class="mb-4 text-5xl font-bold text-center">
      {{ langTranslations.alltimesLabel }}
    </h1>
    <div class="pie" v-if="showHide()">
      <PieChart
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="'pie-chart'"
        :dataset-id-key="'label'"
        :css-classes="''"
        :styles="{}"
        :width="500"
        :height="500"
      />
    </div>
    <div v-else>
      <img class="w-60" :src="'/no_data.png'" alt="" />
    </div>
    <div
      class="chart_container flex flex-col gap-4 my-8 justify-center items-center"
    >
      <H3 :content="langTranslations.statsByDistrict" />
      <BaseSelect
        v-model="districtChosen"
        :options="districtNameList"
        :label="langTranslations.selectDistrictLabel"
      />
      <div class="bar">
        <BarChart
          class="bar"
          :chart-options="chartOptions2"
          :chart-data="chartData2"
          :chart-id="'bar-chart'"
          :css-classes="''"
          :styles="{}"
          :width="500"
          :height="500"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
