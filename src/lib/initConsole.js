export default function initConsole() {
  console.log(
    `%c
███╗   ██╗ ██████╗ ██████╗ ████████╗ █████╗ 
████╗  ██║██╔═══██╗╚════██╗╚══██╔══╝██╔══██╗
██╔██╗ ██║██║   ██║ █████╔╝   ██║   ███████║
██║╚██╗██║██║   ██║██╔═══╝    ██║   ██╔══██║
██║ ╚████║╚██████╔╝███████╗   ██║   ██║  ██║
╚═╝  ╚═══╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝

              NO2TA PLATFORM
`,
    `
    color:#b2171a;
    font-size:14px;
    font-weight:bold;
    `,
  );

  console.log(
    "%cSystem Information",
    `
    color:#111;
    font-size:14px;
    font-weight:bold;
    `,
  );

  console.table({
    Version: "1.0.0",
    Environment: process.env.NODE_ENV,
    Framework: "Next.js",
    Database: "Firebase",
    Status: "Initialized",
  });
}
