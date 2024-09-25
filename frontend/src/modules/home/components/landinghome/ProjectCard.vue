<script lang="ts">
export default {
  name: "ProjectCard",
};
</script>
<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, onUnmounted, ref } from "vue";
import type {
  IDsgProject,
  IDmProject,
  IClubProject,
} from "@/utils/interfaces/IProjects";
import { useCurrencyFormatter } from "@/utils/composables/CurrencyFormatter";
import router from "@/router";
import type { ProjectStatus, uploadedFile } from "@/utils/types/commonTypes";
import ResourceList from "@/utils/classes/ResourceList";

/* Data */
const show = ref(false);
const { langTranslations, languagePref, translateProjectStatus } =
  useLanguage();
const percentage = ref(0);
const { project } = defineProps<{
  project: IDsgProject | IDmProject | IClubProject;
}>();
const imageLink = ref<string | undefined>("");
const truncatedTitle = ref("");
const truncatedDesc = ref("");
const { currencyFormatterFunding } = useCurrencyFormatter();
const imageLoaded = ref(false);

/* Hooks */
onMounted(async () => {
  show.value = true;
  imageLink.value =
    (project.file_uploads?.project_image as uploadedFile)?.s3UrlLink ||
    (project.file_uploads?.project_image as uploadedFile)?.s3BaseUrlLink ||
    (await loadDefaultImage());
  let truncated = escapeHTML(project.project_description.slice(0, 150));
  if (!truncated.endsWith(".")) {
    truncated = truncated + "...";
  }
  percentage.value =
    project.funding_goal !== 0
      ? Math.trunc((project.anticipated_funding / project.funding_goal) * 100)
      : 0;

  truncatedDesc.value = truncated;
  truncatedTitle.value =
    project.project_name.length > 30
      ? project.project_name.slice(0, 30) + "..."
      : project.project_name;
});

onUnmounted(() => {
  show.value = false;
});

/* Methods */
const handleCardClick = () => {
  router.push({
    name: "ProjectDetails",
    params: {
      name: project.project_name.replace(/\s/g, "-"),
    },
    query: {
      id: project.project_id,
    },
  });
};

const onImageLoad = () => {
  imageLoaded.value = true;
};

const loadDefaultImage = async () => {
  try {
    const areaFocusmap = ResourceList.focusAreaDetailsMap();
    let firstAreaOfFocusFound = "";
    for (const areaFocusKey of Object.keys(project.area_focus)) {
      if (
        project.area_focus[areaFocusKey as keyof typeof project.area_focus] ===
        true
      ) {
        firstAreaOfFocusFound = areaFocusKey;
        break;
      }
    }
    const defaultImageLink = `/area-focus-defualt/${
      areaFocusmap.get(firstAreaOfFocusFound)?.imgLink
    }`;
    return defaultImageLink;
  } catch (error) {
    console.log(error);
    return "/area-focus-defualt/Peace_Conflict_Prevention";
  }
};

const escapeHTML = (unsafe: string) => {
  const trimmedDesc = unsafe.trim(); // Remove leading and trailing white spaces
  const condensedDesc = trimmedDesc.replace(/\s\s+/g, " "); // Remove consecutive white spaces
  // write a string find or function below if the string contains any of the following characters patterns: ))) or (((
  if (
    unsafe.includes(")))") ||
    unsafe.includes("(((") ||
    !unsafe.includes(" ")
  ) {
    const unsafe = {
      en: "This description is unsafe and has been replaced with this message. Please contact the webmaster if you believe this is an error.",
      fr: "Ce description est dangereuse et a ete remplacer par cette message. Merci de contacter le webmaster si vous pensez qu'il s'agit d'une erreur.",
    };
    return unsafe[languagePref.value];
  }
  return condensedDesc;
};
</script>

