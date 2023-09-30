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
  collapsable?: boolean;
  colName: string;
};

type ButtonOptions = {
  show: boolean;
  callBack: () => void;
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
          <td
            v-for="column in columns"
            class="px-6 py-4"
            :class="{
              'hidden md:block': column.collapsable,
            }"
          >
            {{ row[column.colName] }}
          </td>
          <td class="px-6 py-4 :lg: w-1/12">
            <div class="flex justify-between">
              <a
                @click="editButton?.callBack()"
                v-if="editButton?.show"
                :title="langTranslations.editLabel"
                href="#"
                class="font-bold text-lg lg:text-xl text-primary hover:text-primaryHover hover:underline"
                ><Icon icon="tabler:edit"
              /></a>
              <a
                @click="deleteButton?.callBack()"
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
