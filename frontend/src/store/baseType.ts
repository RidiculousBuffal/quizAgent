import {immer} from 'zustand/middleware/immer'
import {persist} from "zustand/middleware/persist";
// reference https://github.com/tauri-apps/tauri/discussions/6677
export type  MiddlewareTypes = [
    ['zustand/persist', unknown],
    ['zustand/immer', unknown]
]