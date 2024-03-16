const sortPoints = require('../../lib/sortPoints');

// Describing the test suite for the sortPoints function
describe('sortPoints function', () => {
  
    // Within the sortPoints function suite, we're describing the sorting functionality
    describe('Sorting functionality', () => {

        // This is a specific test case within the sorting functionality suite
        test('sorts points in ascending order', () => {
            const points = [{ x: 10, y: 20 }, { x: 5, y: 10 }, { x: 7, y: 8 }];
            const sortedPoints = sortPoints(points);

            // We expect the sortedPoints array to be equal to the expected sorted array
            expect(sortedPoints).toEqual([{ x: 5, y: 10 }, { x: 7, y: 8 }, { x: 10, y: 20 }]);
        });

        // Test for handling empty array
        test('handles empty array', () => {
            const points = [];
            const sortedPoints = sortPoints(points);
            expect(sortedPoints).toEqual([]);
        });

        // Test for handling array with duplicate X values
        test('handles array with duplicate X values', () => {
            const points = [{ x: 5, y: 6 }, { x: 3, y: 2 }, { x: 3, y: 3 }];
            const sortedPoints = sortPoints(points);
            expect(sortedPoints).toEqual([{ x: 3, y: 2 }, { x: 3, y: 3 }, { x: 5, y: 6 }]);
        });

        // Test for not altering already sorted array
        test('does not alter already sorted array', () => {
            const points = [{ x: 1, y: 2 }, { x: 3, y: 6 }, { x: 5, y: 3 }];
            const sortedPoints = sortPoints(points);
            expect(sortedPoints).toBe(points);
        });
    });
});