<template>
  <Transition>
    <div
      @click="handleCardClick"
      v-if="show"
      class="max-w-md bg-white border border-gray-200 rounded-lg shadow flex flex-col cursor-pointer"
    >
      <a
        class="upper-card border-b-gray-900"
        :class="{
          hidden: !imageLoaded,
        }"
        @click.prevent
        href="#"
      >
        <router-link
          :to="{
            name: 'ProjectDetails',
            params: {
              name: project.project_name.replace(/\s/g, '-'),
            },
            query: {
              id: project.project_id,
            },
          }"
        >
          <img
            @load="onImageLoad"
            :class="{
              hidden: !imageLoaded,
              'aspect-ratio w-full cursor-pointer object-cover': imageLoaded,
            }"
            class="rounded-t-lg"
            :src="imageLink || undefined"
            alt="project image"
        /></router-link>
      </a>
      <div
        v-if="!imageLoaded"
        role="status"
        class="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
      >
        <div
          class="flex items-center justify-center w-full bg-gray-300 rounded"
          :class="'aspect-ratio w-screencursor-pointer object-cover'"
        >
          <svg
            class="w-10 h-10 text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path
              d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div class="lower-card p-5 flex flex-col">
        <router-link
          :to="{
            name: 'ProjectDetails',
            params: {
              name: project.project_name.replace(/\s/g, '-'),
            },
            query: {
              id: project.project_id,
            },
          }"
        >
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {{ truncatedTitle }}
            </h5>
            <div class="status mt-4 flex gap-1">
              <h3 class="text-base font-bold text-secondary">
                {{ `${langTranslations.statusLabel}:` }}
              </h3>
              <h3 class="text-base font-bold text-primary-black">
                {{
                  translateProjectStatus(
                    project.project_status as ProjectStatus,
                    languagePref
                  )
                }}
              </h3>
            </div>
          </a></router-link
        >
        <div class="status_bar pt-4">
          <div
            class="donate_bar wow fadeIn animated"
            data-wow-delay="0ms"
            data-wow-duration="0ms"
          >
            <div class="bar_inner">
              <div
                class="bar"
                :style="{
                  width: percentage + '%',
                }"
              >
                <div class="count_box counted">
                  <span class="count-text" data-speed="2000" data-stop="82">{{
                    percentage
                  }}</span
                  >%
                </div>
              </div>
            </div>
          </div>
          <div class="causes-info flex flex-col">
            <span class="flex justify-between gap-4">
              <strong class=" "
                >{{ langTranslations.projectLabels.raisedLabel }}:</strong
              >
              {{ currencyFormatterFunding(project.anticipated_funding) }}</span
            >
            <span class="flex justify-between gap-4 text-primary-color"
              ><strong class=""
                >{{ langTranslations.projectLabels.goalLabel }}:</strong
              >{{ currencyFormatterFunding(project.funding_goal) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.v-enter-active {
  transition: all 2.3s ease-out;
}

.v-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.v-enter-from,
.v-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.upper-card {
  flex: 1;
  flex-shrink: 1;
}

.lower-card {
  flex: 1;
  flex-grow: 2;
  justify-content: space-between;
}

.aspect-ratio {
  aspect-ratio: 1/0.7;
  image-rendering: smooth;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.status_bar {
  .causes-info {
    color: #b1b1b1;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .causes-info strong {
    color: #000000;
    font-weight: 700;
  }

  .causes-info span {
    font-weight: 700;
  }

  .theme_color {
    color: #ffb607;
  }

  .donate_bar {
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
    visibility: visible;
    animation-duration: 0ms;
    animation-delay: 0ms;
    animation-name: fadeIn;
  }

  .bar_inner {
    position: relative;
    width: 100%;
    height: 10px;
    background: #f1f1f1;
  }

  .bar {
    left: -1px;
    position: absolute;
    // left: -100%;
    top: -1px;
    height: 11px;
    background: #ffb607;
    -webkit-transition: all 2000ms ease;
    -ms-transition: all 2000ms ease;
    -o-transition: all 2000ms ease;
    -moz-transition: all 2000ms ease;
    transition: all 2000ms ease;
  }

  .count_box {
    position: absolute;
    right: -1rem;
    top: -15px;
    width: 35px;
    height: 35px;
    color: #000000;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #ffb607;
    font-family: "Lato", sans-serif;
  }
}
</style>
