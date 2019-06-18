import * as React from "react";
import { IMatrixNode } from "../core";
import {
    VectorDirection,
    getVectorDirection,
    getCellCenter,
    getCellTopEntry,
    getCellBottomEntry,
    getCellRightEntry,
    getCellLeftEntry
} from "../utils";
import { GraphNodeIconComponentProps } from "./node-icon";
import { DefaultNodeIcon } from "./node-icon-default";
import { withForeignObject } from "./with-foreign-object";

export type GraphEventFunc<T> = (
    event: React.MouseEvent,
    node: IMatrixNode<T>,
    incomes: IMatrixNode<T>[]
) => void;

export type ViewProps<T> = {
    component?: React.ComponentType<GraphNodeIconComponentProps<T>>;
    onNodeMouseEnter?: GraphEventFunc<T>;
    onNodeMouseLeave?: GraphEventFunc<T>;
    onEdgeMouseEnter?: GraphEventFunc<T>;
    onEdgeMouseLeave?: GraphEventFunc<T>;
    onNodeClick?: GraphEventFunc<T>;
    onEdgeClick?: GraphEventFunc<T>;
    cellSize: number;
    padding: number;
};

export type DataProps<T> = {
    node: IMatrixNode<T>;
    incomes: IMatrixNode<T>[];
};

export class GraphElement<T> extends React.Component<
    DataProps<T> & ViewProps<T>
> {
    getLineToIncome(
        cellSize: number,
        padding: number,
        node: IMatrixNode<T>,
        income: IMatrixNode<T>
    ) {
        const direction = getVectorDirection(
            node.x,
            node.y,
            income.x,
            income.y
        );
        let x1, y1, x2, y2;

        switch (direction) {
            case VectorDirection.Top:
                if (node.isAnchor) {
                    [x1, y1] = getCellCenter(cellSize, node.x, node.y);
                } else {
                    [x1, y1] = getCellTopEntry(
                        cellSize,
                        padding,
                        node.x,
                        node.y
                    );
                }
                if (income.isAnchor) {
                    [x2, y2] = getCellCenter(cellSize, income.x, income.y);
                } else {
                    [x2, y2] = getCellBottomEntry(
                        cellSize,
                        padding,
                        income.x,
                        income.y
                    );
                }
                break;
            case VectorDirection.Bottom:
                if (node.isAnchor) {
                    [x1, y1] = getCellCenter(cellSize, node.x, node.y);
                } else {
                    [x1, y1] = getCellBottomEntry(
                        cellSize,
                        padding,
                        node.x,
                        node.y
                    );
                }
                if (income.isAnchor) {
                    [x2, y2] = getCellCenter(cellSize, income.x, income.y);
                } else {
                    [x2, y2] = getCellTopEntry(
                        cellSize,
                        padding,
                        income.x,
                        income.y
                    );
                }
                break;
            case VectorDirection.Right:
                if (node.isAnchor) {
                    [x1, y1] = getCellCenter(cellSize, node.x, node.y);
                } else {
                    [x1, y1] = getCellRightEntry(
                        cellSize,
                        padding,
                        node.x,
                        node.y
                    );
                }
                if (income.isAnchor) {
                    [x2, y2] = getCellCenter(cellSize, income.x, income.y);
                } else {
                    [x2, y2] = getCellLeftEntry(
                        cellSize,
                        padding,
                        income.x,
                        income.y
                    );
                }
                break;
            case VectorDirection.Left:
                if (node.isAnchor) {
                    [x1, y1] = getCellCenter(cellSize, node.x, node.y);
                } else {
                    [x1, y1] = getCellLeftEntry(
                        cellSize,
                        padding,
                        node.x,
                        node.y
                    );
                }
                if (income.isAnchor) {
                    [x2, y2] = getCellCenter(cellSize, income.x, income.y);
                } else {
                    [x2, y2] = getCellRightEntry(
                        cellSize,
                        padding,
                        income.x,
                        income.y
                    );
                }
                break;
        }
        return {
            node,
            income,
            line: [x1, y1, x2, y2]
        };
    }

    getLines(
        cellSize: number,
        padding: number,
        node: IMatrixNode<T>,
        incomes: IMatrixNode<T>[]
    ) {
        return node.isAnchor
            ? incomes.map(income =>
                  this.getLineToIncome(cellSize, padding, income, node)
              )
            : incomes.map(income =>
                  this.getLineToIncome(cellSize, padding, node, income)
              );
    }

    getCoords(
        cellSize: number,
        padding: number,
        node: IMatrixNode<T>
    ): number[] {
        return [node.x * cellSize + padding, node.y * cellSize + padding];
    }

    getSize(cellSize: number, padding: number): number {
        return cellSize - padding * 2;
    }

    wrapEventHandler = (
        cb: GraphEventFunc<T>,
        node: IMatrixNode<T>,
        incomes: IMatrixNode<T>[]
    ): ((e: React.MouseEvent) => void) => {
        return (e: React.MouseEvent) => cb(e, node, incomes);
    };

    render() {
        const {
            node,
            incomes,
            cellSize,
            padding,
            onNodeClick,
            onNodeMouseEnter,
            onNodeMouseLeave,
            onEdgeClick,
            onEdgeMouseEnter,
            onEdgeMouseLeave
        } = this.props;
        const [x, y] = this.getCoords(cellSize, padding, node);
        const lines = this.getLines(cellSize, padding, node, incomes);
        const size = this.getSize(cellSize, padding);
        const NodeIcon = withForeignObject<GraphNodeIconComponentProps<T>>(
            this.props.component ? this.props.component : DefaultNodeIcon
        );

        return (
            <g
                className="node-group"
                style={{
                    strokeWidth: 2,
                    fill: "#ffffff",
                    stroke: "#2d578b"
                }}
            >
                {!node.isAnchor && (
                    <g
                        className="node-icon-group"
                        {...{
                            onClick:
                                onNodeClick &&
                                this.wrapEventHandler(
                                    onNodeClick,
                                    node,
                                    incomes
                                ),
                            onMouseEnter:
                                onNodeMouseEnter &&
                                this.wrapEventHandler(
                                    onNodeMouseEnter,
                                    node,
                                    incomes
                                ),
                            onMouseLeave:
                                onNodeMouseLeave &&
                                this.wrapEventHandler(
                                    onNodeMouseLeave,
                                    node,
                                    incomes
                                )
                        }}
                    >
                        <NodeIcon
                            x={x}
                            y={y}
                            height={size}
                            width={size}
                            node={node}
                            incomes={incomes}
                        />
                    </g>
                )}
                {lines.map(l => (
                    <line
                        {...{
                            onClick:
                                onEdgeClick &&
                                this.wrapEventHandler(onEdgeClick, l.node, [
                                    l.income
                                ]),
                            onMouseEnter:
                                onEdgeMouseEnter &&
                                this.wrapEventHandler(
                                    onEdgeMouseEnter,
                                    l.node,
                                    [l.income]
                                ),
                            onMouseLeave:
                                onEdgeMouseLeave &&
                                this.wrapEventHandler(
                                    onEdgeMouseLeave,
                                    l.node,
                                    [l.income]
                                )
                        }}
                        key={`line-${node.id}-${l.income.id}`}
                        className="node-line"
                        x1={l.line[0]}
                        y1={l.line[1]}
                        x2={l.line[2]}
                        y2={l.line[3]}
                    />
                ))}
            </g>
        );
    }
}