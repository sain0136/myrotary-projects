import { ApiClient } from "@/api/ApiClient";
import { ProjectsApi } from "@/api/services/ProjectsApi";
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

    async function setActiveProjectById(id: number) {
      const projectsApi = new ProjectsApi(new ApiClient());
      const response = await projectsApi.getProject(id);
      setActiveProject(response);
    }

    return {
      activeProject,
      setActiveProject,
      resetActiveProject,
      setActiveProjectById,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
