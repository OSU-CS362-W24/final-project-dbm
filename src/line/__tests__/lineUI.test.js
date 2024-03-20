/**
 * @jest-environment jsdom
 */

const fs = require("fs");
require("whatwg-fetch");
require("@testing-library/jest-dom");
const userEvent = require("@testing-library/user-event").default;

function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    document.open();
    document.write(html);
    document.close();
    jest.isolateModules(() => {
        require(jsPath);
    });
}

describe('Adding Data Functionality', function () {
    beforeEach(() => {
        // Initialize DOM from the HTML and JS files
        initDomFromFiles(
            __dirname + "/../line.html",
            __dirname + "/../line.js"
        );
        jest.resetModules();
        jest.restoreAllMocks();
    });

    test('“add values” button adds new pair of input fields without affecting existing data', async function () {
        const addValuesBtn = document.getElementById("add-values-btn");
        const user = userEvent.setup();

        // Check initial state
        let xValueInputsInitially = document.querySelectorAll(".x-value-input");
        let yValueInputsInitially = document.querySelectorAll(".y-value-input");
        expect(xValueInputsInitially.length).toBe(1);
        expect(yValueInputsInitially.length).toBe(1);

        // Click to add another pair of inputs
        await user.click(addValuesBtn);
        let xValueInputsAfterFirstClick = document.querySelectorAll(".x-value-input");
        let yValueInputsAfterFirstClick = document.querySelectorAll(".y-value-input");
        expect(xValueInputsAfterFirstClick.length).toBe(2);
        expect(yValueInputsAfterFirstClick.length).toBe(2);

        // Enter some data into the first pair of inputs
        await user.type(xValueInputsInitially[0], '5');
        await user.type(yValueInputsInitially[0], '10');

        // Ensure the data entered in the first pair of inputs remains unchanged after adding a new pair
        expect(xValueInputsAfterFirstClick[0].value).toBe('5');
        expect(yValueInputsAfterFirstClick[0].value).toBe('10');

        await user.click(addValuesBtn);
        let xValueInputsAfterSecondClick = document.querySelectorAll(".x-value-input");
        let yValueInputsAfterSecondClick = document.querySelectorAll(".y-value-input");
        expect(xValueInputsAfterSecondClick.length).toBe(3);
        expect(xValueInputsAfterSecondClick.length).toBe(3);

        expect(xValueInputsAfterSecondClick[0].value).toBe('5');
        expect(yValueInputsAfterSecondClick[0].value).toBe('10');

        // Check that the new inputs are empty and ready for new data
        expect(xValueInputsAfterSecondClick[1].value).toBe('');
        expect(yValueInputsAfterSecondClick[1].value).toBe('');
        expect(xValueInputsAfterSecondClick[2].value).toBe('');
        expect(yValueInputsAfterSecondClick[2].value).toBe('');

    });
});

describe('Generate Chart Alert Functionality', () => {
    let alertSpy;

    beforeEach(() => {
        // Initialize DOM from the HTML and JS files
        initDomFromFiles(
            __dirname + "/../line.html",
            __dirname + "/../line.js"
        );

        // Spy on window.alert
        alertSpy = jest.spyOn(window, "alert");
    });

    afterEach(() => {
        alertSpy.mockRestore();
        jest.resetModules();
        jest.restoreAllMocks();
    });

    test('displays an alert if axis labels are missing', async () => {
        const generateChartBtn = document.getElementById("generate-chart-btn");
        const xValueInput = document.querySelectorAll(".x-value-input");
        const yValueInput = document.querySelectorAll(".y-value-input");

        const user = userEvent.setup();

        // Input data values but no axis labels
        await user.type(xValueInput[0], '5');
        await user.type(yValueInput[0], '10');

        // Attempt to generate the chart without axis labels
        await user.click(generateChartBtn);

        // Verify alert was displayed
        expect(alertSpy).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Must specify a label for both X and Y"));
    });

    test('displays an alert if no data is supplied', async () => {
        const generateChartBtn = document.getElementById("generate-chart-btn");
        const xLabelInput = document.getElementById("x-label-input");
        const yLabelInput = document.getElementById("y-label-input");

        const user = userEvent.setup();

        // Supply axis labels but no data
        await user.type(xLabelInput, 'A');
        await user.type(yLabelInput, 'B');

        // These asserts aren't part of the final test, just using to debug as they fail when they should both pass (asserting that the data entry elements should be empty)
        //let xValueInput = document.querySelectorAll(".x-value-input");
        //let yValueInput = document.querySelectorAll(".y-value-input");
        //expect(xValueInput[0].value).toBe('');
        //expect(yValueInput[0].value).toBe('');


        // Attempt to generate the chart without data
        await user.click(generateChartBtn);

        // Verify alert was displayed
        expect(alertSpy).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("No data specified"));
    });
});

