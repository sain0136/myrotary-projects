import type {
  IClubProject,
  ClubProjectExtraDescriptions,
} from "@/utils/interfaces/IProjects";
import GenericProject from "@/utils/classes/GenericProject";

export default class ClubProject
  extends GenericProject
  implements IClubProject
{
  extra_descriptions: ClubProjectExtraDescriptions = { extra: "" };

  constructor() {
    super();
  }
}
