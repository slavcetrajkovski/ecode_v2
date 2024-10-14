import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import React from "react";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  return (
    <Button size="sm" className="w-full md:w-auto">
      Зачлени се за {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
