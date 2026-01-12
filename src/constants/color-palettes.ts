export interface ColorPalette {
  id: string;
  title: string;
  colors: {
    id: string;
    hex: string;
  }[];
}

export interface SinglePalette {
  id: string;
  name: string;
  hex: string;
}
[];

export const colorPalettes: ColorPalette[] = [
  {
    id: "palette-1",
    title: "A Bridesmaid's Touch",
    colors: [
      { id: "1", hex: "#F6C8CC" },
      { id: "2", hex: "#AF8D84" },
      { id: "3", hex: "#807245" },
      { id: "4", hex: "#E0E5DA" },
      { id: "5", hex: "#ECF3D3" },
    ],
  },
  {
    id: "palette-2",
    title: "A Cozy Spot",
    colors: [
      { id: "1", hex: "#765C40" },
      { id: "2", hex: "#F3EDE0" },
      { id: "3", hex: "#DEC430" },
      { id: "4", hex: "#362E20" },
      { id: "5", hex: "#D1DCD9" },
    ],
  },
  {
    id: "palette-3",
    title: "Accross the cliff",
    colors: [
      { id: "1", hex: "#BC9476" },
      { id: "2", hex: "#116B98" },
      { id: "3", hex: "#F3893A" },
      { id: "4", hex: "#4B633B" },
      { id: "5", hex: "#69532C" },
    ],
  },
  {
    id: "palette-4",
    title: "Acoustic Adagio",
    colors: [
      { id: "1", hex: "#062E21" },
      { id: "2", hex: "#E27D3D" },
      { id: "3", hex: "#F4F5F4" },
      { id: "4", hex: "#93E9BE" },
      { id: "5", hex: "#897BC1" },
    ],
  },
  {
    id: "palette-5",
    title: "A Cozy Spot",
    colors: [
      { id: "1", hex: "#D8D9D0" },
      { id: "2", hex: "#111410" },
      { id: "3", hex: "#D18C30" },
      { id: "4", hex: "#2897B0" },
      { id: "5", hex: "#ECF3D3" },
    ],
  },
  {
    id: "palette-6",
    title: "Above the Clouds",
    colors: [
      { id: "1", hex: "#499FA4" },
      { id: "2", hex: "#BEC6C3" },
      { id: "3", hex: "#E9BC8B" },
      { id: "4", hex: "#3D4A55" },
      { id: "5", hex: "#9DA583" },
    ],
  },
  {
    id: "palette-7",
    title: "Abstract Beauty",
    colors: [
      { id: "1", hex: "#AC87A0" },
      { id: "2", hex: "#008000" },
      { id: "3", hex: "#D6AA80" },
      { id: "4", hex: "#CA2530" },
      { id: "5", hex: "#D9D3C6" },
    ],
  },
  {
    id: "palette-8",
    title: "A Colorful Summer",
    colors: [
      { id: "1", hex: "#FED43F" },
      { id: "2", hex: "#2BB8B3" },
      { id: "3", hex: "#E151AF" },
      { id: "4", hex: "#BED7D8" },
      { id: "5", hex: "#D9D3C6" },
    ],
  },
  {
    id: "palette-9",
    title: "A Colorful Summer",
    colors: [
      { id: "1", hex: "#FED43F" },
      { id: "2", hex: "#2BB8B3" },
      { id: "3", hex: "#E151AF" },
      { id: "4", hex: "#BED7D8" },
      { id: "5", hex: "#D9D3C6" },
    ],
  },
  {
    id: "palette-10",
    title: "A Cozy Spot",
    colors: [
      { id: "1", hex: "#D8D9D0" },
      { id: "2", hex: "#111410" },
      { id: "3", hex: "#D18C30" },
      { id: "4", hex: "#2897B0" },
      { id: "5", hex: "#ECF3D3" },
    ],
  },
  {
    id: "palette-11",
    title: "Abstract Beauty",
    colors: [
      { id: "1", hex: "#AC87A0" },
      { id: "2", hex: "#008000" },
      { id: "3", hex: "#D6AA80" },
      { id: "4", hex: "#CA2530" },
      { id: "5", hex: "#D9D3C6" },
    ],
  },
  {
    id: "palette-12",
    title: "Above the Clouds",
    colors: [
      { id: "1", hex: "#499FA4" },
      { id: "2", hex: "#BEC6C3" },
      { id: "3", hex: "#E9BC8B" },
      { id: "4", hex: "#3D4A55" },
      { id: "5", hex: "#9DA583" },
    ],
  },
  {
    id: "palette-13",
    title: "A Cozy Spot",
    colors: [
      { id: "1", hex: "#765C40" },
      { id: "2", hex: "#F3EDE0" },
      { id: "3", hex: "#DEC430" },
      { id: "4", hex: "#362E20" },
      { id: "5", hex: "#D1DCD9" },
    ],
  },
  {
    id: "palette-14",
    title: "Acoustic Adagio",
    colors: [
      { id: "1", hex: "#062E21" },
      { id: "2", hex: "#E27D3D" },
      { id: "3", hex: "#F4F5F4" },
      { id: "4", hex: "#93E9BE" },
      { id: "5", hex: "#897BC1" },
    ],
  },
  {
    id: "palette-15",
    title: "Accross the cliff",
    colors: [
      { id: "1", hex: "#BC9476" },
      { id: "2", hex: "#116B98" },
      { id: "3", hex: "#F3893A" },
      { id: "4", hex: "#4B633B" },
      { id: "5", hex: "#69532C" },
    ],
  },
  {
    id: "palette-16",
    title: "A Bridesmaid's Touch",
    colors: [
      { id: "1", hex: "#F6C8CC" },
      { id: "2", hex: "#AF8D84" },
      { id: "3", hex: "#807245" },
      { id: "4", hex: "#E0E5DA" },
      { id: "5", hex: "#ECF3D3" },
    ],
  },
];

export const SinglePalette: SinglePalette[] = [
  {
    id: "1",
    name: "Muted Teal",
    hex: "#8ABFA6",
  },
  {
    id: "2",
    name: "Tea Green",
    hex: "#BFD9C3",
  },
  {
    id: "3",
    name: "Carbon Black",
    hex: "#262523",
  },
  {
    id: "4",
    name: "Toasted Almond",
    hex: "#D98D62",
  },
  {
    id: "5",
    name: "Reddish Brown",
    hex: "#A64F3C",
  },
];
