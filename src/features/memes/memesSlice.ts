import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import type { UIMeme } from "@/types/meme";
import type { RootState } from "@/store";

type FetchStatus = "idle" | "loading" | "succeeded" | "failed";

type MemesState = {
  items: UIMeme[];
  status: FetchStatus;
  error?: string;
};

const initialState: MemesState = {
  items: [],
  status: "idle",
};

export const fetchAllMemes = createAsyncThunk<UIMeme[]>(
  "memes/fetchAll",
  async () => {
    const res = await fetch("/api/memes");
    if (!res.ok) {
      const message = await res.text();
      throw new Error(message || "Failed to fetch memes");
    }
    return res.json();
  }
);

const memesSlice = createSlice({
  name: "memes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMemes.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchAllMemes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllMemes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default memesSlice.reducer;

export const selectAllMemes = (state: RootState) => state.memes.items;
export const selectMemesStatus = (state: RootState) => state.memes.status;
export const selectMemesError = (state: RootState) => state.memes.error;

export const selectTrendingMemes = createSelector(selectAllMemes, (items) =>
  [...items]
    .sort((a, b) => {
      const reactionScore = (x: UIMeme) =>
        Object.values(x.reactions ?? {}).reduce((acc, val) => acc + (val ?? 0), 0);
      const scoreA = reactionScore(a) + (a.views ?? 0);
      const scoreB = reactionScore(b) + (b.views ?? 0);
      return scoreB - scoreA;
    })
    .slice(0, 8)
);

export const selectMemesGroupedByCategory = createSelector(
  selectAllMemes,
  (items) =>
    items.reduce<Record<string, UIMeme[]>>((acc, meme) => {
      if (!meme.category) return acc;
      if (!acc[meme.category]) acc[meme.category] = [];
      acc[meme.category].push(meme);
      return acc;
    }, {})
);

