export function slugify(value: string): string {
  const sinAcentos = value
    .normalize("NFD")
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code < 0x0300 || code > 0x036f;
    })
    .join("");
  return sinAcentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateId(base: string, existingIds: string[]): string {
  const slug = slugify(base) || "item";
  if (!existingIds.includes(slug)) return slug;
  let n = 2;
  while (existingIds.includes(`${slug}-${n}`)) n += 1;
  return `${slug}-${n}`;
}
