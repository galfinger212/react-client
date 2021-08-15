import { render } from '@testing-library/react';
import Line from 'UIKit/Layouts/Line'
describe("Line component", () => {
    it("rendered LineDiv", () => {
        const { getByTestId } = render(<Line />);
        const div = getByTestId("LineDiv");
        expect(div).toBeTruthy();
    })

    it("rendered LineDiv with no children's", () => {
        const { getByTestId } = render(<Line />);
        const div = getByTestId("LineDiv");
        expect(div.children.length).toBe(0);
    })

    it("rendered LineDiv with children's", () => {
        const { getByTestId } = render(<Line><div>children</div></Line>);
        const div = getByTestId("LineDiv");
        expect(div.children.length).toBe(1);
    })
})