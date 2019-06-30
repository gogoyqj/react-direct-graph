import * as React from "react";
import { IMatrixNode } from "../core";
import { GraphElement, ViewProps as ElementViewProps } from "./element";
import { GraphPolyline, ViewProps as PolylineViewProps } from "./polyline";
import { DefaultMarkerBody } from "./marker-default";

export type Props<T> = {
    nodesMap: { [id: string]: IMatrixNode<T> };
    cellSize: number;
    padding: number;
    widthInCells: number;
    heightInCells: number;
};

export type ViewProps<T> = ElementViewProps<T> & PolylineViewProps<T>;

interface INodeElementInput<T> {
    node: IMatrixNode<T>;
}

export class Graph<T> extends React.Component<Props<T> & ViewProps<T>> {
    getNodeElementInputs = (nodesMap: {
        [id: string]: IMatrixNode<T>;
    }): INodeElementInput<T>[] => {
        return Object.entries(nodesMap)
            .filter(([_, node]) => !node.isAnchor)
            .map(([_, node]) => ({
                node
            }));
    };
    renderElements() {
        const {
            nodesMap,
            cellSize,
            padding,
            widthInCells,
            heightInCells,
            ...restProps
        } = this.props;
        const elements = this.getNodeElementInputs(nodesMap);
        return elements.map(props => (
            <React.Fragment key={props.node.id}>
                <GraphElement
                    cellSize={cellSize}
                    padding={padding}
                    nodesMap={nodesMap}
                    {...props}
                    {...restProps}
                />
                <GraphPolyline
                    cellSize={cellSize}
                    padding={padding}
                    nodesMap={nodesMap}
                    {...props}
                    {...restProps}
                />
            </React.Fragment>
        ));
    }
    render() {
        const { cellSize, widthInCells, heightInCells } = this.props;
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1"
                width={widthInCells * cellSize}
                height={heightInCells * cellSize}
            >
                <DefaultMarkerBody />
                {this.renderElements()}
            </svg>
        );
    }
}
