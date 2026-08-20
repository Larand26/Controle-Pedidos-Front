export type OrderStatusData = {
  ID_SITUACAO: number;
  SIT_DESCRICAO: string;
};

export type ParsedSeparator = {
  id: number;
  fullName: string;
  initials: string;
};

/**
 * Parses raw API status data to extract only the separators (containing "|")
 * and formats their names and initials for the UI.
 */
export const parseSeparators = (
  situations: OrderStatusData[] | undefined,
): ParsedSeparator[] => {
  if (!situations) return [];

  return situations
    .filter((sit) => sit.SIT_DESCRICAO.includes("|"))
    .map((sit) => {
      const fullName = sit.SIT_DESCRICAO.split("|")[1].trim();

      // Extracts the first two initials (e.g., "Daniel Atacado" -> "DA")
      const initials = fullName
        .split(" ")
        .map((namePart) => namePart[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return {
        id: sit.ID_SITUACAO,
        fullName,
        initials,
      };
    });
};
