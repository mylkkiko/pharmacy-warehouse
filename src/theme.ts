import { createTheme, MantineColorsTuple } from "@mantine/core";

const emerald: MantineColorsTuple = [
    "#e6fff5",
    "#c3f9e2",
    "#94f0cb",
    "#5fe5b1",
    "#34d399",
    "#10b981",
    "#0ea372",
    "#0b8a60",
    "#08704e",
    "#05573c",
];

// Mantine's dark scale with a cool green tint: [0] text … [7] body background
const dark: MantineColorsTuple = [
    "#e6f2ec",
    "#c3d4cb",
    "#9cb8a6",
    "#6f8a7d",
    "#3a4a43",
    "#22302b",
    "#16211d",
    "#0b110f",
    "#080d0b",
    "#050807",
];

export const theme = createTheme({
    colors: { emerald, dark },
    primaryColor: "emerald",
    primaryShade: 5,
    defaultRadius: "md",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    headings: { fontWeight: "700" },
});
