export function translatePath(
  d: string,
  { dx, dy }: { dx: number; dy: number }
): string {
  const commandRegex = /([a-zA-Z][^a-zA-Z]*)/g;
  const commands = d.match(commandRegex);
  if (!commands) return "";

  let newPath = "";
  let isFirstCommand = true;

  for (const cmdGroup of commands) {
    const command = cmdGroup[0]!;
    const paramsString = cmdGroup.substring(1);

    const values = paramsString.match(/-?\d*\.?\d+/g) || [];
    const newValues = values.map(Number);

    const isRelativeCommand = command.toLowerCase() === command;
    const isAbsoluteCommand = !isRelativeCommand;

    let paramIndex = 0;
    const transformedValues: number[] = [];

    while (paramIndex < newValues.length) {
      const val = newValues[paramIndex]!;

      if (isAbsoluteCommand || (isFirstCommand && paramIndex < 2)) {
        if (command.toUpperCase() === "H") {
          transformedValues.push(val + dx);
        } else if (command.toUpperCase() === "V") {
          transformedValues.push(val + dy);
        } else if (
          command.toUpperCase() === "A" &&
          (paramIndex === 5 || paramIndex === 6)
        ) {
          transformedValues.push(val + (paramIndex === 5 ? dx : dy));
        } else if (paramIndex % 2 === 0) {
          transformedValues.push(val + dx);
        } else {
          transformedValues.push(val + dy);
        }
      } else {
        transformedValues.push(val);
      }
      paramIndex++;
    }

    newPath += `${command} ${transformedValues.join(" ")} `;
    isFirstCommand = false;
  }

  return newPath.trim().replace(/\s+/g, " ");
}
