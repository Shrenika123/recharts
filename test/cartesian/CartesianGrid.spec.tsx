import React from 'react';
import { describe, test, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { scaleLinear } from 'victory-vendor/d3-scale';
import { Surface, CartesianGrid, LineChart } from '../../src';
import {
  GridLineFunctionProps,
  HorizontalCoordinatesGenerator,
  Props,
  VerticalCoordinatesGenerator,
} from '../../src/cartesian/CartesianGrid';
import { ChartOffset } from '../../src/util/types';

describe('<CartesianGrid />', () => {
  const horizontalPoints = [10, 20, 30, 100, 400];
  /**
   * JavaScript produces numbers like this when multiplying floats, for example:
   * 1.1 * 1.1 * 100
   * 1.1 * 2.1 * 100
   */
  const floatingPointPrecisionExamples = [121.00000000000002, 231.00000000000005];
  const verticalPoints = [100, 200, 300, 400];
  const offset: ChartOffset = {
    top: 1,
    bottom: 2,
    left: 3,
    right: 4,
    width: 5,
    height: 6,
    brushBottom: 7,
  };

  describe('grid', () => {
    describe('basic features', () => {
      it('should render on its own, outside of Recharts', () => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
            />
          </Surface>,
        );
        const allLines = container.querySelectorAll('line');
        expect.soft(allLines).toHaveLength(9);
        for (let i = 0; i < allLines.length; i++) {
          const line = allLines[i];
          expect.soft(line).toHaveAttribute('stroke', '#ccc');
          expect.soft(line).toHaveAttribute('fill', 'none');
        }
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-horizontal line'))
          .toHaveLength(horizontalPoints.length);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-vertical line'))
          .toHaveLength(verticalPoints.length);
      });

      test('Render 5 horizontal lines and 4 vertical lines in simple CartesianGrid', () => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
            />
          </Surface>,
        );
        expect.soft(container.querySelectorAll('line')).toHaveLength(9);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-horizontal line'))
          .toHaveLength(horizontalPoints.length);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-vertical line'))
          .toHaveLength(verticalPoints.length);
      });

      test("Don't render any lines when verticalPoints and horizontalPoints are empty", () => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid width={500} height={500} />
          </Surface>,
        );
        expect(container.querySelectorAll('line')).toHaveLength(0);
      });

      test.each([0, -1, NaN, Infinity])("Don't render any lines when width is %s", w => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid width={w} height={500} verticalPoints={verticalPoints} horizontalPoints={horizontalPoints} />
          </Surface>,
        );
        expect(container.querySelectorAll('line')).toHaveLength(0);
      });

      test.each([0, -1, NaN, Infinity])("Don't render any lines when height is %s", h => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid width={h} height={500} verticalPoints={verticalPoints} horizontalPoints={horizontalPoints} />
          </Surface>,
        );
        expect(container.querySelectorAll('line')).toHaveLength(0);
      });
    });

    describe('horizontalPoints without generator', () => {
      it('should not render any lines if horizontal=false', () => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              horizontal={false}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
            />
          </Surface>,
        );
        expect.soft(container.querySelectorAll('line')).toHaveLength(verticalPoints.length);
        expect.soft(container.querySelectorAll('.recharts-cartesian-grid-horizontal line')).toHaveLength(0);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-vertical line'))
          .toHaveLength(verticalPoints.length);
      });

      it('should render all lines if horizontal=true', () => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              horizontal
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
            />
          </Surface>,
        );
        expect.soft(container.querySelectorAll('line')).toHaveLength(9);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-horizontal line'))
          .toHaveLength(horizontalPoints.length);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-vertical line'))
          .toHaveLength(verticalPoints.length);
      });

      it('should render all lines if horizontal is undefined', () => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
            />
          </Surface>,
        );
        expect.soft(container.querySelectorAll('line')).toHaveLength(9);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-horizontal line'))
          .toHaveLength(horizontalPoints.length);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-vertical line'))
          .toHaveLength(verticalPoints.length);
      });
    });

    describe('verticalPoints without generator', () => {
      it('should not render any lines if vertical=false', () => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              vertical={false}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
            />
          </Surface>,
        );
        expect.soft(container.querySelectorAll('line')).toHaveLength(horizontalPoints.length);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-horizontal line'))
          .toHaveLength(horizontalPoints.length);
        expect.soft(container.querySelectorAll('.recharts-cartesian-grid-vertical line')).toHaveLength(0);
      });

      it('should render all lines if vertical=true', () => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              vertical
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
            />
          </Surface>,
        );
        expect.soft(container.querySelectorAll('line')).toHaveLength(9);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-horizontal line'))
          .toHaveLength(horizontalPoints.length);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-vertical line'))
          .toHaveLength(verticalPoints.length);
      });

      it('should render all lines if vertical is undefined', () => {
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
            />
          </Surface>,
        );
        expect.soft(container.querySelectorAll('line')).toHaveLength(9);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-horizontal line'))
          .toHaveLength(horizontalPoints.length);
        expect
          .soft(container.querySelectorAll('.recharts-cartesian-grid-vertical line'))
          .toHaveLength(verticalPoints.length);
      });
    });

    describe('horizontalCoordinatesGenerator', () => {
      it('should render lines that the generator returns', () => {
        const horizontalCoordinatesGenerator: HorizontalCoordinatesGenerator = vi.fn().mockReturnValue([1, 2]);
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
              offset={{}}
            />
          </Surface>,
        );

        expect(horizontalCoordinatesGenerator).toHaveBeenCalledOnce();

        const allLines = container.querySelectorAll('.recharts-cartesian-grid-horizontal line');
        expect(allLines).toHaveLength(2);
        expect.soft(allLines[0]).toHaveAttribute('x', '0');
        expect.soft(allLines[0]).toHaveAttribute('x1', '0');
        expect.soft(allLines[0]).toHaveAttribute('x2', '500');
        expect.soft(allLines[0]).toHaveAttribute('y', '0');
        expect.soft(allLines[0]).toHaveAttribute('y1', '1');
        expect.soft(allLines[0]).toHaveAttribute('y2', '1');
        expect.soft(allLines[1]).toHaveAttribute('x', '0');
        expect.soft(allLines[1]).toHaveAttribute('x1', '0');
        expect.soft(allLines[1]).toHaveAttribute('x2', '500');
        expect.soft(allLines[1]).toHaveAttribute('y', '0');
        expect.soft(allLines[1]).toHaveAttribute('y1', '2');
        expect.soft(allLines[1]).toHaveAttribute('y2', '2');
      });

      it('if both horizontalCoordinatesGenerator and horizontalPoints are present then horizontalPoints win', () => {
        const horizontalCoordinatesGenerator: HorizontalCoordinatesGenerator = vi.fn().mockReturnValue([1, 2]);
        expect(horizontalPoints.length).not.toBe(2);
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
              horizontalPoints={horizontalPoints}
              offset={offset}
            />
          </Surface>,
        );

        expect(horizontalCoordinatesGenerator).not.toHaveBeenCalled();

        const allLines = container.querySelectorAll('.recharts-cartesian-grid-horizontal line');
        expect(allLines).toHaveLength(horizontalPoints.length);
      });

      it('should pass props to the generator', () => {
        const horizontalCoordinatesGenerator: HorizontalCoordinatesGenerator = vi.fn().mockReturnValue([]);
        const yAxis: Props['yAxis'] = {
          scale: scaleLinear(),
          ticks: ['x', 'y', 'x'],
        };
        render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              yAxis={yAxis}
              horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
              chartWidth={300}
              chartHeight={200}
              offset={offset}
            />
          </Surface>,
        );

        expect(horizontalCoordinatesGenerator).toHaveBeenCalledOnce();
        expect(horizontalCoordinatesGenerator).toHaveBeenCalledWith(
          {
            yAxis,
            width: 300,
            height: 200,
            offset,
          },
          undefined,
        );
      });

      it(`should set syncWithTicks=true, and ticks=horizontalValues,
      when horizontalValues is provided, even if the explicit syncWithTicks is false`, () => {
        const horizontalCoordinatesGenerator: HorizontalCoordinatesGenerator = vi.fn().mockReturnValue([]);
        const yAxis: Props['yAxis'] = {
          scale: scaleLinear(),
          ticks: ['x', 'y', 'x'],
        };
        render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              yAxis={yAxis}
              horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
              chartWidth={300}
              chartHeight={200}
              offset={offset}
              syncWithTicks={false}
              horizontalValues={['a', 'b']}
            />
          </Surface>,
        );

        const yAxisExpected = {
          ...yAxis,
          ticks: ['a', 'b'],
        };

        expect(horizontalCoordinatesGenerator).toHaveBeenCalledOnce();
        expect(horizontalCoordinatesGenerator).toHaveBeenCalledWith(
          {
            yAxis: yAxisExpected,
            width: 300,
            height: 200,
            offset,
          },
          true,
        );
      });

      test.each([true, false, undefined])(
        'should set syncWithTicks as %s when horizontalValues is provided but is empty',
        syncWithTicks => {
          const horizontalCoordinatesGenerator: HorizontalCoordinatesGenerator = vi.fn().mockReturnValue([]);
          const yAxis: Props['yAxis'] = {
            scale: scaleLinear(),
          };
          render(
            <Surface width={500} height={500}>
              <CartesianGrid
                x={0}
                y={0}
                width={500}
                height={500}
                yAxis={yAxis}
                horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
                chartWidth={300}
                chartHeight={200}
                offset={offset}
                syncWithTicks={syncWithTicks}
                horizontalValues={[]}
              />
            </Surface>,
          );

          const yAxisExpected = {
            ...yAxis,
            ticks: undefined,
          };

          expect(horizontalCoordinatesGenerator).toHaveBeenCalledOnce();
          expect(horizontalCoordinatesGenerator).toHaveBeenCalledWith(
            {
              yAxis: yAxisExpected,
              width: 300,
              height: 200,
              offset,
            },
            syncWithTicks,
          );
        },
      );

      test.each([true, false, undefined])(
        'should pass props to the generator when syncWithTicks is %s',
        syncWithTicks => {
          const horizontalCoordinatesGenerator: HorizontalCoordinatesGenerator = vi.fn().mockReturnValue([]);
          const yAxis: Props['yAxis'] = {
            scale: scaleLinear(),
          };
          render(
            <Surface width={500} height={500}>
              <CartesianGrid
                x={0}
                y={0}
                width={500}
                height={500}
                yAxis={yAxis}
                horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
                chartWidth={300}
                chartHeight={200}
                offset={offset}
                syncWithTicks={syncWithTicks}
              />
            </Surface>,
          );

          const yAxisExpected = {
            ...yAxis,
            ticks: undefined,
          };

          expect(horizontalCoordinatesGenerator).toHaveBeenCalledOnce();
          expect(horizontalCoordinatesGenerator).toHaveBeenCalledWith(
            {
              yAxis: yAxisExpected,
              width: 300,
              height: 200,
              offset,
            },
            syncWithTicks,
          );
        },
      );

      test.each([{ gen: [] }, { gen: null }, { gen: undefined }, { gen: 'some random string' }, { gen: NaN }])(
        'should render nothing if the generator returns $gen',
        ({ gen }) => {
          const horizontalCoordinatesGenerator: HorizontalCoordinatesGenerator = vi.fn().mockReturnValue(gen);
          const { container } = render(
            <Surface width={500} height={500}>
              <CartesianGrid
                x={0}
                y={0}
                width={500}
                height={500}
                horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
                offset={offset}
              />
            </Surface>,
          );

          expect(horizontalCoordinatesGenerator).toHaveBeenCalledOnce();

          const allLines = container.querySelectorAll('.recharts-cartesian-grid-horizontal line');
          expect(allLines).toHaveLength(0);
        },
      );

      it('should generate its own ticks if neither horizontalPoints nor horizontalCoordinatesGenerator are provided', () => {
        const xAxis: Props['xAxis'] = {
          scale: scaleLinear(),
          ticks: [10, 50, 100],
        };
        const { container } = render(
          <LineChart width={500} height={500}>
            <CartesianGrid x={0} y={0} width={500} height={500} xAxis={xAxis} />
          </LineChart>,
        );

        const allLines = container.querySelectorAll('.recharts-cartesian-grid-horizontal line');
        expect(allLines).toHaveLength(2);
        expect.soft(allLines[0]).toHaveAttribute('x', '0');
        expect.soft(allLines[0]).toHaveAttribute('x1', '0');
        expect.soft(allLines[0]).toHaveAttribute('x2', '500');
        expect.soft(allLines[0]).toHaveAttribute('y', '0');
        expect.soft(allLines[0]).toHaveAttribute('y1', '5');
        expect.soft(allLines[0]).toHaveAttribute('y2', '5');
        expect.soft(allLines[1]).toHaveAttribute('x', '0');
        expect.soft(allLines[1]).toHaveAttribute('x1', '0');
        expect.soft(allLines[1]).toHaveAttribute('x2', '500');
        expect.soft(allLines[1]).toHaveAttribute('y', '0');
        expect.soft(allLines[1]).toHaveAttribute('y1', '495');
        expect.soft(allLines[1]).toHaveAttribute('y2', '495');
      });
    });

    describe('verticalCoordinatesGenerator', () => {
      it('should render lines that the generator returns', () => {
        const verticalCoordinatesGenerator: VerticalCoordinatesGenerator = vi.fn().mockReturnValue([1, 2]);
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalCoordinatesGenerator={verticalCoordinatesGenerator}
              offset={offset}
            />
          </Surface>,
        );

        expect(verticalCoordinatesGenerator).toHaveBeenCalledOnce();

        const allLines = container.querySelectorAll('.recharts-cartesian-grid-vertical line');
        expect(allLines).toHaveLength(2);
        expect.soft(allLines[0]).toHaveAttribute('x', '0');
        expect.soft(allLines[0]).toHaveAttribute('x1', '1');
        expect.soft(allLines[0]).toHaveAttribute('x2', '1');
        expect.soft(allLines[0]).toHaveAttribute('y', '0');
        expect.soft(allLines[0]).toHaveAttribute('y1', '0');
        expect.soft(allLines[0]).toHaveAttribute('y2', '500');
        expect.soft(allLines[1]).toHaveAttribute('x', '0');
        expect.soft(allLines[1]).toHaveAttribute('x1', '2');
        expect.soft(allLines[1]).toHaveAttribute('x2', '2');
        expect.soft(allLines[1]).toHaveAttribute('y', '0');
        expect.soft(allLines[1]).toHaveAttribute('y1', '0');
        expect.soft(allLines[1]).toHaveAttribute('y2', '500');
      });

      it('if both verticalCoordinatesGenerator and verticalPoints are present then verticalPoints wins', () => {
        const verticalCoordinatesGenerator: VerticalCoordinatesGenerator = vi.fn().mockReturnValue([1, 2]);
        expect(verticalPoints.length).not.toBe(2);
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalCoordinatesGenerator={verticalCoordinatesGenerator}
              verticalPoints={verticalPoints}
              offset={offset}
            />
          </Surface>,
        );

        expect(verticalCoordinatesGenerator).not.toHaveBeenCalled();

        const allLines = container.querySelectorAll('.recharts-cartesian-grid-vertical line');
        expect(allLines).toHaveLength(verticalPoints.length);
      });

      it('should pass props to the generator', () => {
        const verticalCoordinatesGenerator: VerticalCoordinatesGenerator = vi.fn().mockReturnValue([]);
        const xAxis: Props['xAxis'] = {
          scale: scaleLinear(),
          ticks: ['x', 'y', 'x'],
        };
        render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              xAxis={xAxis}
              verticalCoordinatesGenerator={verticalCoordinatesGenerator}
              chartWidth={300}
              chartHeight={200}
              offset={offset}
            />
          </Surface>,
        );

        expect(verticalCoordinatesGenerator).toHaveBeenCalledOnce();
        expect(verticalCoordinatesGenerator).toHaveBeenCalledWith(
          {
            xAxis,
            width: 300,
            height: 200,
            offset,
          },
          undefined,
        );
      });

      it(`should set syncWithTicks=true, and ticks=verticalValues,
      when verticalValues is provided, even if the explicit syncWithTicks is false`, () => {
        const verticalCoordinatesGenerator: VerticalCoordinatesGenerator = vi.fn().mockReturnValue([]);
        const xAxis: Props['xAxis'] = {
          scale: scaleLinear(),
          ticks: ['x', 'y', 'x'],
        };
        render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              xAxis={xAxis}
              verticalCoordinatesGenerator={verticalCoordinatesGenerator}
              chartWidth={300}
              chartHeight={200}
              offset={offset}
              syncWithTicks={false}
              verticalValues={['a', 'b']}
            />
          </Surface>,
        );

        const xAxisExpected = {
          ...xAxis,
          ticks: ['a', 'b'],
        };

        expect(verticalCoordinatesGenerator).toHaveBeenCalledOnce();
        expect(verticalCoordinatesGenerator).toHaveBeenCalledWith(
          {
            xAxis: xAxisExpected,
            width: 300,
            height: 200,
            offset,
          },
          true,
        );
      });

      test.each([true, false, undefined])(
        'should set syncWithTicks as %s when horizontalValues is provided but is empty',
        syncWithTicks => {
          const verticalCoordinatesGenerator: VerticalCoordinatesGenerator = vi.fn().mockReturnValue([]);
          const xAxis: Props['xAxis'] = {
            scale: scaleLinear(),
          };
          render(
            <Surface width={500} height={500}>
              <CartesianGrid
                x={0}
                y={0}
                width={500}
                height={500}
                xAxis={xAxis}
                verticalCoordinatesGenerator={verticalCoordinatesGenerator}
                chartWidth={300}
                chartHeight={200}
                offset={offset}
                syncWithTicks={syncWithTicks}
                horizontalValues={[]}
              />
            </Surface>,
          );

          const xAxisExpected = {
            ...xAxis,
            ticks: undefined,
          };

          expect(verticalCoordinatesGenerator).toHaveBeenCalledOnce();
          expect(verticalCoordinatesGenerator).toHaveBeenCalledWith(
            {
              xAxis: xAxisExpected,
              width: 300,
              height: 200,
              offset,
            },
            syncWithTicks,
          );
        },
      );

      test.each([true, false, undefined])(
        'should pass props to the generator when syncWithTicks is %s',
        syncWithTicks => {
          const verticalCoordinatesGenerator: VerticalCoordinatesGenerator = vi.fn().mockReturnValue([]);
          const xAxis: Props['xAxis'] = {
            scale: scaleLinear(),
          };
          render(
            <Surface width={500} height={500}>
              <CartesianGrid
                x={0}
                y={0}
                width={500}
                height={500}
                xAxis={xAxis}
                verticalCoordinatesGenerator={verticalCoordinatesGenerator}
                chartWidth={300}
                chartHeight={200}
                offset={offset}
                syncWithTicks={syncWithTicks}
              />
            </Surface>,
          );

          const xAxisExpected = {
            ...xAxis,
            ticks: undefined,
          };

          expect(verticalCoordinatesGenerator).toHaveBeenCalledOnce();
          expect(verticalCoordinatesGenerator).toHaveBeenCalledWith(
            {
              xAxis: xAxisExpected,
              width: 300,
              height: 200,
              offset,
            },
            syncWithTicks,
          );
        },
      );

      test.each([{ gen: [] }, { gen: null }, { gen: undefined }, { gen: 'some random string' }, { gen: NaN }])(
        'should render nothing if the generator returns $gen',
        ({ gen }) => {
          const verticalCoordinatesGenerator: VerticalCoordinatesGenerator = vi.fn().mockReturnValue(gen);
          const { container } = render(
            <Surface width={500} height={500}>
              <CartesianGrid
                x={0}
                y={0}
                width={500}
                height={500}
                verticalCoordinatesGenerator={verticalCoordinatesGenerator}
                offset={offset}
              />
            </Surface>,
          );

          expect(verticalCoordinatesGenerator).toHaveBeenCalledOnce();

          const allLines = container.querySelectorAll('.recharts-cartesian-grid-vertical line');
          expect(allLines).toHaveLength(0);
        },
      );

      it('should generate its own ticks if neither verticalPoints nor verticalCoordinatesGenerator are provided', () => {
        const xAxis: Props['xAxis'] = {
          scale: scaleLinear(),
          ticks: [10, 50, 100],
        };
        const { container } = render(
          <LineChart width={500} height={500}>
            <CartesianGrid x={0} y={0} width={500} height={500} xAxis={xAxis} />
          </LineChart>,
        );

        const allLines = container.querySelectorAll('.recharts-cartesian-grid-vertical line');
        expect(allLines).toHaveLength(2);
        expect.soft(allLines[0]).toHaveAttribute('x', '0');
        expect.soft(allLines[0]).toHaveAttribute('x1', '5');
        expect.soft(allLines[0]).toHaveAttribute('x2', '5');
        expect.soft(allLines[0]).toHaveAttribute('y', '0');
        expect.soft(allLines[0]).toHaveAttribute('y1', '0');
        expect.soft(allLines[0]).toHaveAttribute('y2', '500');
        expect.soft(allLines[1]).toHaveAttribute('x', '0');
        expect.soft(allLines[1]).toHaveAttribute('x1', '495');
        expect.soft(allLines[1]).toHaveAttribute('x2', '495');
        expect.soft(allLines[1]).toHaveAttribute('y', '0');
        expect.soft(allLines[1]).toHaveAttribute('y1', '0');
        expect.soft(allLines[1]).toHaveAttribute('y2', '500');
      });
    });

    describe('horizontal as a function', () => {
      it('should pass props, add default stroke, and then render result of the function', () => {
        const horizontal = vi.fn().mockReturnValue(<g data-testid="my_mock_line" />);
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
              horizontal={horizontal}
            />
          </Surface>,
        );
        expect(horizontal).toHaveBeenCalledTimes(horizontalPoints.length);

        const expectedProps: GridLineFunctionProps = {
          stroke: '#ccc',
          fill: 'none',
          height: 500,
          width: 500,
          vertical: true,
          horizontalFill: [],
          horizontalPoints,
          verticalFill: [],
          verticalPoints,
          horizontal,
          key: expect.stringMatching(/line-[0-9]/),
          x: 0,
          y: 0,
          x1: 0,
          x2: 500,
          y1: expect.any(Number),
          y2: expect.any(Number),
          index: expect.any(Number),
        };
        expect(horizontal).toHaveBeenCalledWith(expectedProps);

        expect(container.querySelectorAll('[data-testid=my_mock_line]')).toHaveLength(horizontalPoints.length);
      });
    });

    describe('horizontal as an element', () => {
      it('should pass props, add default stroke, and then render result of the function', () => {
        const spy = vi.fn();
        const Horizontal = (props: any) => {
          spy(props);
          return <g data-testid="my_mock_line" />;
        };
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
              horizontal={<Horizontal />}
            />
          </Surface>,
        );
        expect(spy).toHaveBeenCalledTimes(horizontalPoints.length);

        const expectedProps: GridLineFunctionProps = {
          stroke: '#ccc',
          fill: 'none',
          height: 500,
          width: 500,
          vertical: true,
          horizontalFill: [],
          horizontalPoints,
          verticalFill: [],
          verticalPoints,
          horizontal: <Horizontal />,
          // @ts-expect-error React does not pass the key through when calling cloneElement
          key: undefined,
          x: 0,
          y: 0,
          x1: 0,
          x2: 500,
          y1: expect.any(Number),
          y2: expect.any(Number),
          index: expect.any(Number),
        };
        expect(spy).toHaveBeenCalledWith(expectedProps);

        expect(container.querySelectorAll('[data-testid=my_mock_line]')).toHaveLength(horizontalPoints.length);
      });
    });

    describe('vertical as a function', () => {
      it('should pass props, add default stroke, and then render result of the function', () => {
        const vertical = vi.fn().mockReturnValue(<g data-testid="my_mock_line" />);
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
              vertical={vertical}
            />
          </Surface>,
        );
        expect(vertical).toHaveBeenCalledTimes(verticalPoints.length);

        const expectedProps: GridLineFunctionProps = {
          stroke: '#ccc',
          fill: 'none',
          height: 500,
          width: 500,
          horizontal: true,
          horizontalFill: [],
          horizontalPoints,
          verticalFill: [],
          verticalPoints,
          vertical,
          key: expect.stringMatching(/line-[0-9]/),
          x: 0,
          y: 0,
          x1: expect.any(Number),
          x2: expect.any(Number),
          y1: 0,
          y2: 500,
          index: expect.any(Number),
        };
        expect(vertical).toHaveBeenCalledWith(expectedProps);

        expect(container.querySelectorAll('[data-testid=my_mock_line]')).toHaveLength(verticalPoints.length);
      });
    });

    describe('vertical as an element', () => {
      it('should pass props, add default stroke, and then render result of the function', () => {
        const spy = vi.fn();
        const Vertical = (props: any) => {
          spy(props);
          return <g data-testid="my_mock_line" />;
        };
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalPoints={verticalPoints}
              horizontalPoints={horizontalPoints}
              vertical={<Vertical />}
            />
          </Surface>,
        );
        expect(spy).toHaveBeenCalledTimes(verticalPoints.length);

        const expectedProps: GridLineFunctionProps = {
          stroke: '#ccc',
          fill: 'none',
          height: 500,
          width: 500,
          horizontal: true,
          horizontalFill: [],
          horizontalPoints,
          verticalFill: [],
          verticalPoints,
          vertical: <Vertical />,
          // @ts-expect-error React does not pass the key through when calling cloneElement
          key: undefined,
          x: 0,
          y: 0,
          x1: expect.any(Number),
          x2: expect.any(Number),
          y1: 0,
          y2: 500,
          index: expect.any(Number),
        };
        expect(spy).toHaveBeenCalledWith(expectedProps);

        expect(container.querySelectorAll('[data-testid=my_mock_line]')).toHaveLength(verticalPoints.length);
      });
    });
  });

  describe('stripes', () => {
    const emptyFillCases: { fill: string[] | undefined }[] = [{ fill: [] }, { fill: undefined }];

    describe('horizontal stripes', () => {
      test.each([true, undefined])('should render horizontal stripes if horizontal prop = %s', horizontal => {
        const extraSpaceAtTheTopOfChart = 1;
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={Math.max(...horizontalPoints) + extraSpaceAtTheTopOfChart}
            verticalPoints={verticalPoints}
            horizontalPoints={horizontalPoints}
            horizontalFill={['red', 'green']}
            fillOpacity="20%"
            horizontal={horizontal}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        expect(allStripes).toHaveLength(horizontalPoints.length + 1);

        for (let i = 0; i < allStripes.length; i++) {
          const element = allStripes[i];
          expect.soft(element).toHaveAttribute('x', '0');
          expect.soft(element).toHaveAttribute('stroke', 'none');
          expect.soft(element).toHaveAttribute('fill-opacity', '20%');
          expect.soft(element).toHaveClass('recharts-cartesian-grid-bg');
        }

        expect(allStripes[0]).toHaveAttribute('fill', 'red');
        expect(allStripes[0]).toHaveAttribute('y', '0');
        expect(allStripes[0]).toHaveAttribute('height', '10');

        expect(allStripes[1]).toHaveAttribute('fill', 'green');
        expect(allStripes[1]).toHaveAttribute('y', '10');
        expect(allStripes[1]).toHaveAttribute('height', '10');

        expect(allStripes[2]).toHaveAttribute('fill', 'red');
        expect(allStripes[2]).toHaveAttribute('y', '20');
        expect(allStripes[2]).toHaveAttribute('height', '10');

        expect(allStripes[3]).toHaveAttribute('fill', 'green');
        expect(allStripes[3]).toHaveAttribute('y', '30');
        expect(allStripes[3]).toHaveAttribute('height', '70');

        expect(allStripes[4]).toHaveAttribute('fill', 'red');
        expect(allStripes[4]).toHaveAttribute('y', '100');
        expect(allStripes[4]).toHaveAttribute('height', '300');

        expect(allStripes[5]).toHaveAttribute('fill', 'green');
        expect(allStripes[5]).toHaveAttribute('y', '400');
        expect(allStripes[5]).toHaveAttribute('height', String(extraSpaceAtTheTopOfChart));
      });

      it('should render stripes defined by horizontalCoordinatesGenerator', () => {
        const horizontalCoordinatesGenerator: HorizontalCoordinatesGenerator = vi.fn().mockReturnValue([1, 2]);
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
              horizontalFill={['red', 'green']}
              offset={offset}
            />
          </Surface>,
        );

        expect(horizontalCoordinatesGenerator).toHaveBeenCalledOnce();

        const allLines = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        expect(allLines).toHaveLength(3);
      });

      it('should not render anything if horizontal=false', () => {
        const extraSpaceAtTheTopOfChart = 1;
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={Math.max(...horizontalPoints) + extraSpaceAtTheTopOfChart}
            verticalPoints={verticalPoints}
            horizontalPoints={horizontalPoints}
            horizontalFill={['red', 'green']}
            fillOpacity="20%"
            horizontal={false}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        expect(allStripes).toHaveLength(0);
      });

      test.each(emptyFillCases)('should render nothing if horizontalFill is $fill', ({ fill }) => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={Math.max(...horizontalPoints) + 1}
            verticalPoints={verticalPoints}
            horizontalPoints={horizontalPoints}
            horizontalFill={fill}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        expect(allStripes).toHaveLength(0);
      });

      it('should leave out the stripe at the beginning if the smallest horizontalPoints happens to be exactly at position y', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={Math.min(...horizontalPoints)}
            width={500}
            height={Math.max(...horizontalPoints) + 1}
            verticalPoints={verticalPoints}
            horizontalPoints={horizontalPoints}
            horizontalFill={['red', 'green']}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        expect(allStripes).toHaveLength(horizontalPoints.length);
      });

      it('render the stripe at the beginning if the smallest horizontalPoints is smaller than position y', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={Math.min(...horizontalPoints) - 1}
            width={500}
            height={Math.max(...horizontalPoints) + 1}
            verticalPoints={verticalPoints}
            horizontalPoints={horizontalPoints}
            horizontalFill={['red', 'green']}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        /*
         * This feels to me like a bug. This stripe is outside of the rendered Grid, why should it be visible?
         */
        expect(allStripes).toHaveLength(horizontalPoints.length + 1);
      });

      it('removes the one stripe at the end if it would render outside of the Grid', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={Math.max(...horizontalPoints) - 1}
            verticalPoints={verticalPoints}
            horizontalPoints={horizontalPoints}
            horizontalFill={['red', 'green']}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        expect(allStripes).toHaveLength(horizontalPoints.length);
      });

      it('removes still only one stripe even if all of them render outside of the grid', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={1}
            verticalPoints={verticalPoints}
            horizontalPoints={horizontalPoints}
            horizontalFill={['red', 'green']}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        /*
         * Why remove only one? None of them are visible
         */
        expect(allStripes).toHaveLength(horizontalPoints.length);
      });

      it('should round horizontalPoints [https://github.com/recharts/recharts/pull/3075]', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={500}
            verticalPoints={verticalPoints}
            horizontalPoints={floatingPointPrecisionExamples}
            horizontalFill={['red', 'green']}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        /*
         * This feels to me like a bug. This stripe is outside of the rendered Grid, why should it be visible?
         */
        expect(allStripes).toHaveLength(floatingPointPrecisionExamples.length + 1);

        expect.soft(allStripes[0]).toHaveAttribute('height', '121');
        expect.soft(allStripes[1]).toHaveAttribute('height', '110');
        /*
         * Without the rounding, these will have height of something like
         * 268.99999999999994
         * which makes the browser render a very thin line and it looks ugly.
         */
        expect.soft(allStripes[2]).toHaveAttribute('height', '269');
      });

      it('should ignore stripes that have computed height 0', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={500}
            verticalPoints={verticalPoints}
            horizontalPoints={[10, 20, 10, 500]}
            horizontalFill={['red', 'green']}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-horizontal rect');
        expect(allStripes).toHaveLength(3);

        expect.soft(allStripes[0]).toHaveAttribute('height', '10');
        expect.soft(allStripes[0]).toHaveAttribute('y', '0');

        // even though the horizontalPoints do define double 10, 10 ... the stripe is not rendered

        expect.soft(allStripes[1]).toHaveAttribute('height', '10');
        expect.soft(allStripes[1]).toHaveAttribute('y', '10');

        expect.soft(allStripes[2]).toHaveAttribute('height', '480');
        expect.soft(allStripes[2]).toHaveAttribute('y', '20');
      });
    });
    describe('vertical stripes', () => {
      test.each([true, undefined])('should render vertical stripes if vertical prop = %s', vertical => {
        const extraSpaceAtTheEndOfChart = 1;
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            height={500}
            width={Math.max(...verticalPoints) + extraSpaceAtTheEndOfChart}
            verticalPoints={verticalPoints}
            verticalFill={['red', 'green']}
            fillOpacity="20%"
            vertical={vertical}
            offset={offset}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        expect(allStripes).toHaveLength(verticalPoints.length + 1);

        for (let i = 0; i < allStripes.length; i++) {
          const element = allStripes[i];
          expect.soft(element).toHaveAttribute('y', '0');
          expect.soft(element).toHaveAttribute('height', '500');
          expect.soft(element).toHaveAttribute('stroke', 'none');
          expect.soft(element).toHaveAttribute('fill-opacity', '20%');
          expect.soft(element).toHaveClass('recharts-cartesian-grid-bg');
        }

        expect.soft(allStripes[0]).toHaveAttribute('fill', 'red');
        expect.soft(allStripes[0]).toHaveAttribute('x', '0');
        expect.soft(allStripes[0]).toHaveAttribute('width', '100');

        expect.soft(allStripes[1]).toHaveAttribute('fill', 'green');
        expect.soft(allStripes[1]).toHaveAttribute('x', '100');
        expect.soft(allStripes[1]).toHaveAttribute('width', '100');

        expect.soft(allStripes[2]).toHaveAttribute('fill', 'red');
        expect.soft(allStripes[2]).toHaveAttribute('x', '200');
        expect.soft(allStripes[2]).toHaveAttribute('width', '100');

        expect.soft(allStripes[3]).toHaveAttribute('fill', 'green');
        expect.soft(allStripes[3]).toHaveAttribute('x', '300');
        expect.soft(allStripes[3]).toHaveAttribute('width', '100');

        expect.soft(allStripes[4]).toHaveAttribute('fill', 'red');
        expect.soft(allStripes[4]).toHaveAttribute('x', '400');
        expect.soft(allStripes[4]).toHaveAttribute('width', String(extraSpaceAtTheEndOfChart));
      });

      it('should render stripes defined by verticalCoordinatesGenerator', () => {
        const verticalCoordinatesGenerator: VerticalCoordinatesGenerator = vi.fn().mockReturnValue([1, 2]);
        const { container } = render(
          <Surface width={500} height={500}>
            <CartesianGrid
              x={0}
              y={0}
              width={500}
              height={500}
              verticalCoordinatesGenerator={verticalCoordinatesGenerator}
              verticalFill={['red', 'green']}
              offset={offset}
            />
          </Surface>,
        );

        expect(verticalCoordinatesGenerator).toHaveBeenCalledOnce();

        const allLines = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        expect(allLines).toHaveLength(3);
      });

      it('should not render anything if vertical=false', () => {
        const extraSpaceAtTheTopOfChart = 1;
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            height={500}
            width={Math.max(...verticalPoints) + extraSpaceAtTheTopOfChart}
            verticalPoints={verticalPoints}
            verticalFill={['red', 'green']}
            fillOpacity="20%"
            vertical={false}
            offset={offset}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        expect(allStripes).toHaveLength(0);
      });

      test.each(emptyFillCases)('should render nothing if verticalFill is $fill', ({ fill }) => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            height={500}
            width={Math.max(...verticalPoints) + 1}
            verticalPoints={verticalPoints}
            verticalFill={fill}
            offset={offset}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        expect(allStripes).toHaveLength(0);
      });

      it('should leave out the stripe at the beginning if the smallest verticalPoints happens to be exactly at position x', () => {
        const { container } = render(
          <CartesianGrid
            y={0}
            x={Math.min(...verticalPoints)}
            height={500}
            width={Math.max(...verticalPoints) + 1}
            verticalPoints={verticalPoints}
            verticalFill={['red', 'green']}
            offset={offset}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        expect(allStripes).toHaveLength(verticalPoints.length);
      });

      it('render the stripe at the beginning if the smallest verticalPoints is smaller than position x', () => {
        const { container } = render(
          <CartesianGrid
            y={0}
            x={Math.min(...verticalPoints) - 1}
            height={500}
            width={Math.max(...verticalPoints) + 1}
            verticalPoints={verticalPoints}
            verticalFill={['red', 'green']}
            offset={offset}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        /*
         * This feels to me like a bug. This stripe is outside of the rendered Grid, why should it be visible?
         */
        expect(allStripes).toHaveLength(verticalPoints.length + 1);
      });

      it('removes the one stripe at the end if it would render outside of the Grid', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            height={500}
            width={Math.max(...verticalPoints) - 1}
            verticalPoints={verticalPoints}
            verticalFill={['red', 'green']}
            offset={offset}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        expect(allStripes).toHaveLength(verticalPoints.length);
      });

      it('removes still only one stripe even if all of them render outside of the grid', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={1}
            height={500}
            verticalPoints={verticalPoints}
            verticalFill={['red', 'green']}
            offset={offset}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        /*
         * Why remove only one? None of them are visible
         */
        expect(allStripes).toHaveLength(verticalPoints.length);
      });

      it('should round verticalPoints [https://github.com/recharts/recharts/pull/3075]', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={500}
            verticalPoints={floatingPointPrecisionExamples}
            verticalFill={['red', 'green']}
            offset={offset}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        /*
         * This feels to me like a bug. This stripe is outside of the rendered Grid, why should it be visible?
         */
        expect(allStripes).toHaveLength(floatingPointPrecisionExamples.length + 1);
        for (let i = 0; i < allStripes.length; i++) {
          const stripe = allStripes[i];
          expect(stripe).toHaveAttribute('height', '500');
        }

        expect.soft(allStripes[0]).toHaveAttribute('width', '121');
        expect.soft(allStripes[1]).toHaveAttribute('width', '110');
        /*
         * Without the rounding, these will have width of something like
         * 268.99999999999994
         * which makes the browser render a very thin line and it looks ugly.
         */
        expect.soft(allStripes[2]).toHaveAttribute('width', '269');
      });

      it('should ignore stripes that have computed width 0', () => {
        const { container } = render(
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={500}
            verticalPoints={[10, 20, 10, 500]}
            verticalFill={['red', 'green']}
            offset={offset}
          />,
        );
        const allStripes = container.querySelectorAll('.recharts-cartesian-gridstripes-vertical rect');
        expect(allStripes).toHaveLength(3);

        expect.soft(allStripes[0]).toHaveAttribute('width', '10');
        expect.soft(allStripes[0]).toHaveAttribute('height', '500');
        expect.soft(allStripes[0]).toHaveAttribute('x', '0');
        expect.soft(allStripes[0]).toHaveAttribute('y', '0');

        // even though the verticalPoints do define double 10, 10 ... the stripe is not rendered

        expect.soft(allStripes[1]).toHaveAttribute('width', '10');
        expect.soft(allStripes[1]).toHaveAttribute('height', '500');
        expect.soft(allStripes[1]).toHaveAttribute('x', '10');
        expect.soft(allStripes[1]).toHaveAttribute('y', '0');

        expect.soft(allStripes[2]).toHaveAttribute('width', '480');
        expect.soft(allStripes[2]).toHaveAttribute('height', '500');
        expect.soft(allStripes[2]).toHaveAttribute('x', '20');
        expect.soft(allStripes[2]).toHaveAttribute('y', '0');
      });
    });
  });

  describe('offset prop', () => {
    it('should not pass the offset prop anywhere', () => {
      const { container } = render(
        <Surface width={500} height={500}>
          <CartesianGrid
            x={0}
            y={0}
            width={500}
            height={500}
            verticalPoints={verticalPoints}
            horizontalPoints={horizontalPoints}
            offset={offset}
          />
        </Surface>,
      );
      // select everything
      const allElements = container.querySelectorAll('*');
      // check that the selector worked
      expect(allElements).toHaveLength(15);
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[0];
        expect(element).not.toHaveAttribute('offset');
      }
    });
  });
});
