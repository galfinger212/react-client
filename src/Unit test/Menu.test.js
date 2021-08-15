import { render } from '@testing-library/react';
import Menu from 'UIKit/Elements/Menu'
describe("Menu component", () => {
    it("rendered MenuDiv", () => {
        const { getByTestId } = render(<Menu />);
        const div = getByTestId("MenuDiv");
        expect(div).toBeTruthy();
    })

    it("rendered MenuHeaderDiv", () => {
        const { getByTestId } = render(<Menu />);
        const div = getByTestId("MenuHeaderDiv");
        expect(div).toBeTruthy();
    })

    it("rendered MenuTitleSpan", () => {
        const { getByTestId } = render(<Menu />);
        const span = getByTestId("MenuTitleSpan");
        expect(span).toBeTruthy();
    })

    it("rendered MenuTitleSpan with title ", () => {
        const { getByTestId } = render(<Menu title="menuMock" />);
        const span = getByTestId("MenuTitleSpan");
        expect(span.innerHTML).not.toBe("");
    })

    it("rendered MenuTitleSpan with no title ", () => {
        const { getByTestId } = render(<Menu />);
        const span = getByTestId("MenuTitleSpan");
        expect(span.innerHTML).toBe("");
    })

    it("rendered MenuList when isOpen = false", async () => {
        const { queryByTestId } = render(<Menu />);
        const div = queryByTestId("MenuList");
        expect(div).toBeFalsy();
    })

})