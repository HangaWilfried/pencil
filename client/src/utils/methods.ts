import type { TagDTO, DropdownOption } from "@/utils/types.ts";

export function toTagOption(tag: TagDTO): DropdownOption<TagDTO> {
  return {
    getText() {
      return tag.name ?? "";
    },
    getValue() {
      return tag;
    },
  };
}
