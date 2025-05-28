export function nameAssemble(first: string, middle: string, last: string): string {
  // assembles a whole name for display
  let build = '';
  if (first) build += first + ' ';
  if (middle) build += middle[0].toUpperCase() + ' ';
  if (last) build += last;
  return build;
}