describe('Clear Chart Data Functionality', () => {
    beforeEach(() => {
        // Initialize DOM from the HTML and JS files
        initDomFromFiles(
            __dirname + "/../line.html",
            __dirname + "/../line.js"
        );
        jest.resetModules();
        jest.restoreAllMocks();
    });

    test('“clear chart data” button clears all user-entered data and resets input fields', async () => {
        const chartTitleInput = document.getElementById('chart-title-input');
        const chartColorInput = document.getElementById('chart-color-input');
        const xLabelInput = document.getElementById('x-label-input');
        const yLabelInput = document.getElementById('y-label-input');
        const addValuesBtn = document.getElementById('add-values-btn');
        const clearChartBtn = document.getElementById('clear-chart-btn');

        const user = userEvent.setup();

        // Simulate filling in chart data
        await user.type(chartTitleInput, 'Chart');
        await user.type(xLabelInput, 'A');
        await user.type(yLabelInput, 'B');
        chartColorInput.value = '#00ff00'; // Green

        // Add a couple of pairs of X & Y values
        await user.click(addValuesBtn);
        const xValueInputs = document.querySelectorAll('.x-value-input');
        const yValueInputs = document.querySelectorAll('.y-value-input');
        await user.type(xValueInputs[0], '1');
        await user.type(yValueInputs[0], '2');
        await user.type(xValueInputs[1], '3');
        await user.type(yValueInputs[1], '4');

        // Click the "clear chart data" button
        await user.click(clearChartBtn);

        // Verify that all inputs are cleared
        expect(chartTitleInput.value).toBe('');
        expect(xLabelInput.value).toBe('');
        expect(yLabelInput.value).toBe('');
        expect(chartColorInput.value).toBe('#ff4500'); // Default color
        expect(document.querySelectorAll('.x-value-input').length).toBe(1);
        expect(document.querySelectorAll('.y-value-input').length).toBe(1);
        expect(document.querySelectorAll('.x-value-input')[0].value).toBe('');
        expect(document.querySelectorAll('.y-value-input')[0].value).toBe('');
    });
});

describe('Generate Chart Sending Data to generateChartImg', () => {
    beforeEach(() => {
        // Initialize DOM from the HTML and JS files
        initDomFromFiles(
            __dirname + "/../line.html",
            __dirname + "/../line.js"
        );
        jest.resetModules();
        jest.restoreAllMocks();
    });

    test('generateChartImg is called with user-entered data', async () => {
        // Mock generateChartImg
        jest.mock(__dirname + '/../../lib/generateChartImg.js');
        const generateChartImg = require(__dirname + '/../../lib/generateChartImg.js');
        generateChartImg.mockImplementation(() => {
            return "http://placekitten.com/480/480";
        });

        const chartTitleInput = document.getElementById('chart-title-input');
        const chartColorInput = document.getElementById('chart-color-input');
        const xLabelInput = document.getElementById('x-label-input');
        const yLabelInput = document.getElementById('y-label-input');
        const generateChartBtn = document.getElementById('generate-chart-btn');

        const user = userEvent.setup();

        // Simulate filling in chart data
        await user.type(chartTitleInput, 'Chart Title');
        await user.type(xLabelInput, 'A');
        await user.type(yLabelInput, 'B');
        chartColorInput.value = '#00ff00';

        // Add X & Y values
        const xValueInputs = document.querySelectorAll('.x-value-input');
        const yValueInputs = document.querySelectorAll('.y-value-input');
        await user.type(xValueInputs[0], '1');
        await user.type(yValueInputs[0], '2');

        // Generate the chart
        await user.click(generateChartBtn);

        // Verify generateChartImg was called correctly
        expect(generateChartImg).toHaveBeenCalledWith(
            "line",
            [{ x: '1', y: '2' }],
            'A',
            'B',
            'Chart',
            '#ff4500'
        );
    });
});
