<script lang="ts">
export default {
  name: "BaseDisplayTable",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
type tailwindWidths = "w-2/12";

/* Types */
type ColumnOptions = {
  name: string;
  lgScreenCollapsable?: boolean;
  collapsable?: boolean;
  colName: string;
  columnWidth?: tailwindWidths;
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
