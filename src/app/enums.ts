export const eraEnum = {
  TWENTIES: "20s",
  TEENIES: "10s",
  NOUGHTIES: "00s",
  NINETIES: "90s",
  EIGHTIES: "80s",
  SEVENTIES: "70s",
  SIXTIES: "60s",
  FIFTIES: "50s",
  FORTIES: "40s",
  THIRTIES: "30s",
  NINETWENTIES: "20s",
  N_A: "N/A",
} as const;

export type Eras = keyof typeof eraEnum;
