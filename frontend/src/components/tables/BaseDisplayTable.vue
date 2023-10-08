<script lang="ts">
export default {
  name: "BaseDisplayTable",
};

</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref, watch, provide } from "vue";
import { Icon } from "@iconify/vue";
import type Button from "primevue/button";


/* Types */
type ColumnOptions = {
  name: string;
  collapsable?: boolean;
  colName: string;
};

type ButtonOptions = {
  show: boolean;
  callBack: (row?: unknown) => void;
};

/* Data */
const { langTranslations } = useLanguage();
const { tableData, columns, editButton, deleteButton } = defineProps<{
  tableData: any[];
  columns: ColumnOptions[];
  editButton?: ButtonOptions;
  deleteButton?: ButtonOptions;
  showCheckboxes: Boolean;
}>();

const checkedItems = ref<any[]>([]);

const selectAll = ref(false);

watch(selectAll, (newVal) => {
  if (newVal) {
    checkedItems.value = [...tableData];
  } else {
    checkedItems.value = [];
  }
});

/* Hooks */
onMounted(async () => {});

/* Methods */
const onButtonClick = () => {
  const districtId = checkedItems.value.map(item => item.district_id)
  console.log(districtId)
}

</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <button  @click="onButtonClick">Delete</button>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr class="row border-b bg-nearBlack border-gray-700">
          <th scope="col" class="p-4">
                    <div class="flex items-center">
                        <input id="checkbox-all-search"
                         v-model="selectAll"
                         type="checkbox" 
                         class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                        <label for="checkbox-all-search" class="sr-only">checkbox</label>
                    </div>
                </th>
          <th
            v-for="column in columns"
            :key="column.name"
            scope="col"
            class="px-6 py-3"
            :class="{
              'hidden md:block': column.collapsable,
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
        <td v-if="showCheckboxes" class="w-4 p-4">
                    <div class="flex items-center">
                        <input id="checkbox-table-search-1"
                        v-model="checkedItems" 
                        :value="row" 
                        type="checkbox" 
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        
                        >
                        <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                    </div>
        </td>
          <td
            v-for="(column, index) in columns"
            class="px-6 py-4"
            :class="{
              'hidden md:block': column.collapsable,
            }"
            :key="index"
          >
            {{ row[column.colName] }}
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
