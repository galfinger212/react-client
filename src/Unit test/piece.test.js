import { render, act, fireEvent } from '@testing-library/react';
import Piece from 'components/Piece/Piece'

describe("piece component", () => {
    it("rendered Piece div", () => {
        const { getByTestId } = render(<Piece />);
        const div = getByTestId("divPiece");
        expect(div).toBeTruthy();
    })

    it('should call mock function when piece is clicked', async () => {
        await act(async () => {
            const mockFn = jest.fn(() => { })
            const { getByTestId } = render(<Piece onClick={mockFn} />);
            const div = getByTestId("divPiece");
            await fireEvent.click(div);
            expect(mockFn).toHaveBeenCalled();
        })
    });

    it('should not call mock function when piece is clicked', async () => {
        await act(async () => {
            const mockFn = jest.fn(() => { })
            const { getByTestId } = render(<Piece />);
            const div = getByTestId("divPiece");
            await fireEvent.click(div);
            expect(mockFn).not.toHaveBeenCalled();
        })
    });
})