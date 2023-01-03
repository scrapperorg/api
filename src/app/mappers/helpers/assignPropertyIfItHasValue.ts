export function assignPropertyIfItHasValue<O extends Record<string, unknown>, E>(
  object: O,
  parent: E,
  property: keyof E,
) {
  if (parent[property] === null) return;
  Object.assign(object, { [property]: parent[property] });
}
