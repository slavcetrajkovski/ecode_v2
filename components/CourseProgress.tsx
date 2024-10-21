import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

const colorByVariant = {
  default: "text-ecode_primary/90",
  success: "text-emerald-700",
};

const sizeByVariant: any = {
  default: "text-sm",
  success: "text-xs",
};

export const CourseProgress = ({
  value,
  variant,
  size,
}: CourseProgressProps) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={variant} />
      <p
        className={cn(
          "font-medium mt-2 text-sky-700",
          colorByVariant[variant || "success"],
          sizeByVariant[size || "success"]
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};
