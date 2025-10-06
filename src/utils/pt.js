import { classNames } from "primereact/utils";

export const pt = {
  paginator:{
    // root:"bg-red-400",
    firstPageButton:"text-(--primary-color)",
    lastPageButton:"text-(--primary-color)",
    nextPageButton:"text-(--primary-color)",
    prevPageButton:"text-(--primary-color)",
    // current:"text-red-400",
    pageButton:"focus:text-(--primary-color)",
    // RPPDropdown:"bg-red-400 focus:bg-green-500 border-5 border-red-400",
    // JTPInput:"bg-red-400 border-red-400 border-5"
  },
  checkbox: {
    box: ({ context }) => ({
      className: classNames(
        "flex items-center justify-center border-2 rounded-sm transition-colors duration-200",
        {
          "bg-(--header-bg) border-(--primary-color)": !context.checked,

          "bg-(--primary-color-light) duration-700 hover:bg-(--primary-color) border-(--primary-color)":
            context.checked,
        }
      ),
    }),
    icon: "w-4 h-4 text-white transition-all duration-200",
  },
};
