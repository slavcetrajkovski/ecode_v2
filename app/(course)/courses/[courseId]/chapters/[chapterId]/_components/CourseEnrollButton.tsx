"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
  isPending: boolean;
}

const CourseEnrollButton = ({
  courseId,
  price,
  isPending,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.post(`/api/courses/${courseId}/enroll`);

      toast.success("Успешна пријава, проверете го вашиот е-меил.");
      router.refresh();
    } catch {
      toast.error("Веќе сте пријавени за овој курс, ја чекаме вашата уплата.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading || isPending}
      size="sm"
      className="w-full md:w-auto"
    >
      {isPending && <Clock className="h-4 w-4 mr-2" />}
      {isPending ? "Во очекување..." : `Зачлени се за ${formatPrice(price)}`}
      {/* TODO: Check button text */}
    </Button>
  );
};

export default CourseEnrollButton;
