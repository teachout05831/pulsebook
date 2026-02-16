export const FONT_OPTIONS = [
  "Inter", "Playfair Display", "Montserrat", "Lora", "Roboto",
  "Open Sans", "Poppins", "Merriweather", "Raleway", "Source Sans Pro",
];

export const THEME_SELECTS: {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "headingWeight", label: "Heading Weight",
    options: [{ value: "400", label: "Normal" }, { value: "600", label: "Semi-Bold" }, { value: "700", label: "Bold" }, { value: "800", label: "Extra-Bold" }],
  },
  {
    key: "headingCase", label: "Heading Case",
    options: [{ value: "normal", label: "Normal" }, { value: "uppercase", label: "Uppercase" }],
  },
  {
    key: "borderRadius", label: "Border Radius",
    options: [{ value: "none", label: "None" }, { value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }],
  },
  {
    key: "cardStyle", label: "Card Style",
    options: [{ value: "flat", label: "Flat" }, { value: "bordered", label: "Bordered" }, { value: "soft-shadow", label: "Soft Shadow" }, { value: "glass", label: "Glass" }],
  },
  {
    key: "buttonStyle", label: "Button Style",
    options: [{ value: "square-solid", label: "Square Solid" }, { value: "rounded", label: "Rounded" }, { value: "pill", label: "Pill" }, { value: "outline", label: "Outline" }, { value: "gradient", label: "Gradient" }],
  },
  {
    key: "sectionSpacing", label: "Section Spacing",
    options: [{ value: "tight", label: "Tight" }, { value: "normal", label: "Normal" }, { value: "generous", label: "Generous" }],
  },
  {
    key: "contentWidth", label: "Content Width",
    options: [{ value: "narrow", label: "Narrow" }, { value: "normal", label: "Normal" }, { value: "wide", label: "Wide" }, { value: "full", label: "Full" }],
  },
  {
    key: "headerStyle", label: "Header Style",
    options: [{ value: "dark-filled", label: "Dark Filled" }, { value: "transparent", label: "Transparent" }, { value: "gradient", label: "Gradient" }],
  },
  {
    key: "backgroundPattern", label: "Background Pattern",
    options: [{ value: "solid", label: "Solid" }, { value: "alternating", label: "Alternating" }, { value: "subtle-dots", label: "Subtle Dots" }, { value: "gradient-fade", label: "Gradient Fade" }],
  },
  {
    key: "accentPlacement", label: "Accent Placement",
    options: [{ value: "none", label: "None" }, { value: "left-border", label: "Left Border" }, { value: "underline", label: "Underline" }, { value: "highlight", label: "Highlight" }],
  },
  {
    key: "dividerStyle", label: "Divider Style",
    options: [{ value: "none", label: "None" }, { value: "line", label: "Line" }, { value: "dots", label: "Dots" }, { value: "wave", label: "Wave" }],
  },
  {
    key: "animations", label: "Animations",
    options: [{ value: "none", label: "None" }, { value: "subtle-fade", label: "Subtle Fade" }, { value: "slide-up", label: "Slide Up" }, { value: "expressive", label: "Expressive" }],
  },
  {
    key: "hoverEffects", label: "Hover Effects",
    options: [{ value: "none", label: "None" }, { value: "lift", label: "Lift" }, { value: "glow", label: "Glow" }, { value: "scale", label: "Scale" }],
  },
];
