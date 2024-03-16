/**
 * @jest-environment jsdom
 */

const chartStorage = require("../chartStorage");

describe('Chart Storage', () => {

    describe('saveChart function', () => {

        // Test if saves a chart and loads it from the specified index
        test('saves a chart and loads it from the specified index', () => {
            chartStorage.saveChart(10, 0);
            expect(chartStorage.loadSavedChart(0)).toBe(10);
        });

        // Tests if saves multiple charts and checks if the count is correct
        test('saves multiple charts and checks if the count is correct', () => {
            chartStorage.saveChart(15, 0);
            chartStorage.saveChart(25, 1);
            chartStorage.saveChart(30, 2);
            chartStorage.saveChart(5, 3);
            expect(chartStorage.loadAllSavedCharts()).toHaveLength(4);
        });
    });

    describe('updateCurrentChartData and loadCurrentChartData functions', () => {

        // Tests if updates and loads current chart data correctly
        test('updates and loads current chart data correctly', () => {
            chartStorage.updateCurrentChartData("hello");
            chartStorage.saveChart(50, 0);
            expect(chartStorage.loadCurrentChartData()).toBe("hello");
        });
    });
});
