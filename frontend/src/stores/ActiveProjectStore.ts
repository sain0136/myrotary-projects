import type {
  IClubProject,
  IDmProject,
  IDsgProject,
  IGenericProject,
} from "@/utils/interfaces/IProjects";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useActiveProjectStore = defineStore(
  "activeProject",
  () => {
    const activeProject:
      | IClubProject
      | IDmProject
      | IDsgProject
      | IGenericProject = reactive(
      {} as IClubProject | IDmProject | IDsgProject | IGenericProject
    );

    function setActiveProject(
      project: IClubProject | IDmProject | IDsgProject | IGenericProject
    ) {
      Object.assign(activeProject, project);
    }

    function resetActiveProject() {
      for (const key in activeProject) {
        if (Object.hasOwnProperty.call(activeProject, key)) {
          delete (activeProject as unknown as Record<string, unknown>)[key];
        }
      }
    }

    return {
      activeProject,
      setActiveProject,
      resetActiveProject,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
