// Common reusable methods

/**
 * Generates a breadcrumb list from the current URL path
 * @returns {Array} An array of objects with the shape { href: string, text: string }
 */
export function generateBreadcrumbs() {
  const asPathNestedRoutes = location.pathname
    .split("/")
    .filter((v) => v.length > 0);

  const crumblist = asPathNestedRoutes.map((subpath, idx) => {
    const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
    const title = subpath;
    const text = title.replace(/-/g, " ");
    return { href, text };
  });

  // Add in a default "Home" crumb for the top-level
  return [...crumblist];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
