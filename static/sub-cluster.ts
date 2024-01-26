
type SubCluster = {
    key: string
    displayName: string
}

export const SUB_CLUSTER_LIST: SubCluster[] = [
  { key: "MNWC", displayName: "Monsoonal North (West)" },
  { key: "MNEC", displayName: "Monsoonal North (East)" },
  { key: "WTC", displayName: "Wet Tropics" },
  { key: "MBC", displayName: "Murray Basin" },
  { key: "CSC", displayName: "Central Slopes" },
  { key: "ECNC", displayName: "East Coast (Northern)" },
  { key: "ECSC", displayName: "East Coast (Southern)" },
  { key: "RLNC", displayName: "Rangelands North" },
  { key: "RLSC", displayName: "Rangelands South" },
  { key: "SSWSE", displayName: "Southern & South Western Flatlands (East)" },
  { key: "SSWSW", displayName: "Southern & South Western Flatlands (West)" },
  { key: "SSTEC", displayName: "Southern Slopes (Tas East)" },
  { key: "SSTWC", displayName: "Southern Slopes (Tas West)" },
  { key: "SSVEC", displayName: "Southern Slopes (Vic East)" },
  { key: "SSVWC", displayName: "Southern Slopes (Vic West)" },
] as const;
