import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import WorldClock from "./components/WorldClock.tsx";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { LogicalPosition } from "@tauri-apps/api/dpi";
import { useRef } from "react";

const appWindow = getCurrentWindow();

function App() {
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startWindow = useRef({ x: 0, y: 0 });

  const onMouseDown = async (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignore clicks on interactive elements
    const target = e.target as HTMLElement;

    if (
      target.closest(
        "input, textarea, select, button, option, label, a, [contenteditable='true']"
      )
    ) {
      return;
    }

    dragging.current = true;

    startMouse.current = {
      x: e.screenX,
      y: e.screenY,
    };

    const pos = await appWindow.outerPosition();

    startWindow.current = {
      x: pos.x,
      y: pos.y,
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = async (e: MouseEvent) => {
    if (!dragging.current) return;

    const dx = e.screenX - startMouse.current.x;
    const dy = e.screenY - startMouse.current.y;

    await appWindow.setPosition(
      new LogicalPosition(
        startWindow.current.x + dx,
        startWindow.current.y + dy
      )
    );
  };

  const onMouseUp = () => {
    dragging.current = false;

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="app">
      <div className="drag-area" onMouseDown={onMouseDown}>
        <WorldClock />
      </div>
    </div>
  );
}

export default App;