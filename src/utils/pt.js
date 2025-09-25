import { classNames } from "primereact/utils";

export const pt = {
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
