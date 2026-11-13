import type { Metadata } from "next";
import { Revista } from "@/components/sections/Revista";

export const metadata: Metadata = {
  title: "Revista — Magenta",
};

export default function RevistaPage() {
  return <Revista />;
}
