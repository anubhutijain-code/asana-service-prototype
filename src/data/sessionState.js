// Module-level session state — persists across navigation within the same page load.
// Import and mutate directly; components should read on mount and update on action.

export const session = {
  launchedProjects: new Set(), // ticket ids that have had a project launched
};
