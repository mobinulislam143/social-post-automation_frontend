import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  activeOrgId: string | null;
  activeOrgSlug: string | null;
}

const initialState: SessionState = {
  activeOrgId: null,
  activeOrgSlug: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setActiveOrg: (
      state,
      action: PayloadAction<{ id: string; slug: string }>
    ) => {
      state.activeOrgId = action.payload.id;
      state.activeOrgSlug = action.payload.slug;
    },
    clearActiveOrg: (state) => {
      state.activeOrgId = null;
      state.activeOrgSlug = null;
    },
  },
});

export const { setActiveOrg, clearActiveOrg } = sessionSlice.actions;
export default sessionSlice.reducer;
