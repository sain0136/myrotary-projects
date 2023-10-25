<script lang="ts">
export default {
  name: "BaseDisplayTable",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref, watch, provide, reactive } from "vue";
import { Icon } from "@iconify/vue";
import RotaryButton from "../buttons/RotaryButton.vue";

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

let checkedItems = reactive<unknown[]>([]);
const isAllSelected = ref(false);

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
  showCheckboxes,
  disablePagination,
  multiSelectDelete,
  hideActionsColumn,
} = defineProps<{
  currentPage: number;
  tableData: any[];
  columns: ColumnOptions[];
  handlePageChange: (nextOrPrevious: "next" | "previous") => void;
  lastPage: number;
  totalResults: number;
  limit: number;
  showCheckboxes: Boolean;
  editButton?: ButtonOptions;
  deleteButton?: ButtonOptions;
  disablePagination?: Boolean;
  hideActionsColumn?: boolean;
  // perhaps make expict union type  selectedItems typed ? like allow a select types that can be passed in
  multiSelectDelete?: (selectedItems: unknown[]) => void;
}>();
/* Hooks */
onMounted(async () => {});

watch(isAllSelected, () => {
  isAllSelected.value = checkedItems.length === tableData.length;
});

watch(
  checkedItems,
  () => {
    isAllSelected.value = checkedItems.length === tableData.length;
  },
  { deep: true }
);

/* Methods */
const handleCheckboxChange = (e: Event, row: unknown) => {
  if (e.target) {
    if ((e.target as HTMLInputElement).checked) {
      checkedItems.push(row);
    } else {
      checkedItems.splice(checkedItems.indexOf(row), 1);
    }
  }
};

const handleSelectAll = (e: Event) => {
  if (e.target) {
    const isChecked = (e.target as HTMLInputElement).checked;
    for (let row of tableData) {
      row.checked = isChecked;
    }
    if ((e.target as HTMLInputElement).checked) {
      checkedItems.push(...tableData);
    } else {
      checkedItems.splice(0, checkedItems.length);
    }
  }
};

const handlehandleDeleteMultiple = () => {
  if (multiSelectDelete) {
    multiSelectDelete(checkedItems);
    isAllSelected.value = false;
    checkedItems.splice(0, checkedItems.length);
  }
};
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div>
      <RotaryButton
        v-if="showCheckboxes"
        :disable="checkedItems.length < 1"
        :label="langTranslations.deleteLabel"
        @click="handlehandleDeleteMultiple"
        :theme="'primary'"
      />
    </div>
    <table class="w-full text-sm text-left text-nearWhite">
      <thead class="text-xs text-nearWhite uppercase bg-gray-500">
        <tr>
          <th v-if="showCheckboxes" scope="col" class="p-4">
            <div class="flex items-center">
              <input
                v-model="isAllSelected"
                id="checkbox-all-search"
                @change="handleSelectAll($event)"
                type="checkbox"
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded"
              />
              <label for="checkbox-all-search" class="sr-only">checkbox</label>
            </div>
          </th>
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
          <th v-if="!hideActionsColumn" scope="col" class="px-6 py-3">
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
          <td v-if="showCheckboxes" class="w-4 p-4">
            <div class="flex items-center">
              <input
                v-model="row.checked"
                :id="'checkbox-table-search-' + index"
                :value="row"
                type="checkbox"
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded"
                @change="handleCheckboxChange($event, row)"
              />
              <label :for="'checkbox-table-search-' + index" class="sr-only"
                >checkbox</label
              >
            </div>
          </td>
          <td
            v-for="(column, index) in columns"
            :key="index"
            class="px-6 py-4 whitespace-nowrap :lg:whitespace-normal"
            :class="{
              'hidden md:table-cell': column.collapsable,
              'hidden lg:table-cell': column.lgScreenCollapsable,
            }"
          >
            <span> {{ row[column.colName] }} </span>
          </td>
          <td
            v-if="hideActionsColumn != true"
            class="actions-col px-6 py-4 :lg: w-1/12"
          >
            <div class="flex justify-between">
              <a
                @click="editButton?.callBack({ ...row })"
                v-if="editButton?.show"
                :title="langTranslations.editLabel"
                href="#"
                class="font-bold text-lg lg:text-xl text-primary hover:text-primaryHover hover:underline"
                ><Icon icon="tabler:edit"
              /></a>
              <a
                @click="deleteButton?.callBack({ ...row })"
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
  <div v-if="disablePagination !== true" class="flex justify-between">
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
    <div class="pagination-row flex">
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
