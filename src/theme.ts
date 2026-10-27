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

// Mantine's graphite dark scale: [0] text … [7] body background
const dark: MantineColorsTuple = [
    "#e6ebe9",
    "#c4ccc9",
    "#9aa5a1",
    "#6e7a76",
    "#3a4044",
    "#2c3036",
    "#212529",
    "#1a1d1e",
    "#151819",
    "#0f1112",
];

export const theme = createTheme({
    colors: { emerald, dark },
    primaryColor: "emerald",
    primaryShade: 5,
    defaultRadius: "md",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    headings: { fontWeight: "700" },
});
