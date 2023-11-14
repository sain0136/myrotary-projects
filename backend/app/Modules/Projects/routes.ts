import Route from "@ioc:Adonis/Core/Route";

Route.resource("/projects/", "ProjectsController");
Route.get("projects/getRotaryYears", "ProjectsController.getRotaryYears");
Route.post("projects/getAllProjects", "ProjectsController.getAllProjects");
Route.post("projects/filter", "ProjectsController.filter");
Route.post(
  "projects/fetchConditionalProjects",
  "ProjectsController.fetchConditionalProjects"
);
Route.post(
  "projects/createClubProject",
  "ProjectsController.createClubProject"
);
Route.post(
  "projects/updateClubProject",
  "ProjectsController.updateClubProject"
);

Route.post("projects/deleteProject", "ProjectsController.deleteProject");
Route.post("projects/addProjectAdmins", "ProjectsController.addProjectAdmins");
Route.post(
  "projects/updateProjectStatus",
  "ProjectsController.updateProjectStatus"
);
Route.post(
  "projects/createSimplifiedProject",
  "ProjectsController.createSimplifiedProject"
);
Route.post(
  "projects/updateSimplifiedProject",
  "ProjectsController.updateSimplifiedProject"
);

Route.post(
  "projects/createMatchingProject",
  "ProjectsController.createMatchingProject"
);
Route.post(
  "projects/updateMatchingProject",
  "ProjectsController.updateMatchingProject"
);
