import { render } from '@testing-library/react';
import Timer from 'components/Timer/Timer'

describe("Timer component", () => {
    it("rendered TimerDiv", () => {
        const { getByTestId } = render(<Timer />);
        const div = getByTestId("TimerDiv");
        expect(div).toBeTruthy();
    })

    it("rendered TimerTimeDiv", () => {
        const { getByTestId } = render(<Timer />);
        const div = getByTestId("TimerTimeDiv");
        expect(div).toBeTruthy();
    })

    it("TimerTimeDiv should be init perfect", () => {
        const { getByTestId } = render(<Timer timeLimit={30} />);
        const div = getByTestId("TimerTimeDiv");
        expect(div.innerHTML).toBe("0s / 30s");
    })
})