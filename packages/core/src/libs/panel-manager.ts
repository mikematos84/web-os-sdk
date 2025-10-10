import { ComponentType } from "react";
import { AppBar } from "../components/AppBar";
import { ROOT_ELEMENT_ID } from "../constants";
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { logger } from "./logger";
import { PanelProps } from "../types";

export const PANELS = {
    "app-bar": AppBar
}

export const mountedPanels: Map<string, ComponentType<PanelProps>> = new Map<string, ComponentType<PanelProps>>();


export function mountPanel(id: string, options?: {
    component?: ComponentType<PanelProps>
}){ 
    const panelComponent = options?.component ?? (PANELS[id as keyof typeof PANELS] as ComponentType<PanelProps> | undefined);
    if (!panelComponent) {
        logger.error(`Panel component for id ${id} not found`);
        return;
    }

    // Yes, this code will add the AppBar component (or any specified panel component) to the DOM.
    // Here's how it works, slightly enhanced for clarity and robustness:

    // Find the root element where all panels are mounted
    const rootElement = document.getElementById(ROOT_ELEMENT_ID);
    if (rootElement) {
        // Avoid duplicating the panel container if it already exists
        let panelContainer = document.getElementById(`panel-${id}`);
        if (!panelContainer) {
            panelContainer = document.createElement("div");
            panelContainer.id = `panel-${id}`;
            rootElement.appendChild(panelContainer);
        }

        // Render the panel component into the panelContainer
        // Pass both `id` and `component` props as expected by PanelProps
        const root = createRoot(panelContainer);
        root.render(
            // eslint-disable-next-line react/react-in-jsx-scope
            createElement(panelComponent, { id, component: panelComponent } as PanelProps)
        );
        mountedPanels.set(id, panelComponent);
    }
}

export function unmountPanel(id: string) {
    const panelContainer = document.getElementById(`panel-${id}`);
    if (panelContainer) {
        // Unmount the React component from this container
        try {
            // react-dom@18+ needs createRoot per container; store roots if you need future updates
            // Here, we just unmount any React tree at this node
            const root = createRoot(panelContainer);
            root.unmount();
        } catch (e) {
            // fallback: remove node if root.unmount fails (should not happen unless it's not a root)
            logger.warn(`Fallback to removing panel container node for panel-${id}:`, e);
        }
        // Remove the panel container from the DOM
        panelContainer.remove();
    }
    if (mountedPanels.has(id)) {
        mountedPanels.delete(id);
    }
}