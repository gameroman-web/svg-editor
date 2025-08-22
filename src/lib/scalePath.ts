export function scalePath(d: string, { scale }: { scale: number }): string {
  const formatNumber = (num: number): string =>
    parseFloat(num.toPrecision(12)).toString();

  const commandRegex = /([a-zA-Z][^a-zA-Z]*)/g;
  const commands = d.match(commandRegex);
  if (!commands) return "";

  let newPath = "";

  for (const cmdGroup of commands) {
    const command = cmdGroup[0]!;
    const paramsString = cmdGroup.substring(1);

    const values = paramsString.match(/-?\d*\.?\d+/g) || [];
    const newValues = values.map(Number);

    let paramIndex = 0;
    const scaledValues: string[] = [];

    while (paramIndex < newValues.length) {
      const val = newValues[paramIndex]!;
      let scaledVal;

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
      paramIndex++;
    }

    newPath += `${command} ${scaledValues.join(" ")} `;
  }

  return newPath.trim().replace(/\s+/g, " ");
}
