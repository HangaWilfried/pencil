import type { TagDTO, DropdownOption } from "@/utils/types.ts";

export function toTagOption(tag: TagDTO): DropdownOption<string> {
  return {
    getText() {
      return tag.name ?? "";
    },
    getValue() {
      return tag.id ?? "";
    },
  };
}
