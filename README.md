# Floating Clock

Floating Clock is a lightweight, floating desktop world clock built with Tauri, React, and TypeScript. Its compact transparent window stays above other applications, making it useful for monitoring multiple time zones without taking up space in the taskbar.

![Platform](https://img.shields.io/badge/platform-Windows-0078D4)
![Tauri](https://img.shields.io/badge/Tauri-v2-24C8DB)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)

## Features

- Analog clock face with hour, minute, and second hands
- Live digital time display
- Selectable IANA time zone
- Dark and light themes
- Adjustable clock size from 200 px to 380 px
- Transparent, borderless, always-on-top window
- No taskbar icon
- Drag the clock anywhere on the screen
- Close button from within the application

## Built With

- [Tauri 2](https://v2.tauri.app/) for the desktop application shell
- [React 19](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for frontend development and builds
- [Bootstrap](https://getbootstrap.com/) and React Icons
- [Rust](https://www.rust-lang.org/) for the native backend

## Prerequisites

### Windows

Install the following before running Floating Clock:

1. [Node.js 20 or newer](https://nodejs.org/) with npm.
2. [Rust](https://www.rust-lang.org/tools/install) using the Rust installer.
3. Microsoft C++ Build Tools with the **Desktop development with C++** workload.
4. Microsoft Edge WebView2, which is included with supported Windows installations.

Verify the frontend and Rust toolchains:

```powershell
node --version
npm --version
cargo --version
rustc --version
```

## Getting Started

Clone the repository and enter the project directory:

```powershell
git clone <repository-url>
cd Floating Clock
```

Install the JavaScript dependencies:

```powershell
npm install
```

Start the desktop application in development mode:

```powershell
npm run tauri dev
```

You can also use the included Windows helper:

```powershell
.\r.bat
```

To run only the Vite frontend:

```powershell
npm run dev
```

The frontend is available at `http://localhost:1421`. Most native window behavior is only available when the application is launched through Tauri.

## Building

Create a production desktop build:

```powershell
npm run tauri build
```

Tauri places the generated Windows installer and executable in the output directory:

```text
src-tauri\target\release\bundle\
```

Create a standalone frontend production build without packaging the desktop application:

```powershell
npm run build
```

The frontend output is generated in the `dist/` directory.

## Testing

Run the TypeScript and Vite production build as the automated validation currently available in the project:

```powershell
npm run build
```

This command runs `tsc` and then creates the production frontend bundle. There is no unit-test script configured in the repository yet.

### Manual Testing Checklist

1. Launch Floating Clock with `npm run tauri dev`.
2. Confirm that the clock updates once per second.
3. Drag the clock by clicking and moving the clock face.
4. Open the time zone list and select a time zone.
5. Confirm that the digital time, analog hands, and selected time zone match.
6. Switch between dark and light themes.
7. Open settings and resize the clock from 200 px to 380 px.
8. Confirm that the clock remains transparent, borderless, and above other windows.
9. Click the close button and verify that the application exits.

## How to Use

| Action | How |
| --- | --- |
| Move the clock | Drag the clock face |
| Change time zone | Select the time zone label at the bottom of the clock, then choose a zone |
| Change theme | Click the sun or moon icon |
| Open settings | Click the gear icon |
| Resize the clock | Move the Clock size slider in settings |
| Close Floating Clock | Click the close icon |

## Project Structure

```text
Floating Clock/
├── src/
│   ├── components/
│   │   ├── WorldClock.tsx     # Clock, time zone, theme, and settings UI
│   │   └── WorldClock.css     # Clock styling
│   ├── App.tsx                # Application entry UI and window dragging
│   └── App.css                # Global desktop-window styling
├── src-tauri/
│   ├── src/
│   ├── capabilities/          # Tauri permissions
│   └── tauri.conf.json        # Window and application configuration
├── package.json
└── README.md
```

## Recommended Development Tools

- [Visual Studio Code](https://code.visualstudio.com/)
- [Tauri VS Code extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch from the default branch.
3. Keep changes focused and document new user-facing behavior.
4. Run `npm run build` before submitting a pull request.
5. Open a pull request describing the problem and the proposed solution.

## Troubleshooting

### Rust or Visual Studio Build Tools errors

Make sure the Visual Studio C++ Build Tools workload is installed and restart the terminal after installation.

### WebView2 errors

Install or update Microsoft Edge WebView2 Runtime, then restart Floating Clock.

### Port 1421 is already in use

Stop the process already using port 1421 or update the frontend server and `src-tauri/tauri.conf.json` development URL consistently.

## License

Floating Clock is distributed under the [Floating Clock Restricted Source License](LICENSE).
Personal and non-commercial use is permitted, but copying, redistribution,
commercial use, paid versions, resale, and substantially similar derivative
implementations require prior written permission from the copyright holder.
