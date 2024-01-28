import { createSlice } from "@reduxjs/toolkit";

interface ProjectsState {
  allProjects: any;
  projectId: any;
}

const initialState: ProjectsState = {
  allProjects: [],
  projectId: "",
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.allProjects = action.payload;
    },
    addProjectId: (state, action) => {
      state.projectId = action.payload;
    },
  },
});

export const { setProjects, addProjectId } = projectSlice.actions;

export default projectSlice.reducer;
