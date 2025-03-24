/// <reference types="vite/client" />
declare module "*.json" {
    const value: { words: string[] };
    export default value;
  }