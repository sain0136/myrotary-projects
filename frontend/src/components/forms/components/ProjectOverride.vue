<script lang="ts">
export default {
  name: "ProjectOverride",
};
</script>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import BaseSelect from "@/components/form/BaseSelect.vue";
import H4 from "@/components/headings/H4.vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import { ApiClient } from "@/api/ApiClient";
import { DistrictApi } from "@/api/services/DistrictsApi";
import type District from "@/utils/classes/District";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { ClubApi } from "@/api/services//ClubApi";
import type { IClub } from "@/utils/interfaces/IClub";
import type { CustomErrors } from "@/utils/classes/CustomErrors";
import type { ClubRole, DistrictRole } from "@/utils/types/commonTypes";

/* Props */
const { role, districtIdParentValue } = defineProps<{
  role: DistrictRole | ClubRole | "SuperAdmin" | "";
  districtIdParentValue: number;
}>();

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const districtApi = new DistrictApi(new ApiClient());
const clubApi = new ClubApi(new ApiClient());
const districtMap = reactive<Map<string, number>>(new Map());
const reverseDistrictMap = reactive<Map<number, string>>(new Map());
const clubMap = reactive<Map<string, number>>(new Map());
const choosenDistrict = ref("");
const choosenClub = ref("");
const emit = defineEmits(["updateDistrictId", "updateClubId"]);

/* Hooks */
onMounted(async () => {
  try {
    const response = (await districtApi.getAllDistricts(true)) as District[];
    response.forEach((district) => {
      districtMap.set(district.district_name, district.district_id);
      reverseDistrictMap.set(district.district_id, district.district_name);
    });
    if (role !== "SuperAdmin") {
      const reversedParentDistrict = reverseDistrictMap.get(
        districtIdParentValue
      );
      if (reversedParentDistrict) {
        choosenDistrict.value = reversedParentDistrict;
      }
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

watch(choosenDistrict, async () => {
  try {
    const id = districtMap.get(choosenDistrict.value) as number;
    emit("updateDistrictId", id);
    const allClubsInDistrict = await clubApi.clubsInDistrict(id, 1, 10000000);
    clubMap.clear();
    (allClubsInDistrict.data as IClub[]).forEach((club) => {
      clubMap.set(club.club_name, club.club_id as number);
    });
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

watch(choosenClub, () => {
  const id = clubMap.get(choosenClub.value);
  emit("updateClubId", id);
});

/* Methods */
</script>

<template>
  <div class="container flex flex-col justify-center items-center">
    <H4
      class="mb-2 text-center"
      :content="langTranslations.createProjectOnBehalfLabel"
    ></H4>
    <BaseSelect
      v-model="choosenDistrict"
      :options="[...districtMap.keys()]"
      :label="''"
      class="lg:w-1/2 w-full mb-2 text-center"
      :disabled="role === 'SuperAdmin' ? false : true"
    />
    <BaseSelect
      v-model="choosenClub"
      :options="[...clubMap.keys()]"
      :label="''"
      placeholder="Select an example property"
      class="lg:w-1/2 w-full"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.container {
  border: 1px solid $primary;
  padding: 2rem;
}
</style>
