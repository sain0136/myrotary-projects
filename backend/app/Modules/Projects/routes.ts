import Route from "@ioc:Adonis/Core/Route";

Route.resource("/projects/", "ProjectsController");
Route.get("projects/getRotaryYears", "ProjectsController.getRotaryYears");
Route.post("projects/getAllProjects", "ProjectsController.getAllProjects");
