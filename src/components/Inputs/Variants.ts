import { twMerge } from "tailwind-merge";

// const base = "";

const inputBase = "bg-white/10 p-3 block mt-1 rounded-xl font-normal border-2 border-white/20 w-full outline-none";

const buttonBase =
    "flex justify-center items-center hover:bg-white/20 disabled:hover:bg-white/10 active:bg-white/40 hover:border-white/40 active:border-white/80 disabled:hover:border-white/20 disabled:opacity-50 font-bold";

export const INPUT_VARIANTS = {
    base: inputBase,
    js: twMerge(inputBase, "bg-yellow-500/20 border-yellow-500/20 focus:border-yellow-500/40"),
    php: twMerge(inputBase, "bg-indigo-500/20 border-indigo-500/20 focus:border-indigo-500/40")
};

export const BUTTON_VARIANTS = {
    base: twMerge(inputBase, buttonBase),
    js: twMerge(
        INPUT_VARIANTS.js,
        buttonBase,
        "hover:bg-yellow-500/30 hover:border-yellow-500/40 active:bg-yellow-500/40 active:border-yellow-500/60"
    ),
    php: twMerge(
        INPUT_VARIANTS.php,
        buttonBase,
        "hover:bg-indigo-500/30 hover:border-indigo-500/40 active:bg-indigo-500/40 active:border-indigo-500/60"
    )
};
