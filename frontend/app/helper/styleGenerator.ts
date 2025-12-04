
interface DesignSystemAttributes {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: string;
}

export function generateCssVariables(ds: DesignSystemAttributes): string {
  return `
    :root {
      --primary-color: ${ds.primaryColor};
      --secondary-color: ${ds.secondaryColor};
      --background-color: ${ds.backgroundColor};
      --font-family: ${ds.fontFamily};
      --radius: ${ds.borderRadius};
    }
  `;
}
