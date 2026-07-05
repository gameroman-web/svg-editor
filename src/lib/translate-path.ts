export function translatePath(
  d: string,
  { dx, dy }: { dx: number; dy: number },
): string {
  const commandRegex = /([a-zA-Z][^a-zA-Z]*)/g;
  const commands = d.match(commandRegex);
  if (!commands) return "";

  let newPath = "";
  let isFirstCommand = true;

  for (const cmdGroup of commands) {
    const command = cmdGroup.slice(0, 1);
    const values = cmdGroup.slice(1).match(/-?\d*\.?\d+/g) || [];

    const isAbsoluteCommand = command.toLowerCase() !== command;

    const transformedValues: number[] = [];

    for (let paramIndex = 0; paramIndex < values.length; paramIndex++) {
      const val = Number(values[paramIndex]);

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
    }

    newPath += `${command} ${transformedValues.join(" ")} `;
    isFirstCommand = false;
  }

  return newPath.trim().replace(/\s+/g, " ");
}
