import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { publicProjects, projectsForNeed, capabilitiesForProjects } from "./work-projects";

describe("job-first evidence browsing", () => {
  test("a job includes multiple represented capabilities rather than one department", () => {
    const projects = projectsForNeed(publicProjects, "understanding");
    assert.ok(projects.some(project => project.slug === "dr-kehinde-nwani"));
    assert.ok(projects.some(project => project.slug === "memorial-publications"));
    assert.ok(capabilitiesForProjects(projects).includes("Websites & Digital Solutions"));
    assert.ok(capabilitiesForProjects(projects).includes("Communication & Content"));
  });
  test("secondary choices come only from projects in the selected job", () => {
    assert.ok(!capabilitiesForProjects(projectsForNeed(publicProjects, "digital")).includes("Marketing & Growth"));
  });
  test("unverified entries stay out of every public job result", () => {
    assert.ok(!projectsForNeed(publicProjects, "physical").some(project => project.slug === "tsp-christ-amplified"));
  });
});