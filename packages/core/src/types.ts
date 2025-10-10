import { ComponentType } from "react"

export interface PanelProps {
    id: string
    component: ComponentType<unknown>
}