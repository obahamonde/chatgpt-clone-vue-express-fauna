import { defineStore, acceptHMRUpdate } from "pinia";

export const useStore = defineStore("state", () => {
  const state = reactive({
    messages: [] as any[],
  });
  const setState = (newState: any) => {
    Object.assign(state, newState);
  };
  return {
    state,
    setState,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
