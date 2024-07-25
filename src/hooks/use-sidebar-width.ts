import { create } from "zustand";

type props = {
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
}


const useSidebarWidth = create<props>(set => ({
    sidebarWidth: 30,
    setSidebarWidth: (width) => set({ sidebarWidth: width })
}));


export default useSidebarWidth;