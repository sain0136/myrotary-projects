<script lang="ts">
export default {
  name: "ClubProjectPdf",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import html2pdf from "html2pdf.js";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import RotaryButton from "@/components/buttons/RotaryButton.vue";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const clubProject = reactive(useActiveProjectStore().activeProject);
const chosenAreaOfFocus = ref<string[]>([]);
Object.entries(clubProject.area_focus).forEach((key) => {
  if (key[1] === true) {
    chosenAreaOfFocus.value.push(key[0]);
  }
});
/* Hooks */
onMounted(async () => {});

/* Methods */
const downloadPdf = async () => {
  const element = document.getElementById("element-to-print");
  const opt = {
    margin: 1,
    format: "letter",
    scale: 1.8,
    filename: `ClubProject-${clubProject.project_name}-${clubProject.project_code}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: { mode: "avoid-all" },
  };
  html2pdf().set(opt).from(element).save();
};
</script>

<template>
  <div>
    <div class="flex justify-center mt-8">
      <RotaryButton
        :theme="'primary'"
        :label="langTranslations.projectFormLabels.exportToPdfLabel"
        @click="downloadPdf()"
      />
    </div>
    <div class="pdf flex flex-col gap-4 p-8" id="element-to-print">
      <div class="print_format">
        <h1>Project Code:</h1>
        <p>{{ clubProject.project_code }}</p>
      </div>
      <div class="print_format">
        <h1>Project Name:</h1>
        <p>{{ clubProject.project_name }}</p>
      </div>
      <div class="print_format">
        <h1>Project Description:</h1>
        <p class="mb-4 text-sm">{{ clubProject.project_description }}</p>
      </div>
      <div class="print_format">
        <h1>Project Country:</h1>
        <p>{{ clubProject.country }}</p>
      </div>
      <div class="print_format">
        <h1>Project Region:</h1>
        <p>{{ clubProject.region }}</p>
      </div>
      <div class="print_format">
        <h1>Start Date:</h1>
        <p>{{ clubProject.start_date }}</p>
      </div>
      <div class="print_format">
        <h1>Estimated Completion Date:</h1>
        <p>{{ clubProject.completion_date }}</p>
      </div>
      <div class="print_format">
        <h1>Funding Goal :</h1>
        <p>{{ clubProject.funding_goal }}</p>
      </div>
      <div class="print_format">
        <h1>Anticipated Funding :</h1>
        <p>{{ clubProject.anticipated_funding }}</p>
      </div>
      <div class="print_format">
        <h1>Project Status:</h1>
        <p>{{ clubProject.project_status }}</p>
      </div>

      <div class="print_format">
        <h1>Areas Of Focus:</h1>
        <p class="flex gap-2" v-for="area in chosenAreaOfFocus" :key="area">
          * {{ area.replace(/_/g, " ") }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.print_format {
  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
</style>
