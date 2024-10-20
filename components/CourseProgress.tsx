import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
  value: number;
  size?: "default" | "sm";
}

const sizeByVariant: any = {
  default: "text-sm",
  success: "text-xs",
};

export const CourseProgress = ({ value, size }: CourseProgressProps) => {
  return (
    <div>
      <Progress className="h-2" value={value} />
      <p
        className={cn(
          "font-medium mt-2 text-emerald-700",
          sizeByVariant[size || "default"]
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};
