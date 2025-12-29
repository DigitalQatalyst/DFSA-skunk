import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-700 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-md",
          description: "group-[.toast]:text-gray-700",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:hover:bg-blue-700",
          cancelButton:
            "group-[.toast]:bg-white group-[.toast]:border group-[.toast]:border-gray-300 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-50",
          success:
            "group-[.toast]:bg-green-50 group-[.toast]:text-green-700 group-[.toast]:border-l-4 group-[.toast]:border-green-600",
          error:
            "group-[.toast]:bg-red-50 group-[.toast]:text-red-700 group-[.toast]:border-l-4 group-[.toast]:border-red-600",
          warning:
            "group-[.toast]:bg-yellow-50 group-[.toast]:text-yellow-900 group-[.toast]:border-l-4 group-[.toast]:border-yellow-500",
          info: "group-[.toast]:bg-blue-50 group-[.toast]:text-blue-700 group-[.toast]:border-l-4 group-[.toast]:border-blue-600",
        },
        duration: 3000,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
