<script lang="ts">
export default {
  name: "BaseDisplayTable",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";

/* Types */
type ColumnOptions = {
  name: string;
  lgScreenCollapsable?: boolean;
  collapsable?: boolean;
  colName: string;
  columnWidth?: tailwindWidths;
};
type tailwindWidths = "w-2/12" | "w-1/12" | "w-1/6";
type ButtonOptions = {
  show: boolean;
  callBack: (row?: unknown) => void;
};

/* Data */
defineEmits(["update:limit"]);
const limitValuesList = [5, 10, 25, 50, 100];
const { langTranslations } = useLanguage();
const {
  currentPage,
  tableData,
  columns,
  editButton,
  deleteButton,
  handlePageChange,
  lastPage,
  totalResults,
  limit,
} = defineProps<{
  currentPage: number;
  tableData: any[];
  columns: ColumnOptions[];
  editButton?: ButtonOptions;
  deleteButton?: ButtonOptions;
  handlePageChange: (nextOrPrevious: "next" | "previous") => void;
  lastPage: number;
  totalResults: number;
  limit: number;
}>();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-nearWhite">
      <thead class="text-xs text-nearWhite uppercase bg-gray-500">
        <tr>
          <th
            v-for="column in columns"
            :key="column.name"
            scope="col"
            class="px-6 py-3"
            :class="{
              'hidden md:table-cell': column.collapsable,
              'hidden lg:table-cell': column.lgScreenCollapsable,
            }"
          >
            {{ column.name }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ langTranslations.actionsLabel }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in tableData"
          :key="index"
          class="row border-b bg-nearBlack border-gray-700"
        >
          <td
            v-for="column in columns"
            class="px-6 py-4 whitespace-nowrap :lg:whitespace-normal"
            :class="{
              'hidden md:table-cell': column.collapsable,
              'hidden lg:table-cell': column.lgScreenCollapsable,
            }"
          >
            <span> {{ row[column.colName] }} </span>
          </td>
          <td class="px-6 py-4 :lg: w-1/12">
            <div class="flex justify-between">
              <a
                @click="editButton?.callBack(row)"
                v-if="editButton?.show"
                :title="langTranslations.editLabel"
                href="#"
                class="font-bold text-lg lg:text-xl text-primary hover:text-primaryHover hover:underline"
                ><Icon icon="tabler:edit"
              /></a>
              <a
                @click="deleteButton?.callBack(row)"
                v-if="deleteButton?.show"
                :title="langTranslations.deleteLabel"
                href="#"
                class="font-bold text-lg lg:text-xl text-primary hover:text-primaryHover hover:underline"
                ><Icon icon="tabler:trash"
              /></a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="flex justify-between">
    <div class="flex gap-2">
      <select
        @input="
          $emit(
            'update:limit',
            Number(($event.target as HTMLInputElement).value)
          )
        "
        :value="limit"
        id="pageLimit"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
      >
        <option
          v-for="option in limitValuesList"
          :selected="option === limit"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <p class="whitespace-nowrap flex m-auto font-bold">
        {{ (totalResults ?? 0) + " " + langTranslations.resultLabel }}
      </p>
    </div>
    <div class="flex">
      <!-- Previous Button -->
      <a
        @click="handlePageChange('previous')"
        v-if="currentPage > 1"
        href="#"
        class="flex items-center justify-center px-3 h-8 mr-3 text-sm font-medium text-nearWhite bg-primary hover:bg-primaryHover focus:ring-primaryFocus rounded-lg"
      >
        <svg
          class="w-3.5 h-3.5 mr-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 5H1m0 0 4 4M1 5l4-4"
          />
        </svg>
        {{ langTranslations.prevButtonLabel }}
      </a>
      <a
        @click="handlePageChange('next')"
        v-if="currentPage !== lastPage"
        href="#"
        class="flex items-center justify-center px-3 h-8 text-sm font-medium text-nearWhite bg-primary hover:bg-primaryHover focus:ring-primaryFocus rounded-lg"
      >
        {{ langTranslations.nextButtonLabel }}
        <svg
          class="w-3.5 h-3.5 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

tr:nth-child(even) td {
  background-color: $primary-near-black; /* Background color for even rows */
}

tr:nth-child(odd) td {
  background-color: $neutral-dark; /* Background color for odd rows */
}
</style>
