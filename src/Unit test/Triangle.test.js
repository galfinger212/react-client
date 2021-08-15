import { render, act, fireEvent } from '@testing-library/react';
import Triangle from 'components/Triangle/Triangle'

describe("Triangle component", () => {
    it("rendered Triangle div", () => {
        const { getByTestId } = render(<Triangle />);
        const div = getByTestId("triangleDiv");
        expect(div).toBeTruthy();
    })

    it('should call mock function when Triangle is clicked', async () => {
        await act(async () => {
            const mockFn = jest.fn(() => { })
            const { getByTestId } = render(<Triangle onClick={mockFn} />);
            const div = getByTestId("triangleDiv");
            await fireEvent.click(div);
            expect(mockFn).toHaveBeenCalled();
        })
    });

    it('should not call mock function when Triangle is clicked', async () => {
        await act(async () => {
            const mockFn = jest.fn(() => { })
            const { getByTestId } = render(<Triangle />);
            const div = getByTestId("triangleDiv");
            await fireEvent.click(div);
            expect(mockFn).not.toHaveBeenCalled();
        })
    });
})