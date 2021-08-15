import { render } from '@testing-library/react';
import Icon from 'UIKit/Elements/Icon'
describe("Icon component", () => {
    it("rendered IconDiv", () => {
        const { getByTestId } = render(<Icon />);
        const div = getByTestId("IconDiv");
        expect(div).toBeTruthy();
    })

    it("rendered IconImageDiv", () => {
        const { getByTestId } = render(<Icon />);
        const div = getByTestId("IconImageDiv");
        expect(div).toBeTruthy();
    })

    it("rendered IconImageDiv with icon ", () => {
        const { getByTestId } = render(<Icon i="facebook" />);
        const div = getByTestId("IconImageDiv");
        expect(div.className).not.toBe("");
    })

    it("rendered IconImageDiv with no icon ", () => {
        const { getByTestId } = render(<Icon />);
        const div = getByTestId("IconImageDiv");
        expect(div.className).toBe("");
    })
})