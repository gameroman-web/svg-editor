export function scalePath(d: string, { scale }: { scale: number }): string {
  const formatNumber = (num: number): string =>
    parseFloat(num.toPrecision(12)).toString();

  const commandRegex = /([a-zA-Z][^a-zA-Z]*)/g;
  const commands = d.match(commandRegex);
  if (!commands) return "";

  let newPath = "";

  for (const cmdGroup of commands) {
    const command = cmdGroup.slice(0, 1);
    const values = cmdGroup.slice(1).match(/-?\d*\.?\d+/g) || [];

    const scaledValues: string[] = [];

    for (let paramIndex = 0; paramIndex < values.length; paramIndex++) {
      const val = Number(values[paramIndex]);
      let scaledVal: string;

      if (command.toUpperCase() === "A") {
        if (
          paramIndex === 0 ||
          paramIndex === 1 ||
          paramIndex === 5 ||
          paramIndex === 6
        ) {
          scaledVal = formatNumber(val * scale);
        } else {
          scaledVal = val.toString();
        }
      } else {
        scaledVal = formatNumber(val * scale);
      }

      scaledValues.push(scaledVal);
    }

    newPath += `${command} ${scaledValues.join(" ")} `;
  }

  return newPath.trim().replace(/\s+/g, " ");
}
